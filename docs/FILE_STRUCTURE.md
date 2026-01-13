# ClaimScrub - Project File Structure

## Overview

Monorepo structure with separate frontend (PWA) and backend (API) packages.

```
claimscrub/
├── apps/
│   ├── web/                    # React PWA (Vite)
│   └── api/                    # Node.js + Express API
├── packages/
│   ├── shared/                 # Shared types, utils, constants
│   ├── ui/                     # Shared UI components
│   └── validators/             # Claim validation logic
├── docs/                       # Documentation
├── scripts/                    # Build/deploy scripts
└── config files
```

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
│   └── validators/
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
│       └── deploy.yml
├── .env.example
├── .gitignore
├── package.json                # Workspace root
├── pnpm-workspace.yaml
├── turbo.json                  # Turborepo config
├── tsconfig.base.json
└── README.md
```

---

## Frontend (apps/web)

```
apps/web/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── fonts/
│       ├── merriweather/
│       ├── inter/
│       └── jetbrains-mono/
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   ├── logo.svg
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.tsx        # Main layout wrapper
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNav.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── BottomNav.tsx       # Mobile
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── MFAInput.tsx
│   │   │   ├── EpicOAuthButton.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── claims/
│   │   │   ├── ClaimsList.tsx
│   │   │   ├── ClaimCard.tsx
│   │   │   ├── ClaimFilters.tsx
│   │   │   └── ClaimBulkActions.tsx
│   │   │
│   │   ├── agentic/                # Agentic flow components
│   │   │   ├── FlowContainer.tsx       # Tab+Enter orchestrator
│   │   │   ├── ProgressSteps.tsx
│   │   │   ├── KeyboardHint.tsx
│   │   │   ├── PatientContext.tsx      # Screen 08
│   │   │   ├── ProcedureSuggest.tsx    # Screen 09
│   │   │   ├── DiagnosisSuggest.tsx    # Screen 10
│   │   │   ├── AuthDetection.tsx       # Screen 11
│   │   │   ├── ReviewSubmit.tsx        # Screen 12
│   │   │   ├── SuggestionCard.tsx
│   │   │   ├── ValidationInline.tsx
│   │   │   └── ConfirmButton.tsx
│   │   │
│   │   ├── validation/
│   │   │   ├── ValidationResult.tsx
│   │   │   ├── ValidationCheck.tsx
│   │   │   ├── DenialRiskBadge.tsx
│   │   │   ├── SuggestedFix.tsx
│   │   │   └── CoveragePanel.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   ├── SuggestedQueries.tsx
│   │   │   └── ResultsTable.tsx
│   │   │
│   │   ├── billing/
│   │   │   ├── PricingCards.tsx
│   │   │   ├── PlanComparison.tsx
│   │   │   ├── UsageStats.tsx
│   │   │   ├── PaymentMethod.tsx
│   │   │   └── InvoiceHistory.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── StatCard.tsx
│   │       ├── QuickActions.tsx
│   │       ├── RecentValidations.tsx
│   │       ├── DenialRiskChart.tsx
│   │       └── SpecialtyChart.tsx
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
│   │   │   ├── steps/
│   │   │   │   ├── WelcomeStep.tsx
│   │   │   │   ├── EpicConnectStep.tsx
│   │   │   │   ├── PracticeProfileStep.tsx
│   │   │   │   ├── MFASetupStep.tsx
│   │   │   │   └── FirstClaimStep.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   │
│   │   ├── claims/
│   │   │   ├── ClaimsListPage.tsx
│   │   │   ├── NewClaimPage.tsx        # Agentic flow
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
│   │   ├── useEpic.ts              # Epic FHIR data
│   │   ├── useClaims.ts
│   │   ├── useValidation.ts
│   │   ├── useChat.ts
│   │   ├── useVoice.ts             # Web Speech API
│   │   ├── useKeyboardNav.ts       # Tab+Enter navigation
│   │   ├── useAgenticFlow.ts       # Flow orchestration
│   │   └── useToast.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts            # Zustand
│   │   ├── claimStore.ts
│   │   ├── flowStore.ts            # Agentic flow state
│   │   └── uiStore.ts
│   │
│   ├── services/
│   │   ├── api.ts                  # API client (axios)
│   │   ├── auth.ts
│   │   ├── claims.ts
│   │   ├── validation.ts
│   │   ├── chat.ts
│   │   ├── epic.ts                 # Epic FHIR client
│   │   └── stripe.ts
│   │
│   ├── lib/
│   │   ├── utils.ts                # cn(), formatters
│   │   ├── constants.ts
│   │   ├── validation-rules.ts
│   │   └── keyboard.ts             # Tab+Enter helpers
│   │
│   ├── types/
│   │   ├── claim.ts
│   │   ├── patient.ts
│   │   ├── provider.ts
│   │   ├── validation.ts
│   │   ├── epic.ts
│   │   └── api.ts
│   │
│   └── styles/
│       ├── globals.css
│       └── fonts.css
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
│   ├── index.ts                # Entry point
│   ├── app.ts                  # Express app setup
│   ├── config/
│   │   ├── index.ts
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   └── stripe.ts
│   │
│   ├── routes/
│   │   ├── index.ts            # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── claims.routes.ts
│   │   ├── validation.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── epic.routes.ts
│   │   ├── billing.routes.ts
│   │   └── webhooks.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── claims.controller.ts
│   │   ├── validation.controller.ts
│   │   ├── chat.controller.ts
│   │   ├── epic.controller.ts
│   │   └── billing.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── claims.service.ts
│   │   ├── validation.service.ts
│   │   ├── chat.service.ts
│   │   │
│   │   ├── connectors/             # Claude Health Connectors
│   │   │   ├── index.ts
│   │   │   ├── icd10.connector.ts
│   │   │   ├── cms.connector.ts
│   │   │   ├── npi.connector.ts
│   │   │   └── pubmed.connector.ts
│   │   │
│   │   ├── epic/                   # Epic FHIR
│   │   │   ├── index.ts
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
│   │   └── claude/
│   │       ├── index.ts
│   │       ├── client.ts
│   │       └── prompts.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── audit.middleware.ts     # HIPAA audit logging
│   │   └── error.middleware.ts
│   │
│   ├── models/                     # Database models
│   │   ├── index.ts
│   │   ├── user.model.ts
│   │   ├── practice.model.ts
│   │   ├── claim.model.ts
│   │   ├── validation.model.ts
│   │   ├── audit.model.ts
│   │   └── subscription.model.ts
│   │
│   ├── validators/                 # Request validation (Zod)
│   │   ├── auth.validator.ts
│   │   ├── claim.validator.ts
│   │   └── common.validator.ts
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── encryption.ts
│   │   ├── npi-luhn.ts
│   │   └── response.ts
│   │
│   └── types/
│       ├── express.d.ts
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── tsconfig.json
└── package.json
```

---

## Shared Packages

### packages/shared

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── claim.ts
│   │   ├── patient.ts
│   │   ├── provider.ts
│   │   ├── validation.ts
│   │   ├── denial-codes.ts
│   │   └── index.ts
│   │
│   ├── constants/
│   │   ├── denial-codes.ts         # CO-11, CO-15, etc.
│   │   ├── specialties.ts          # OB-GYN, Oncology, etc.
│   │   ├── modifiers.ts
│   │   ├── place-of-service.ts
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

### packages/validators

```
packages/validators/
├── src/
│   ├── index.ts
│   ├── cpt-icd-match.ts            # CPT-ICD validation rules
│   ├── modifier-rules.ts
│   ├── npi-validator.ts
│   ├── timely-filing.ts
│   ├── ncci-edits.ts               # Bundling edits
│   │
│   ├── specialty/
│   │   ├── index.ts
│   │   ├── oncology.ts
│   │   ├── mental-health.ts
│   │   ├── obgyn.ts
│   │   └── endocrinology.ts
│   │
│   └── rules/
│       ├── index.ts
│       ├── rule-engine.ts
│       └── rule-types.ts
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

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String?
  mfaSecret     String?
  mfaEnabled    Boolean  @default(false)
  role          UserRole @default(BILLING_STAFF)

  practiceId    String
  practice      Practice @relation(fields: [practiceId], references: [id])

  epicUserId    String?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  claims        Claim[]
  auditLogs     AuditLog[]
}

model Practice {
  id            String   @id @default(cuid())
  name          String
  npi           String   @unique
  specialty     Specialty

  epicOrgId     String?

  subscriptionId String?
  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  users         User[]
  claims        Claim[]
}

model Claim {
  id            String   @id @default(cuid())

  // Patient
  patientName   String
  patientDob    DateTime
  patientGender String
  insuranceId   String
  payerName     String

  // Provider
  providerNpi   String
  providerName  String

  // Service
  dateOfService DateTime
  placeOfService String

  // Validation
  status        ClaimStatus @default(PENDING)
  score         Int?

  practiceId    String
  practice      Practice @relation(fields: [practiceId], references: [id])

  createdById   String
  createdBy     User     @relation(fields: [createdById], references: [id])

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  serviceLines  ServiceLine[]
  validations   Validation[]
}

model ServiceLine {
  id            String   @id @default(cuid())

  claimId       String
  claim         Claim    @relation(fields: [claimId], references: [id])

  cptCode       String
  modifiers     String[]
  icdCodes      String[]
  drugCode      String?
  units         Int      @default(1)
  charge        Decimal

  createdAt     DateTime @default(now())
}

model Validation {
  id            String   @id @default(cuid())

  claimId       String
  claim         Claim    @relation(fields: [claimId], references: [id])

  checkType     String   // CPT_ICD_MATCH, NPI_VERIFY, etc.
  status        ValidationStatus
  denialCode    String?  // CO-11, CO-15, etc.
  message       String
  suggestion    String?

  createdAt     DateTime @default(now())
}

model Subscription {
  id            String   @id @default(cuid())
  stripeSubId   String   @unique
  plan          PlanType
  status        SubStatus

  currentPeriodStart DateTime
  currentPeriodEnd   DateTime

  practices     Practice[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model AuditLog {
  id            String   @id @default(cuid())

  userId        String
  user          User     @relation(fields: [userId], references: [id])

  action        String   // VIEW_CLAIM, EDIT_CLAIM, etc.
  resource      String   // claim, patient, etc.
  resourceId    String
  metadata      Json?
  ipAddress     String

  createdAt     DateTime @default(now())
}

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
  PENDING
  VALIDATED
  SUBMITTED
  PAID
  DENIED
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
  ACTIVE
  PAST_DUE
  CANCELED
}
```

---

## Environment Variables

```bash
# .env.example

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database (Supabase)
DATABASE_URL=postgresql://...

# Supabase Auth
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# Epic FHIR
EPIC_CLIENT_ID=xxx
EPIC_CLIENT_SECRET=xxx
EPIC_REDIRECT_URI=http://localhost:5173/auth/epic/callback
EPIC_SANDBOX_URL=https://fhir.epic.com/interconnect-fhir-oauth

# Claude API
ANTHROPIC_API_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
STRIPE_PRICE_PAY_PER_CLAIM=price_xxx
STRIPE_PRICE_UNLIMITED_MONTHLY=price_xxx
STRIPE_PRICE_UNLIMITED_ANNUAL=price_xxx

# Encryption
ENCRYPTION_KEY=xxx

# MFA
MFA_ISSUER=ClaimScrub
```

---

## Key Files Summary

| Category | Count | Purpose |
|----------|-------|---------|
| **Agentic Components** | 10 | Tab+Enter guided flow |
| **Connectors** | 4 | ICD-10, CMS, NPI, PubMed |
| **Epic Services** | 6 | OAuth, Patient, Coverage, etc. |
| **Validation Rules** | 8 | CPT-ICD, modifiers, NCCI, specialty |
| **Database Models** | 7 | User, Practice, Claim, etc. |

---

## Next Steps

1. Review and approve file structure
2. Initialize project with scaffolding
3. Set up Turborepo + pnpm workspaces
4. Configure Tailwind with design system
5. Build core UI components

Approve to proceed with scaffolding?
