import { prisma } from '../db/index.js'

// Trial limits
export const TRIAL_CLAIMS_PER_DAY = 1
export const TRIAL_MB_PER_DAY = 10
export const TRIAL_BYTES_PER_DAY = TRIAL_MB_PER_DAY * 1024 * 1024 // 10 MB

/**
 * Check if a trial user can upload files of the given size
 * @param practiceId - The practice ID
 * @param fileSizeBytes - Size of files to upload in bytes
 * @returns Object with allowed status and remaining bytes
 */
export async function checkTrialUploadLimit(
  practiceId: string,
  fileSizeBytes: number
): Promise<{
  allowed: boolean
  usedToday: number
  remainingBytes: number
  limitBytes: number
  message?: string
}> {
  const subscription = await prisma.subscription.findFirst({
    where: { practiceId },
  })

  // Non-trial users have no upload limit
  if (!subscription || subscription.status !== 'TRIALING') {
    return {
      allowed: true,
      usedToday: 0,
      remainingBytes: Infinity,
      limitBytes: Infinity,
    }
  }

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
  const remainingBytes = TRIAL_BYTES_PER_DAY - usedToday
  const wouldExceed = usedToday + fileSizeBytes > TRIAL_BYTES_PER_DAY

  return {
    allowed: !wouldExceed,
    usedToday,
    remainingBytes: Math.max(0, remainingBytes),
    limitBytes: TRIAL_BYTES_PER_DAY,
    message: wouldExceed
      ? `Trial limit reached. You can upload ${TRIAL_MB_PER_DAY}MB per day during your free trial. Used: ${(usedToday / 1024 / 1024).toFixed(1)}MB. Upgrade to continue.`
      : undefined,
  }
}

/**
 * Record file upload usage for a subscription
 * @param subscriptionId - The subscription ID
 * @param claimId - The claim ID associated with this upload
 * @param sizeBytes - Size of uploaded files in bytes
 */
export async function recordUploadUsage(
  subscriptionId: string,
  claimId: string,
  sizeBytes: number
): Promise<void> {
  await prisma.usageRecord.create({
    data: {
      subscriptionId,
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
  isTrialing: boolean
  limits: {
    claimsPerDay: number | null
    bytesPerDay: number | null
  }
}> {
  const subscription = await prisma.subscription.findFirst({
    where: { practiceId },
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

  const isTrialing = subscription?.status === 'TRIALING'

  return {
    claimsToday,
    bytesToday: bytesUsed._sum.sizeBytes || 0,
    isTrialing,
    limits: {
      claimsPerDay: isTrialing ? TRIAL_CLAIMS_PER_DAY : null,
      bytesPerDay: isTrialing ? TRIAL_BYTES_PER_DAY : null,
    },
  }
}
