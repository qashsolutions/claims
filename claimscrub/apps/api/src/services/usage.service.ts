import { prisma } from '../db/index.js'

// Plan limits
export const TRIAL_CLAIMS_PER_DAY = 1
export const TRIAL_MB_PER_DAY = 10
export const TRIAL_BYTES_PER_DAY = TRIAL_MB_PER_DAY * 1024 * 1024 // 10 MB

export const PAID_MB_PER_DAY = 30
export const PAID_BYTES_PER_DAY = PAID_MB_PER_DAY * 1024 * 1024 // 30 MB

// Pay-per-claim has no daily limit (they pay for each claim)
export const PAY_PER_CLAIM_MB_PER_CLAIM = 50
export const PAY_PER_CLAIM_BYTES_PER_CLAIM = PAY_PER_CLAIM_MB_PER_CLAIM * 1024 * 1024 // 50 MB per claim

type PlanType = 'FREE_TRIAL' | 'PAY_PER_CLAIM' | 'UNLIMITED_MONTHLY' | 'UNLIMITED_ANNUAL'
type SubStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID'

/**
 * Get the daily byte limit for a plan
 */
function getDailyBytesLimit(planType: PlanType | undefined, status: SubStatus | undefined): number {
  if (status === 'TRIALING') {
    return TRIAL_BYTES_PER_DAY
  }

  switch (planType) {
    case 'PAY_PER_CLAIM':
      return Infinity // No daily limit, but per-claim limit applies
    case 'UNLIMITED_MONTHLY':
    case 'UNLIMITED_ANNUAL':
      return PAID_BYTES_PER_DAY
    default:
      return TRIAL_BYTES_PER_DAY // Default to trial limit
  }
}

/**
 * Check if a user can upload files of the given size
 * @param practiceId - The practice ID
 * @param fileSizeBytes - Size of files to upload in bytes
 * @returns Object with allowed status and remaining bytes
 */
export async function checkUploadLimit(
  practiceId: string,
  fileSizeBytes: number
): Promise<{
  allowed: boolean
  usedToday: number
  remainingBytes: number
  limitBytes: number
  planType: PlanType | null
  message?: string
}> {
  const subscription = await prisma.subscription.findFirst({
    where: { practice: { id: practiceId } },
  })

  // No subscription = no access
  if (!subscription) {
    return {
      allowed: false,
      usedToday: 0,
      remainingBytes: 0,
      limitBytes: 0,
      planType: null,
      message: 'No active subscription. Please subscribe to continue.',
    }
  }

  const planType = subscription.plan as PlanType
  const status = subscription.status as SubStatus
  const dailyLimit = getDailyBytesLimit(planType, status)

  // Get today's start (midnight)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  // Sum bytes uploaded today
  const usageRecords = await prisma.usageRecord.aggregate({
    where: {
      subscriptionId: subscription.id,
      createdAt: { gte: todayStart },
    },
    _sum: { sizeBytes: true },
  })

  const usedToday = usageRecords._sum.sizeBytes || 0
  const remainingBytes = dailyLimit === Infinity ? Infinity : dailyLimit - usedToday
  const wouldExceed = dailyLimit !== Infinity && usedToday + fileSizeBytes > dailyLimit

  // Build appropriate message based on plan
  let message: string | undefined
  if (wouldExceed) {
    const limitMB = dailyLimit / 1024 / 1024
    const usedMB = (usedToday / 1024 / 1024).toFixed(1)

    if (status === 'TRIALING') {
      message = `Trial limit reached. You can upload ${TRIAL_MB_PER_DAY}MB per day during your free trial. Used: ${usedMB}MB. Upgrade to continue.`
    } else {
      message = `Daily upload limit reached (${limitMB}MB/day). Used: ${usedMB}MB. Limit resets at midnight.`
    }
  }

  return {
    allowed: !wouldExceed,
    usedToday,
    remainingBytes: Math.max(0, remainingBytes),
    limitBytes: dailyLimit,
    planType,
    message,
  }
}

// Alias for backward compatibility
export const checkTrialUploadLimit = checkUploadLimit

/**
 * Record file upload usage for a subscription
 * @param subscriptionId - The subscription ID
 * @param userId - The user ID who uploaded
 * @param claimId - The claim ID associated with this upload
 * @param sizeBytes - Size of uploaded files in bytes
 */
export async function recordUploadUsage(
  subscriptionId: string,
  userId: string,
  claimId: string,
  sizeBytes: number
): Promise<void> {
  await prisma.usageRecord.create({
    data: {
      subscriptionId,
      userId,
      claimId,
      sizeBytes,
    },
  })
}

/**
 * Get usage stats for a practice
 * @param practiceId - The practice ID
 * @returns Usage statistics
 */
export async function getUsageStats(practiceId: string): Promise<{
  claimsToday: number
  bytesToday: number
  planType: PlanType | null
  status: SubStatus | null
  limits: {
    claimsPerDay: number | null
    bytesPerDay: number | null
  }
}> {
  const subscription = await prisma.subscription.findFirst({
    where: { practice: { id: practiceId } },
  })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [claimsToday, bytesUsed] = await Promise.all([
    prisma.claim.count({
      where: {
        practiceId,
        createdAt: { gte: todayStart },
      },
    }),
    subscription
      ? prisma.usageRecord.aggregate({
          where: {
            subscriptionId: subscription.id,
            createdAt: { gte: todayStart },
          },
          _sum: { sizeBytes: true },
        })
      : { _sum: { sizeBytes: 0 } },
  ])

  const planType = subscription?.plan as PlanType | null
  const status = subscription?.status as SubStatus | null
  const isTrialing = status === 'TRIALING'
  const dailyLimit = subscription ? getDailyBytesLimit(planType!, status!) : null

  return {
    claimsToday,
    bytesToday: bytesUsed._sum.sizeBytes || 0,
    planType,
    status,
    limits: {
      claimsPerDay: isTrialing ? TRIAL_CLAIMS_PER_DAY : null, // Unlimited for paid plans
      bytesPerDay: dailyLimit,
    },
  }
}

/**
 * Get usage records for a specific user (for audit purposes)
 * @param userId - The user ID
 * @param days - Number of days to look back (default 30)
 */
export async function getUserUsageHistory(
  userId: string,
  days = 30
): Promise<{
  records: Array<{
    id: string
    claimId: string
    sizeBytes: number
    createdAt: Date
  }>
  totalBytes: number
}> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const records = await prisma.usageRecord.findMany({
    where: {
      userId,
      createdAt: { gte: startDate },
    },
    select: {
      id: true,
      claimId: true,
      sizeBytes: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalBytes = records.reduce((sum, r) => sum + r.sizeBytes, 0)

  return { records, totalBytes }
}
