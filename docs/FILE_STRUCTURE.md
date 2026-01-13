# ClaimScrub - Project File Structure

## Overview

Monorepo architecture with modern, type-safe, and scalable stack.
100% agentic UX with XState state machine orchestration.

```
claimscrub/
├── apps/
│   ├── web/                    # React PWA (Vite)
│   └── api/                    # Hono + tRPC API
├── packages/
│   ├── shared/                 # Shared types, constants
│   ├── ui/                     # Radix + Tailwind components
│   ├── validators/             # Claim validation logic
│   └── agentic-engine/         # XState flow orchestration
├── docs/
├── scripts/
└── config files
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | React | 19 | UI library |
| **Bundler** | Vite | 6 | Fast builds, HMR |
| **Language** | TypeScript | 5.4 | Type safety |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS |
| **Components** | Radix UI | Latest | Accessible primitives |
| **API Runtime** | Hono | 4 | Fast, edge-ready |
| **Type-Safe API** | tRPC | 11 | End-to-end types |
| **Data Fetching** | TanStack Query | 5 | Caching, mutations |
| **Client State** | Zustand | 5 | Simple state |
| **Flow State** | XState | 5 | Agentic state machine |
| **Database** | PostgreSQL | 16 | Relational data |
| **ORM** | Prisma | 5 | Type-safe queries |
| **Auth** | Supabase Auth | Latest | MFA, HIPAA ready |
| **Cache** | Upstash Redis | Serverless | Rate limiting, cache |
| **Queue** | Trigger.dev | 3 | Background jobs |
| **Hosting** | Vercel | Enterprise | Edge, HIPAA BAA |
| **Payments** | Stripe | Latest | Usage billing |
| **AI** | Claude API | Latest | Health connectors |
| **Dev Tools** | Storybook | 8 | Component dev |
| **Monorepo** | Turborepo | 2 | Build orchestration |
| **Package Manager** | pnpm | 9 | Fast, efficient |

---

## Root Structure

```
claimscrub/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── shared/
│   ├── ui/
│   ├── validators/
│   └── agentic-engine/
├── docs/
│   ├── api/
│   ├── architecture/
│   └── deployment/
├── scripts/
│   ├── setup.sh
│   └── deploy.sh
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── security.yml
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── biome.json                  # Linting + formatting
└── README.md
```

---

## Frontend (apps/web)

```
apps/web/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icons/
│   └── fonts/
│       ├── merriweather/
│       ├── inter/
│       └── jetbrains-mono/
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── ui/                     # Base components (from packages/ui)
│   │   │   └── index.ts            # Re-exports
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNav.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── MFAInput.tsx
│   │   │   ├── EpicOAuthButton.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── agentic/                # Agentic flow UI
│   │   │   ├── FlowProvider.tsx        # XState context provider
│   │   │   ├── FlowContainer.tsx       # Main flow wrapper
│   │   │   ├── ProgressSteps.tsx
│   │   │   ├── KeyboardHint.tsx
│   │   │   ├── steps/
│   │   │   │   ├── PatientContext.tsx
│   │   │   │   ├── ProcedureSelect.tsx
│   │   │   │   ├── DiagnosisMatch.tsx
│   │   │   │   ├── AuthCheck.tsx
│   │   │   │   └── ReviewSubmit.tsx
│   │   │   ├── SuggestionCard.tsx
│   │   │   ├── ValidationInline.tsx
│   │   │   ├── ConfirmButton.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── claims/
│   │   │   ├── ClaimsList.tsx
│   │   │   ├── ClaimCard.tsx
│   │   │   ├── ClaimFilters.tsx
│   │   │   ├── ClaimBulkActions.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── validation/
│   │   │   ├── ValidationResult.tsx
│   │   │   ├── ValidationCheck.tsx
│   │   │   ├── DenialRiskBadge.tsx
│   │   │   ├── SuggestedFix.tsx
│   │   │   ├── CoveragePanel.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   ├── SuggestedQueries.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── billing/
│   │   │   ├── PricingCards.tsx
│   │   │   ├── PlanComparison.tsx
│   │   │   ├── UsageStats.tsx
│   │   │   ├── PaymentMethod.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── dashboard/
│   │       ├── StatCard.tsx
│   │       ├── QuickActions.tsx
│   │       ├── RecentValidations.tsx
│   │       ├── DenialRiskChart.tsx
│   │       └── index.ts
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── MFASetupPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   │
│   │   ├── onboarding/
│   │   │   ├── OnboardingFlow.tsx
│   │   │   └── steps/
│   │   │       ├── WelcomeStep.tsx
│   │   │       ├── EpicConnectStep.tsx
│   │   │       ├── PracticeProfileStep.tsx
│   │   │       ├── MFASetupStep.tsx
│   │   │       └── FirstClaimStep.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   │
│   │   ├── claims/
│   │   │   ├── ClaimsListPage.tsx
│   │   │   ├── NewClaimPage.tsx        # Uses FlowProvider
│   │   │   └── ClaimDetailPage.tsx
│   │   │
│   │   ├── chat/
│   │   │   └── ChatPage.tsx
│   │   │
│   │   ├── settings/
│   │   │   ├── SettingsLayout.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── BillingPage.tsx
│   │   │   ├── IntegrationsPage.tsx
│   │   │   └── SecurityPage.tsx
│   │   │
│   │   └── public/
│   │       ├── LandingPage.tsx
│   │       └── PricingPage.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEpic.ts
│   │   ├── useClaims.ts
│   │   ├── useValidation.ts
│   │   ├── useChat.ts
│   │   ├── useVoice.ts
│   │   ├── useAgenticFlow.ts           # XState hook
│   │   ├── useKeyboardNav.ts           # Tab+Enter
│   │   ├── useFocusManager.ts          # Focus control
│   │   └── useToast.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── trpc.ts                     # tRPC client
│   │   ├── query-client.ts             # TanStack Query
│   │   ├── supabase.ts                 # Auth client
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── keyboard.ts
│   │
│   ├── types/
│   │   └── index.ts                    # Re-export from shared
│   │
│   └── styles/
│       ├── globals.css
│       └── fonts.css
│
├── .storybook/
│   ├── main.ts
│   └── preview.ts
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Backend (apps/api)

```
apps/api/
├── src/
│   ├── index.ts                    # Entry point
│   ├── app.ts                      # Hono app setup
│   │
│   ├── config/
│   │   ├── index.ts
│   │   ├── env.ts                  # Zod env validation
│   │   └── constants.ts
│   │
│   ├── trpc/                       # tRPC setup
│   │   ├── index.ts
│   │   ├── context.ts              # Request context
│   │   ├── router.ts               # Root router
│   │   ├── middleware.ts           # Auth, logging
│   │   └── procedures/
│   │       ├── auth.ts
│   │       ├── claims.ts
│   │       ├── validation.ts
│   │       ├── epic.ts
│   │       ├── chat.ts
│   │       ├── billing.ts
│   │       └── index.ts
│   │
│   ├── services/
│   │   ├── claims.service.ts
│   │   ├── validation.service.ts
│   │   ├── chat.service.ts
│   │   │
│   │   ├── connectors/             # Claude Health Connectors
│   │   │   ├── index.ts
│   │   │   ├── base.connector.ts
│   │   │   ├── icd10.connector.ts
│   │   │   ├── cms.connector.ts
│   │   │   ├── npi.connector.ts
│   │   │   └── pubmed.connector.ts
│   │   │
│   │   ├── epic/                   # Epic FHIR
│   │   │   ├── index.ts
│   │   │   ├── client.ts           # FHIR client
│   │   │   ├── oauth.ts
│   │   │   ├── patient.ts
│   │   │   ├── condition.ts
│   │   │   ├── procedure.ts
│   │   │   ├── coverage.ts
│   │   │   └── authorization.ts
│   │   │
│   │   ├── stripe/
│   │   │   ├── index.ts
│   │   │   ├── subscriptions.ts
│   │   │   ├── usage.ts
│   │   │   └── webhooks.ts
│   │   │
│   │   ├── claude/
│   │   │   ├── index.ts
│   │   │   ├── client.ts
│   │   │   └── prompts.ts
│   │   │
│   │   └── cache/
│   │       ├── index.ts
│   │       └── redis.ts            # Upstash Redis
│   │
│   ├── middleware/
│   │   ├── index.ts
│   │   ├── security.ts             # Headers, CORS, CSP
│   │   ├── rateLimit.ts            # Upstash rate limiting
│   │   ├── audit.ts                # HIPAA audit logging
│   │   └── error.ts
│   │
│   ├── jobs/                       # Trigger.dev jobs
│   │   ├── index.ts
│   │   ├── claim-submit.ts
│   │   ├── auth-check.ts
│   │   └── notification.ts
│   │
│   ├── db/
│   │   ├── index.ts                # Prisma client
│   │   ├── queries/
│   │   │   ├── claims.ts
│   │   │   ├── users.ts
│   │   │   └── validations.ts
│   │   └── extensions/
│   │       └── encryption.ts       # Field-level encryption
│   │
│   ├── utils/
│   │   ├── logger.ts               # Pino logger
│   │   ├── encryption.ts
│   │   ├── npi-luhn.ts
│   │   └── response.ts
│   │
│   └── types/
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── trigger.config.ts               # Trigger.dev config
├── tsconfig.json
└── package.json
```

---

## Agentic Engine (packages/agentic-engine)

```
packages/agentic-engine/
├── src/
│   ├── index.ts
│   │
│   ├── machines/
│   │   ├── claim-flow.machine.ts       # Main flow machine
│   │   ├── onboarding.machine.ts       # Onboarding flow
│   │   └── index.ts
│   │
│   ├── states/
│   │   ├── patient-context.ts
│   │   ├── procedure-select.ts
│   │   ├── diagnosis-match.ts
│   │   ├── auth-check.ts
│   │   ├── review-submit.ts
│   │   └── index.ts
│   │
│   ├── actions/                        # Side effects
│   │   ├── fetch-patient.ts
│   │   ├── validate-codes.ts
│   │   ├── check-auth.ts
│   │   ├── submit-claim.ts
│   │   └── index.ts
│   │
│   ├── guards/                         # Transition conditions
│   │   ├── is-valid-patient.ts
│   │   ├── is-valid-procedure.ts
│   │   ├── is-auth-required.ts
│   │   └── index.ts
│   │
│   ├── context/
│   │   ├── types.ts                    # Flow context types
│   │   └── initial.ts                  # Initial context
│   │
│   ├── events/
│   │   ├── types.ts                    # Event definitions
│   │   └── creators.ts                 # Event factories
│   │
│   └── hooks/
│       ├── useFlowMachine.ts           # React hook
│       ├── useFlowState.ts
│       └── useFlowActions.ts
│
├── tests/
│   ├── machines/
│   └── guards/
│
├── tsconfig.json
└── package.json
```

---

## Shared Package (packages/shared)

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── claim.ts
│   │   ├── patient.ts
│   │   ├── provider.ts
│   │   ├── validation.ts
│   │   ├── epic.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── constants/
│   │   ├── denial-codes.ts
│   │   ├── specialties.ts
│   │   ├── modifiers.ts
│   │   ├── place-of-service.ts
│   │   ├── payers.ts
│   │   └── index.ts
│   │
│   ├── schemas/                    # Zod schemas
│   │   ├── claim.schema.ts
│   │   ├── patient.schema.ts
│   │   ├── validation.schema.ts
│   │   └── index.ts
│   │
│   └── utils/
│       ├── formatters.ts
│       ├── validators.ts
│       └── index.ts
│
├── tsconfig.json
└── package.json
```

---

## UI Package (packages/ui)

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── Card.stories.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.stories.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Select/
│   │   ├── Badge/
│   │   ├── Modal/
│   │   ├── Tabs/
│   │   ├── Table/
│   │   ├── Toast/
│   │   ├── Tooltip/
│   │   ├── Dropdown/
│   │   │
│   │   └── index.ts
│   │
│   ├── primitives/                 # Radix wrappers
│   │   ├── Dialog.tsx
│   │   ├── Popover.tsx
│   │   ├── Select.tsx
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                   # Class merge utility
│   │   └── focus.ts                # Focus management
│   │
│   └── index.ts
│
├── .storybook/
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## Validators Package (packages/validators)

```
packages/validators/
├── src/
│   ├── index.ts
│   │
│   ├── engine/
│   │   ├── rule-engine.ts
│   │   ├── rule-types.ts
│   │   └── index.ts
│   │
│   ├── rules/
│   │   ├── cpt-icd-match.ts
│   │   ├── modifier-rules.ts
│   │   ├── npi-validator.ts
│   │   ├── timely-filing.ts
│   │   ├── ncci-edits.ts
│   │   ├── data-completeness.ts
│   │   └── index.ts
│   │
│   ├── specialty/
│   │   ├── oncology.ts
│   │   ├── mental-health.ts
│   │   ├── obgyn.ts
│   │   ├── endocrinology.ts
│   │   └── index.ts
│   │
│   └── data/
│       ├── cpt-icd-mappings.json
│       ├── ncci-edits.json
│       └── modifier-rules.json
│
├── tests/
├── tsconfig.json
└── package.json
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================
// USERS & PRACTICES
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  mfaSecret     String?   @db.Text  // Encrypted
  mfaEnabled    Boolean   @default(false)
  role          UserRole  @default(BILLING_STAFF)

  practiceId    String
  practice      Practice  @relation(fields: [practiceId], references: [id])

  epicUserId    String?
  epicTokens    Json?     @db.JsonB  // Encrypted OAuth tokens

  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  claims        Claim[]
  auditLogs     AuditLog[]

  @@index([email])
  @@index([practiceId])
}

model Practice {
  id            String    @id @default(cuid())
  name          String
  npi           String    @unique
  taxId         String?   // Encrypted
  specialty     Specialty
  address       Json?

  epicOrgId     String?
  epicConnected Boolean   @default(false)

  subscriptionId String?  @unique
  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  users         User[]
  claims        Claim[]

  @@index([npi])
}

// ============================================
// CLAIMS
// ============================================

model Claim {
  id            String      @id @default(cuid())
  claimNumber   String      @unique @default(cuid())

  // Patient (encrypted fields)
  patientName   String      @db.Text  // Encrypted
  patientDob    DateTime
  patientGender String
  insuranceId   String      @db.Text  // Encrypted
  payerName     String
  payerId       String?

  // Provider
  providerNpi   String
  providerName  String

  // Service
  dateOfService DateTime
  placeOfService String
  priorAuthNumber String?

  // Status
  status        ClaimStatus @default(DRAFT)
  score         Int?
  totalCharge   Decimal     @db.Decimal(10, 2)

  // Relations
  practiceId    String
  practice      Practice    @relation(fields: [practiceId], references: [id])

  createdById   String
  createdBy     User        @relation(fields: [createdById], references: [id])

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  submittedAt   DateTime?

  serviceLines  ServiceLine[]
  validations   Validation[]

  @@index([practiceId])
  @@index([status])
  @@index([createdAt])
  @@index([dateOfService])
}

model ServiceLine {
  id            String    @id @default(cuid())
  lineNumber    Int

  claimId       String
  claim         Claim     @relation(fields: [claimId], references: [id], onDelete: Cascade)

  cptCode       String
  cptDescription String?
  modifiers     String[]
  icdCodes      String[]
  drugCode      String?
  drugUnits     Int?
  units         Int       @default(1)
  charge        Decimal   @db.Decimal(10, 2)

  createdAt     DateTime  @default(now())

  @@index([claimId])
}

model Validation {
  id            String           @id @default(cuid())

  claimId       String
  claim         Claim            @relation(fields: [claimId], references: [id], onDelete: Cascade)

  checkType     ValidationCheck
  status        ValidationStatus
  denialCode    String?
  message       String
  suggestion    String?
  metadata      Json?

  createdAt     DateTime         @default(now())

  @@index([claimId])
  @@index([status])
}

// ============================================
// BILLING
// ============================================

model Subscription {
  id                  String    @id @default(cuid())
  stripeCustomerId    String    @unique
  stripeSubscriptionId String?  @unique

  plan                PlanType
  status              SubStatus

  currentPeriodStart  DateTime?
  currentPeriodEnd    DateTime?

  claimsThisPeriod    Int       @default(0)

  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  practice            Practice?
  usageRecords        UsageRecord[]

  @@index([stripeCustomerId])
}

model UsageRecord {
  id              String    @id @default(cuid())

  subscriptionId  String
  subscription    Subscription @relation(fields: [subscriptionId], references: [id])

  claimId         String
  sizeBytes       Int

  createdAt       DateTime  @default(now())

  @@index([subscriptionId])
  @@index([createdAt])
}

// ============================================
// AUDIT & SECURITY
// ============================================

model AuditLog {
  id            String    @id @default(cuid())

  userId        String
  user          User      @relation(fields: [userId], references: [id])

  action        AuditAction
  resource      String
  resourceId    String
  metadata      Json?
  ipAddress     String
  userAgent     String?

  createdAt     DateTime  @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@index([resourceId])
}

model RateLimit {
  id            String    @id
  count         Int       @default(0)
  resetAt       DateTime

  @@index([resetAt])
}

// ============================================
// ENUMS
// ============================================

enum UserRole {
  PROVIDER
  BILLING_STAFF
  ADMIN
}

enum Specialty {
  ONCOLOGY
  MENTAL_HEALTH
  OBGYN
  ENDOCRINOLOGY
}

enum ClaimStatus {
  DRAFT
  VALIDATING
  VALIDATED
  SUBMITTED
  ACCEPTED
  PAID
  DENIED
  APPEALING
}

enum ValidationCheck {
  CPT_ICD_MATCH
  NPI_VERIFY
  MODIFIER_CHECK
  PRIOR_AUTH
  DATA_COMPLETENESS
  TIMELY_FILING
  NCCI_EDITS
}

enum ValidationStatus {
  PASS
  WARNING
  FAIL
}

enum PlanType {
  FREE_TRIAL
  PAY_PER_CLAIM
  UNLIMITED_MONTHLY
  UNLIMITED_ANNUAL
}

enum SubStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
}

enum AuditAction {
  LOGIN
  LOGOUT
  VIEW_CLAIM
  CREATE_CLAIM
  UPDATE_CLAIM
  DELETE_CLAIM
  SUBMIT_CLAIM
  VIEW_PATIENT
  EXPORT_DATA
  CHANGE_SETTINGS
}
```

---

## Security Middleware

```typescript
// apps/api/src/middleware/security.ts

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
})

export const securityMiddleware = new Hono()

// CORS
securityMiddleware.use('*', cors({
  origin: process.env.FRONTEND_URL!,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

// Security Headers
securityMiddleware.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", process.env.SUPABASE_URL!],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
  },
  xContentTypeOptions: 'nosniff',
  xFrameOptions: 'DENY',
  xXssProtection: '1; mode=block',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
  referrerPolicy: 'strict-origin-when-cross-origin',
}))

// Rate Limiting
securityMiddleware.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || 'unknown'
  const { success, limit, remaining, reset } = await ratelimit.limit(ip)

  c.header('X-RateLimit-Limit', limit.toString())
  c.header('X-RateLimit-Remaining', remaining.toString())
  c.header('X-RateLimit-Reset', reset.toString())

  if (!success) {
    return c.json({ error: 'Too many requests' }, 429)
  }

  await next()
})
```

---

## XState Flow Machine

```typescript
// packages/agentic-engine/src/machines/claim-flow.machine.ts

import { setup, assign, fromPromise } from 'xstate'
import type { ClaimFlowContext, ClaimFlowEvent } from '../context/types'

export const claimFlowMachine = setup({
  types: {
    context: {} as ClaimFlowContext,
    events: {} as ClaimFlowEvent,
  },
  actors: {
    fetchPatient: fromPromise(async ({ input }) => {
      // Fetch patient from Epic FHIR
    }),
    validateCodes: fromPromise(async ({ input }) => {
      // Validate CPT-ICD match
    }),
    checkAuth: fromPromise(async ({ input }) => {
      // Check prior auth requirements
    }),
    submitClaim: fromPromise(async ({ input }) => {
      // Submit claim
    }),
  },
  guards: {
    isValidPatient: ({ context }) => !!context.patient?.id,
    isValidProcedure: ({ context }) => !!context.procedure?.cptCode,
    isValidDiagnosis: ({ context }) => context.diagnoses.length > 0,
    isAuthRequired: ({ context }) => context.authRequired === true,
    hasValidAuth: ({ context }) => !!context.authorization?.number,
  },
}).createMachine({
  id: 'claimFlow',
  initial: 'patientContext',
  context: {
    patient: null,
    procedure: null,
    diagnoses: [],
    modifiers: [],
    authorization: null,
    authRequired: false,
    validations: [],
    score: null,
  },
  states: {
    patientContext: {
      on: {
        CONFIRM_PATIENT: {
          target: 'procedureSelect',
          guard: 'isValidPatient',
          actions: assign({ patient: ({ event }) => event.patient }),
        },
        EDIT_PATIENT: 'patientEdit',
      },
    },
    patientEdit: {
      on: {
        SAVE_PATIENT: {
          target: 'patientContext',
          actions: assign({ patient: ({ event }) => event.patient }),
        },
        CANCEL: 'patientContext',
      },
    },
    procedureSelect: {
      on: {
        SELECT_PROCEDURE: {
          target: 'diagnosisMatch',
          actions: assign({ procedure: ({ event }) => event.procedure }),
        },
        BACK: 'patientContext',
      },
    },
    diagnosisMatch: {
      on: {
        APPLY_DIAGNOSIS: {
          target: 'authCheck',
          actions: assign({
            diagnoses: ({ event }) => event.diagnoses,
          }),
        },
        BACK: 'procedureSelect',
      },
    },
    authCheck: {
      entry: 'checkAuthRequirements',
      on: {
        USE_AUTH: {
          target: 'reviewSubmit',
          actions: assign({ authorization: ({ event }) => event.auth }),
        },
        SKIP_AUTH: {
          target: 'reviewSubmit',
          guard: ({ context }) => !context.authRequired,
        },
        REQUEST_AUTH: 'authRequest',
        BACK: 'diagnosisMatch',
      },
    },
    authRequest: {
      on: {
        AUTH_RECEIVED: {
          target: 'reviewSubmit',
          actions: assign({ authorization: ({ event }) => event.auth }),
        },
        CANCEL: 'authCheck',
      },
    },
    reviewSubmit: {
      on: {
        SUBMIT: 'submitting',
        EDIT_PATIENT: 'patientEdit',
        EDIT_PROCEDURE: 'procedureSelect',
        EDIT_DIAGNOSIS: 'diagnosisMatch',
        BACK: 'authCheck',
      },
    },
    submitting: {
      invoke: {
        src: 'submitClaim',
        input: ({ context }) => context,
        onDone: {
          target: 'success',
          actions: assign({ claimId: ({ event }) => event.output.claimId }),
        },
        onError: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    success: {
      type: 'final',
    },
    error: {
      on: {
        RETRY: 'submitting',
        EDIT: 'reviewSubmit',
      },
    },
  },
})
```

---

## Environment Variables

```bash
# .env.example

# ============================================
# APP
# ============================================
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3001

# ============================================
# DATABASE
# ============================================
DATABASE_URL=postgresql://postgres:password@localhost:5432/claimscrub

# ============================================
# SUPABASE AUTH
# ============================================
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# ============================================
# EPIC FHIR
# ============================================
EPIC_CLIENT_ID=xxx
EPIC_CLIENT_SECRET=xxx
EPIC_REDIRECT_URI=http://localhost:5173/auth/epic/callback
EPIC_SANDBOX_URL=https://fhir.epic.com/interconnect-fhir-oauth
EPIC_FHIR_BASE_URL=https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4

# ============================================
# CLAUDE API
# ============================================
ANTHROPIC_API_KEY=xxx

# ============================================
# STRIPE
# ============================================
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
STRIPE_PRICE_PAY_PER_CLAIM=price_xxx
STRIPE_PRICE_UNLIMITED_MONTHLY=price_xxx
STRIPE_PRICE_UNLIMITED_ANNUAL=price_xxx

# ============================================
# UPSTASH REDIS
# ============================================
UPSTASH_REDIS_REST_URL=xxx
UPSTASH_REDIS_REST_TOKEN=xxx

# ============================================
# TRIGGER.DEV
# ============================================
TRIGGER_API_KEY=xxx
TRIGGER_API_URL=https://api.trigger.dev

# ============================================
# SECURITY
# ============================================
ENCRYPTION_KEY=xxx                    # 32-byte hex key
JWT_SECRET=xxx
MFA_ISSUER=ClaimScrub

# ============================================
# OBSERVABILITY
# ============================================
SENTRY_DSN=xxx
LOG_LEVEL=info
```

---

## Summary

| Category | Count | Key Items |
|----------|-------|-----------|
| **Packages** | 4 | shared, ui, validators, agentic-engine |
| **Agentic Components** | 12 | FlowProvider, steps, hooks |
| **API Procedures** | 6 | claims, validation, epic, chat, billing, auth |
| **Connectors** | 4 | ICD-10, CMS, NPI, PubMed |
| **Epic Services** | 7 | OAuth, patient, condition, procedure, coverage, auth |
| **Database Models** | 9 | User, Practice, Claim, ServiceLine, Validation, etc. |
| **Security Layers** | 5 | CORS, CSP, rate limit, audit, encryption |
| **XState States** | 10 | Patient, procedure, diagnosis, auth, review, etc. |

---

## Approval Checklist

- [x] Modern stack (React 19, Vite 6, Hono, tRPC)
- [x] Type-safe (TypeScript, tRPC, Prisma, Zod)
- [x] Secure (rate limiting, CSP, encryption, audit)
- [x] Scalable (Redis cache, Trigger.dev queues)
- [x] Modular (monorepo, packages)
- [x] 100% Agentic (XState state machine)
- [x] HIPAA-ready (audit logs, encryption, Vercel BAA)

---

Ready for scaffolding?
