/**
 * Knowledge Base Builder for AskDenali (Nico)
 *
 * Comprehensive knowledge base covering ALL app features:
 * - Dashboard and analytics
 * - Claims management (create, list, view, filter)
 * - Validation rules and results
 * - Settings (profile, billing, integrations, security)
 * - Onboarding flow
 * - Step-by-step how-to guides
 * - Pricing and plans
 * - Specialties and payers
 */

import { SPECIALTIES, DENIAL_CODES, PAYERS } from '@claimscrub/shared/constants'

// ============================================================================
// VALIDATION RULES
// ============================================================================

const VALIDATION_RULES = {
  CPT_ICD_MATCH: {
    name: 'CPT-ICD Match',
    description: 'Validates that diagnosis codes support the procedures billed',
    denialPrevention: 'Prevents CO-11 (Diagnosis inconsistent with procedure) denials',
    howItWorks: 'Checks that each CPT code has a medically necessary ICD-10 diagnosis code supporting it',
  },
  NPI_VERIFY: {
    name: 'NPI Validator',
    description: 'Validates provider NPI using the Luhn algorithm checksum and NPPES registry',
    denialPrevention: 'Prevents CO-16 (Missing/invalid information) denials',
    howItWorks: 'Verifies the NPI format and checks against the national provider registry',
  },
  MODIFIER_CHECK: {
    name: 'Modifier Rules',
    description: 'Validates correct modifier usage and checks for conflicts',
    denialPrevention: 'Prevents CO-4 (Modifier inconsistent) denials',
    howItWorks: 'Ensures modifiers like 25, 59, 76 are used correctly and not conflicting',
  },
  PRIOR_AUTH: {
    name: 'Prior Authorization',
    description: 'Checks if procedures require prior authorization based on CPT codes and payer rules',
    denialPrevention: 'Prevents CO-15 (Authorization required) denials',
    howItWorks: 'Cross-references CPT codes against payer-specific prior auth requirements',
  },
  DATA_COMPLETENESS: {
    name: 'Data Completeness',
    description: 'Ensures all required claim fields are populated (patient, provider, service)',
    denialPrevention: 'Prevents CO-16 (Missing information) denials',
    howItWorks: 'Checks for required fields: patient demographics, provider info, service dates, charges',
  },
  TIMELY_FILING: {
    name: 'Timely Filing',
    description: 'Validates claim is within payer-specific filing deadline',
    denialPrevention: 'Prevents CO-29 (Filing limit expired) denials',
    howItWorks: 'Compares service date against payer filing limits (e.g., Medicare 365 days, most commercial 90-180 days)',
  },
  NCCI_EDITS: {
    name: 'NCCI Edits',
    description: 'Checks for bundled procedures and NCCI edit violations',
    denialPrevention: 'Prevents CO-97 (Bundled procedure) denials',
    howItWorks: 'Identifies procedure pairs that cannot be billed together per CMS NCCI guidelines',
  },
}

// ============================================================================
// PRICING PLANS
// ============================================================================

const PRICING = {
  FREE_TRIAL: {
    name: 'Free Trial',
    price: '$0 for 3 days',
    monthlyPrice: null,
    annualPrice: null,
    limits: '1 claim per day',
    features: ['All 4 specialties', 'All 7 validation rules', 'Email support'],
    bestFor: 'Testing the platform before committing',
  },
  PAY_PER_CLAIM: {
    name: 'Pay Per Claim',
    price: '$10 per claim',
    monthlyPrice: null,
    annualPrice: null,
    limits: 'Unlimited claims, pay as you go',
    features: ['All 4 specialties', 'All 7 validation rules', 'Email support'],
    bestFor: 'Low-volume practices or occasional use',
  },
  UNLIMITED: {
    name: 'Unlimited',
    price: '$100/month or $70/month with annual billing',
    monthlyPrice: '$100/month',
    annualPrice: '$840/year ($70/month)',
    limits: 'Unlimited claims',
    features: [
      'All 4 specialties',
      'All 7 validation rules',
      'Priority support',
      'Epic EHR integration',
      'Analytics dashboard',
      'Batch CSV upload',
      '837 file upload',
    ],
    bestFor: 'High-volume practices needing unlimited validation',
  },
}

// ============================================================================
// BUILD KNOWLEDGE BASE
// ============================================================================

export function buildKnowledgeBase(): string {
  const sections = [
    buildAboutSection(),
    buildDashboardGuide(),
    buildClaimsGuide(),
    buildNewClaimGuide(),
    buildValidationResultsGuide(),
    buildValidationRulesSection(),
    buildSettingsGuide(),
    buildBillingGuide(),
    buildOnboardingGuide(),
    buildPricingSection(),
    buildSpecialtiesSection(),
    buildDenialCodesSection(),
    buildPayersSection(),
    buildTroubleshootingGuide(),
    buildKeyboardShortcuts(),
  ]

  return sections.join('\n\n')
}

// ============================================================================
// ABOUT SECTION
// ============================================================================

function buildAboutSection(): string {
  return `## About Denali Health

Denali Health is a healthcare claims scrubbing application that helps medical practices prevent claim denials BEFORE submission.

### Key Benefits
- Catches billing errors before you submit claims
- Reduces denial rates by validating against 7 rules
- Saves time on manual claim reviews
- Supports 4 medical specialties
- Integrates with Epic EHR (Unlimited plan)
- AI-powered suggestions to fix issues

### Our Philosophy
Denials PREVENTION, not Denials Management. We help you submit clean claims the first time, saving time and maximizing revenue.`
}

// ============================================================================
// DASHBOARD GUIDE
// ============================================================================

function buildDashboardGuide(): string {
  return `## Dashboard

The Dashboard is your home screen after logging in. It shows key metrics and quick actions.

### Dashboard Statistics
The top of the dashboard shows 4 key metrics:
- **Claims This Month**: Total claims validated this billing period
- **Avg Validation Score**: Your average score across all claims (aim for 95%+)
- **Denials Prevented**: Estimated denials caught before submission
- **Est. Revenue Protected**: Dollar value of claims saved from denial

### Quick Actions
Three shortcut buttons for common tasks:
- **New Claim**: Start creating a new claim
- **View Claims**: Go to the full claims list
- **Settings**: Access your account settings

### Recent Claims
Shows your last 3 claims with:
- Claim ID
- Patient name
- Validation score
- Status (Validated, Warning, Submitted, Paid)

### How to Use the Dashboard
1. Check your statistics daily to monitor claim health
2. Use Quick Actions to jump to common tasks
3. Review Recent Claims for any warnings that need attention
4. Click on any claim to see full validation details`
}

// ============================================================================
// CLAIMS LIST GUIDE
// ============================================================================

function buildClaimsGuide(): string {
  return `## Claims List

The Claims page shows all your claims with powerful search and filter options.

### Viewing Claims
Navigate to Claims from the sidebar to see all your claims in a table format.

### Table Columns
- **Claim ID**: Unique identifier (e.g., CLM-2026-0112)
- **Patient**: Patient name
- **DOS**: Date of Service
- **CPT Code**: Primary procedure code
- **Charge Amount**: Total charge in dollars
- **Validation Score**: Percentage score (0-100%)
- **Status**: Current claim status

### Searching Claims
Use the search bar to find claims by:
- Patient name
- Claim ID
- CPT code

### Filtering Claims
**Quick Filters (Status Tabs)**:
- All: Show all claims
- Pass: Claims with 95%+ score
- Warning: Claims with 70-94% score
- Failed: Claims below 70%
- Pending: Claims not yet validated

**Advanced Filters** (click Filter button):
- Date range (from/to)
- Payer (Medicare, Aetna, BCBS, etc.)
- Specialty (Oncology, Mental Health, OB/GYN, Endocrinology)
- Provider name
- Denial risk codes (CO-11, CO-15, CO-16, CO-4, CO-29, CO-50)
- Charge amount range
- Sort order (Newest, Oldest, Patient A-Z, Highest charge, etc.)

### Bulk Actions
Select multiple claims using checkboxes, then:
- **Export Selected**: Download claims as PDF or CSV
- **Revalidate**: Re-run validation on selected claims
- **Delete**: Remove selected claims (cannot be undone)

### How to Filter Claims
1. Click the "Filter" button in the toolbar
2. Select your filter criteria (date, payer, status, etc.)
3. Click "Apply Filters"
4. Use "Clear Filters" to reset`
}

// ============================================================================
// NEW CLAIM GUIDE
// ============================================================================

function buildNewClaimGuide(): string {
  return `## Creating a New Claim

Denali Health uses an intelligent guided flow to help you create claims quickly and accurately.

### Starting a New Claim
1. Click "New Claim" from the Dashboard or Claims page
2. The agentic flow will guide you through each step

### Step 1: Patient Context
If connected to Epic EHR:
- Patient information is loaded automatically
- Review: Name, DOB, MRN, Gender
- Review: Insurance (Payer, Member ID)
- Review: Active Diagnoses (ICD-10 codes)
- Click "Confirm Patient" to proceed

If not connected to Epic:
- Enter patient information manually
- Add insurance details
- Add relevant diagnosis codes

### Step 2: Procedure Selection
- View suggested CPT codes based on patient context
- Each suggestion shows:
  - CPT code number
  - Procedure description
  - "Suggested" badge for AI recommendations
- Click on procedures to select them
- You can select multiple procedures
- Click "Continue" when done

### Step 3: Validation
- Denali Health automatically validates your claim
- See real-time results for all 7 validation rules
- Fix any issues before submission

### Keyboard Navigation
- Use **Tab** to move between fields
- Use **Enter** to confirm and proceed
- Keyboard hints appear at the bottom of the screen

### Tips for Creating Claims
- Let Epic auto-populate when possible to reduce errors
- Review all diagnosis codes before confirming
- Select all applicable procedures in one session
- Address any warnings before submitting`
}

// ============================================================================
// VALIDATION RESULTS GUIDE
// ============================================================================

function buildValidationResultsGuide(): string {
  return `## Understanding Validation Results

After creating or validating a claim, you'll see detailed results showing what passed and what needs attention.

### Validation Scores
- **95-100% (Excellent)**: Claim is ready to submit
- **80-94% (Good)**: Minor issues, review recommended
- **60-79% (Warning)**: Issues found, should fix before submitting
- **Below 60% (Critical)**: Major issues, must fix before submitting

### Status Header
At the top of the claim detail page:
- Large status icon (green checkmark, yellow warning, red X)
- Score badge (PASS, WARNING, FAIL)
- Validation score (e.g., 98/100)
- Claim details (Patient, Claim ID, Timestamp, Est. Reimbursement)

### Validation Tabs

**Validation Tab**:
Shows each of the 7 validation checks:
- Status icon (pass/warning/fail)
- Check name (e.g., "CPT-ICD Match")
- Status message
- Click to expand for details:
  - Full explanation
  - Denial risk code (if failing)
  - Recommendation to fix
  - Suggested codes with "Apply" button

**Coverage Tab**:
- CPT code coverage information
- ICD code support details
- Payer-specific coverage rules

**Documentation Tab**:
- Required supporting documents for the claim
- Example: For chemotherapy (96413):
  - Pathology report
  - Treatment plan
  - Drug administration record
  - Prior authorization

**History Tab**:
- Timeline of claim events
- Shows when claim was created, validated, edited, submitted

### Action Buttons
Depending on claim status:
- **PASS**: "Submit to Clearinghouse" button
- **WARNING**: "Fix Issues" and "Submit Anyway" buttons
- **FAIL**: "Fix Issues" button (must fix before submitting)
- **Export PDF**: Download claim as PDF
- **Edit Claim**: Modify claim details

### How to Fix Validation Issues
1. Review each failing check by clicking to expand
2. Read the recommendation
3. If a suggested code is shown, click "Apply" to use it
4. Re-validate the claim to confirm fixes
5. Once all checks pass, submit the claim`
}

// ============================================================================
// VALIDATION RULES SECTION
// ============================================================================

function buildValidationRulesSection(): string {
  const rules = Object.values(VALIDATION_RULES)
    .map(
      (r) => `### ${r.name}
- **What it checks**: ${r.description}
- **How it works**: ${r.howItWorks}
- **Denials prevented**: ${r.denialPrevention}`
    )
    .join('\n\n')

  return `## The 7 Validation Rules

Denali Health validates every claim against 7 comprehensive rules:

${rules}

### Validation Order
Rules are checked in order of importance:
1. Data Completeness (can't validate incomplete data)
2. NPI Verification (provider must be valid)
3. CPT-ICD Match (medical necessity)
4. Modifier Check (correct modifier usage)
5. Prior Authorization (auth requirements)
6. Timely Filing (within deadline)
7. NCCI Edits (bundling rules)`
}

// ============================================================================
// SETTINGS GUIDE
// ============================================================================

function buildSettingsGuide(): string {
  return `## Settings

Access Settings from the sidebar to manage your account, practice, and integrations.

### Settings Sections
- **Profile**: Personal and practice information
- **Billing**: Subscription and payment management
- **Integrations**: EHR connections
- **Security**: Password and MFA settings

### Profile Settings
**Personal Information**:
- Email (contact support to change)
- Full Name
- Job Title

**Practice Information**:
- Practice Name
- NPI (10-digit National Provider Identifier)
- Tax ID (XX-XXXXXXX format)

### How to Update Your Profile
1. Navigate to Settings > Profile
2. Edit the fields you want to change
3. Click "Save Changes"
4. Changes take effect immediately

### Integrations
**Epic EHR Integration** (Unlimited plan):
- Connect your Epic instance
- Pull patient data automatically
- Launch Denali Health from within Epic

**Coming Soon**:
- Cerner
- athenahealth
- eClinicalWorks

### Security Settings
- Change password
- Manage MFA (two-factor authentication)
- View login history
- HIPAA compliance requires MFA to be enabled`
}

// ============================================================================
// BILLING GUIDE
// ============================================================================

function buildBillingGuide(): string {
  return `## Billing & Subscription

Manage your subscription, payment methods, and view invoices.

### Current Plan
Shows your active subscription:
- Plan name (Free Trial, Pay Per Claim, Unlimited)
- Price
- Status (Active, Trialing, Past Due, Canceled)
- Next invoice date and amount

### Usage Statistics
Track your usage for the billing period:
- Claims Validated (with progress bar)
- Data Processed
- API Calls

### Payment Methods
Manage your saved cards:
- View all saved payment methods
- Set a default payment method
- Add new card
- Edit existing card
- Remove card

### Invoice History
View and download past invoices:
- Invoice date
- Amount
- Status (Paid, Failed, Pending)
- Download PDF button

### Changing Your Plan
1. Go to Settings > Billing
2. Click "Change Plan"
3. Select your new plan
4. Confirm the change
5. New plan takes effect immediately (prorated)

### Annual vs Monthly Billing
- Monthly: $100/month for Unlimited
- Annual: $70/month ($840/year) - Save 30%
- Switch anytime in Billing settings`
}

// ============================================================================
// ONBOARDING GUIDE
// ============================================================================

function buildOnboardingGuide(): string {
  return `## Getting Started (Onboarding)

When you first sign up, you'll go through a guided onboarding process.

### Onboarding Steps

**Step 1: Welcome**
- Overview of the 4-step process
- Click "Get Started" to begin

**Step 2: Epic EHR Connection (Optional)**
- Connect your Epic instance for automatic patient data
- Click "Connect Epic" to start OAuth flow
- Or click "Skip for Now" to connect later
- Other EHRs coming soon

**Step 3: Practice Profile (Required)**
- Enter your Practice Name
- Select Primary Specialty:
  - Oncology
  - Mental Health
  - OB/GYN
  - Endocrinology
- Enter Practice NPI (10-digit)
  - System validates using Luhn algorithm
  - Looks up practice in NPPES registry
  - Shows practice details for confirmation
- Select Your Role:
  - Provider/Physician
  - Billing Staff
  - Practice Administrator

**Step 4: MFA Setup (Required for HIPAA)**
- Download an authenticator app:
  - Google Authenticator
  - Authy
  - 1Password
- Scan the QR code with your app
- Or manually enter the secret code
- Enter the 6-digit verification code
- Codes auto-advance as you type

**Step 5: Completion**
Choose your next action:
- Create a claim
- Upload 837 file
- Take a tour
- Go to dashboard

### Tips for Onboarding
- Have your NPI number ready
- Have your authenticator app installed
- Epic connection can be done later if needed
- MFA is required for HIPAA compliance`
}

// ============================================================================
// PRICING SECTION
// ============================================================================

function buildPricingSection(): string {
  const plans = Object.values(PRICING)
    .map((p) => {
      const features = p.features.map((f) => `  - ${f}`).join('\n')
      return `### ${p.name}
- **Price**: ${p.price}
- **Limits**: ${p.limits}
- **Best for**: ${p.bestFor}
- **Features**:
${features}`
    })
    .join('\n\n')

  return `## Pricing Plans

${plans}

### Choosing the Right Plan
- **Just testing?** Start with the Free Trial
- **Low volume (< 10 claims/month)?** Pay Per Claim is most economical
- **High volume?** Unlimited saves money at 11+ claims/month

### Annual Billing Savings
Annual billing on Unlimited saves 30%:
- Monthly: $100/month = $1,200/year
- Annual: $70/month = $840/year
- You save: $360/year

### No Credit Card for Trial
Start your 3-day free trial without entering payment information.`
}

// ============================================================================
// SPECIALTIES SECTION
// ============================================================================

function buildSpecialtiesSection(): string {
  const specs = Object.values(SPECIALTIES)
    .map((s) => {
      const codes = s.commonCptCodes.slice(0, 5).join(', ')
      return `### ${s.displayName}
- **Common CPT codes**: ${codes}
- **Key validations**: Specialty-specific CPT-ICD mappings, modifier requirements, prior auth rules`
    })
    .join('\n\n')

  return `## Supported Specialties

We support 4 medical specialties with specialty-specific validation rules:

${specs}

### Why Specialty-Specific Rules?
Each specialty has unique:
- CPT-ICD code combinations
- Modifier requirements
- Prior authorization rules
- Documentation requirements
- Payer-specific policies

Our rules are tailored to catch specialty-specific errors that generic validators miss.`
}

// ============================================================================
// DENIAL CODES SECTION
// ============================================================================

function buildDenialCodesSection(): string {
  const codes = Object.values(DENIAL_CODES)
    .map((d) => {
      const tips = d.preventionTips.slice(0, 2).map((t) => `  - ${t}`).join('\n')
      return `### ${d.code}: ${d.name}
- **Description**: ${d.description}
- **Prevention tips**:
${tips}`
    })
    .join('\n\n')

  return `## Common Denial Codes We Prevent

${codes}

### Understanding Denial Codes
- **CO** = Contractual Obligation (payer's rules)
- **PR** = Patient Responsibility
- **OA** = Other Adjustment

Our validation rules specifically target the most common CO denial codes that cost practices the most time and money.`
}

// ============================================================================
// PAYERS SECTION
// ============================================================================

function buildPayersSection(): string {
  const medicare = Object.values(PAYERS)
    .filter((p) => p.type === 'MEDICARE')
    .map((p) => `- ${p.name}: ${p.timelyFilingDays}-day filing limit`)
    .join('\n')

  const commercial = Object.values(PAYERS)
    .filter((p) => p.type === 'COMMERCIAL')
    .map((p) => `- ${p.name}: ${p.timelyFilingDays}-day filing limit`)
    .join('\n')

  return `## Supported Payers

### Medicare
${medicare}

### Commercial
${commercial}

### Timely Filing
Each payer has different filing deadlines:
- Medicare: Usually 365 days from date of service
- Most commercial: 90-180 days
- Some payers: As short as 60 days

Our Timely Filing validation automatically uses the correct deadline for each payer to prevent CO-29 denials.`
}

// ============================================================================
// TROUBLESHOOTING GUIDE
// ============================================================================

function buildTroubleshootingGuide(): string {
  return `## Troubleshooting

### Common Issues and Solutions

**"Validation failed" error**
- Check that all required fields are filled
- Verify NPI is valid (10 digits, correct checksum)
- Ensure date of service is not in the future

**Low validation score**
- Review each failing check in the Validation tab
- Apply suggested fixes using the "Apply" button
- Re-validate after making changes

**Can't connect to Epic**
- Ensure you're on the Unlimited plan
- Check with your Epic administrator for permissions
- Try disconnecting and reconnecting

**Payment failed**
- Verify card details are correct
- Check card hasn't expired
- Ensure sufficient funds/credit limit
- Try a different payment method

**MFA code not working**
- Ensure your device time is synced correctly
- Wait for a new code (codes refresh every 30 seconds)
- Try the manual code entry option

**Claim not submitting**
- Address all FAIL status validation checks
- Warnings can be submitted but review recommended
- Check your internet connection

### Getting Help
- Email: support@denalihealth.com
- Priority support for Unlimited plan subscribers
- Use this chat (Nico) for instant answers`
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

function buildKeyboardShortcuts(): string {
  return `## Keyboard Shortcuts

### Navigation
- **Tab**: Move to next field
- **Shift + Tab**: Move to previous field
- **Enter**: Confirm/Submit current step

### Claims
- **Ctrl/Cmd + N**: New claim
- **Ctrl/Cmd + S**: Save current claim
- **Escape**: Cancel/Close modal

### Chat (Nico)
- **Enter**: Send message
- Click microphone icon for voice input

### Tips
- Keyboard hints appear at the bottom of the screen during claim creation
- Most actions can be completed without using a mouse`
}
