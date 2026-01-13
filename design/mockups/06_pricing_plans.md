# Screen 06: Pricing & Plans

## Overview

**Purpose:** Display pricing tiers and enable subscription management
**URL:** `/pricing` (public) and `/settings/billing` (authenticated)

---

## Wireframe - Public Pricing Page

```
+-----------------------------------------------------------------------------------+
| [Logo] ClaimScrub                              [Login]  [Start Free Trial]        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                                                                   |
|                          Simple, Transparent Pricing                              |
|                                                                                   |
|                 Reduce denials. Recover revenue. No surprises.                    |
|                                                                                   |
|                                                                                   |
|  +---------------------------+  +---------------------------+  +----------------+ |
|  |                           |  |                           |  |                | |
|  |  Free Trial               |  |  Pay Per Claim            |  |  Unlimited     | |
|  |                           |  |                           |  |                | |
|  |  $0                       |  |  $10                      |  |  $100          | |
|  |  for 7 days               |  |  per claim                |  |  per month     | |
|  |                           |  |                           |  |                | |
|  |  -----------------------  |  |  -----------------------  |  |  ------------- | |
|  |                           |  |                           |  |                | |
|  |  - 1 claim per day        |  |  - Unlimited claims       |  |  - Unlimited   | |
|  |  - Up to 10 MB each       |  |  - Up to 10 MB each       |  |    claims      | |
|  |  - All 4 specialties      |  |  - All 4 specialties      |  |  - All sizes   | |
|  |  - Basic validation       |  |  - Full validation        |  |  - Priority    | |
|  |  - Email support          |  |  - Email support          |  |    support     | |
|  |                           |  |  - Chat assistant         |  |  - Chat        | |
|  |                           |  |                           |  |    assistant   | |
|  |                           |  |                           |  |  - API access  | |
|  |                           |  |                           |  |  - Analytics   | |
|  |                           |  |                           |  |                | |
|  |  [Start Free Trial]       |  |  [Get Started]            |  |  [Subscribe]   | |
|  |                           |  |                           |  |                | |
|  +---------------------------+  +---------------------------+  +----------------+ |
|                                                                                   |
|                                                                                   |
|  +-----------------------------------------------------------------------------+ |
|  |                                                                             | |
|  |                        Save 30% with Annual Billing                         | |
|  |                                                                             | |
|  |     Unlimited Plan: $70/month when paid annually ($840/year)                | |
|  |                                                                             | |
|  |                         [Switch to Annual]                                  | |
|  |                                                                             | |
|  +-----------------------------------------------------------------------------+ |
|                                                                                   |
|                                                                                   |
|  +-----------------------------------------------------------------------------+ |
|  |                                                                             | |
|  |  Coming Soon: Success-Based Pricing                                         | |
|  |                                                                             | |
|  |  For denial appeals (Phase 3), pay only when we help you recover revenue.   | |
|  |  5% of recovered amount, capped at industry-low rates.                      | |
|  |                                                                             | |
|  |  [Join Waitlist]                                                            | |
|  |                                                                             | |
|  +-----------------------------------------------------------------------------+ |
|                                                                                   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  Trusted by 500+ healthcare practices                                             |
|                                                                                   |
|  [Memorial Health Logo]  [City Medical Logo]  [Bay Area Logo]  [Central Logo]    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## Wireframe - Feature Comparison Table

```
+-----------------------------------------------------------------------------+
|                                                                             |
|  Compare Plans                                                              |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  |                    | Free Trial | Pay Per Claim | Unlimited           |  |
|  +-----------------------------------------------------------------------+  |
|  | Claims per day     | 1          | Unlimited     | Unlimited           |  |
|  +-----------------------------------------------------------------------+  |
|  | File size limit    | 10 MB      | 10 MB         | Unlimited           |  |
|  +-----------------------------------------------------------------------+  |
|  | CPT-ICD validation | [v]        | [v]           | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | NPI verification   | [v]        | [v]           | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | CMS coverage check | [v]        | [v]           | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | Prior auth alerts  | [v]        | [v]           | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | Chat assistant     | --         | [v]           | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | Voice input        | --         | [v]           | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | 837 file upload    | --         | [v]           | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | CSV batch upload   | --         | [v]           | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | API access         | --         | --            | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | Analytics dashboard| --         | --            | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | Priority support   | --         | --            | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|  | Epic EHR launch    | --         | --            | [v]                 |  |
|  +-----------------------------------------------------------------------+  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Wireframe - Billing Settings (Authenticated)

```
+-----------------------------------------------------------------------------------+
| [Logo] ClaimScrub                    [Search claims...]        [?] [Bell] [Avatar]|
+-----------------------------------------------------------------------------------+
|        |                                                                          |
|   [=]  |  Settings > Billing                                                      |
|        |  -----------------------------------------------------------------------  |
| -------|                                                                          |
|        |  +----------------------------------------------------------------------+ |
|  Dash  |  |                                                                      | |
|        |  |  Current Plan                                                        | |
|  Claims|  |                                                                      | |
|        |  |  +---------------------------+  +---------------------------+        | |
|  Chat  |  |  |                           |  |                           |        | |
|        |  |  |  Unlimited Monthly        |  |  Next Invoice             |        | |
|  Report|  |  |  $100/month               |  |                           |        | |
|        |  |  |                           |  |  Feb 12, 2026             |        | |
|  ------+  |  |  [Active]                 |  |  $100.00                  |        | |
|        |  |  |                           |  |                           |        | |
|  Settin*|  |  |  [Change Plan]           |  |  [View Invoice History]   |        | |
|        |  |  |                           |  |                           |        | |
|        |  |  +---------------------------+  +---------------------------+        | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|        |  |  Usage This Period                                                   | |
|        |  |                                                                      | |
|        |  |  Claims Validated        347                                         | |
|        |  |  ================================================                   | |
|        |  |                                                                      | |
|        |  |  Data Processed          2.4 GB                                      | |
|        |  |  ================================                                    | |
|        |  |                                                                      | |
|        |  |  API Calls               1,247                                       | |
|        |  |  ========================                                           | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|        |  |  Payment Method                                                      | |
|        |  |                                                                      | |
|        |  |  +----------------------------------------------------------+        | |
|        |  |  |  [Visa Icon]  Visa ending in 4242         Expires 12/27 |        | |
|        |  |  |                                            [Edit]        |        | |
|        |  |  +----------------------------------------------------------+        | |
|        |  |                                                                      | |
|        |  |  [+ Add Payment Method]                                              | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|        |  |  Invoice History                                                     | |
|        |  |                                                                      | |
|        |  |  +--------------------------------------------------------------+    | |
|        |  |  | Date       | Amount  | Status | Invoice                      |    | |
|        |  |  +--------------------------------------------------------------+    | |
|        |  |  | Jan 12     | $100.00 | Paid   | [Download]                   |    | |
|        |  |  | Dec 12     | $100.00 | Paid   | [Download]                   |    | |
|        |  |  | Nov 12     | $100.00 | Paid   | [Download]                   |    | |
|        |  |  +--------------------------------------------------------------+    | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
+-----------------------------------------------------------------------------------+
```

---

## Specifications

### Pricing Cards

| Element | Spec |
|---------|------|
| Width | 320px each, responsive |
| Padding | 32px |
| Border | Slate-200, 12px radius |
| Featured (Unlimited) | Amber-100 border, "Most Popular" badge |

### Price Display

| Element | Spec |
|---------|------|
| Amount | 48px, Merriweather, Slate-900 |
| Period | 16px, Inter, Slate-500 |
| Savings Badge | Sage-100 bg, Sage-700 text |

### Feature List

| Element | Spec |
|---------|------|
| Checkmark | 16px, Sage-600 |
| Dash (not included) | 16px, Slate-300 |
| Text | 14px, Inter, Slate-700 |

### CTA Buttons

| Plan | Style |
|------|-------|
| Free Trial | Secondary (outlined) |
| Pay Per Claim | Secondary |
| Unlimited | Primary (Amber-600) |

---

## Interactions

| Action | Result |
|--------|--------|
| Click "Start Free Trial" | Redirect to registration |
| Click "Get Started" | Redirect to registration with plan preselected |
| Click "Subscribe" | Open Stripe Checkout |
| Click "Switch to Annual" | Update pricing display, show savings |
| Click "Change Plan" | Open plan selection modal |
| Click "Download" invoice | Download PDF invoice |

---

## Plan Change Modal

```
+--------------------------------------------------+
|                                                  |
|  Change Your Plan                            [x] |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  Current: Unlimited Monthly ($100/month)         |
|                                                  |
|  Select new plan:                                |
|                                                  |
|  ( ) Pay Per Claim - $10/claim                   |
|  ( ) Unlimited Monthly - $100/month              |
|  (o) Unlimited Annual - $70/month ($840/year)    |
|      Save $360 per year                          |
|                                                  |
|  +----------------------------------------------+|
|  | Your new plan will take effect immediately.  ||
|  | You'll be charged a prorated amount.         ||
|  +----------------------------------------------+|
|                                                  |
|  [Cancel]                    [Confirm Change]    |
|                                                  |
+--------------------------------------------------+
```

---

## Success Fee Section (Phase 3 Preview)

```
+-----------------------------------------------------------------------------+
|                                                                             |
|  Denial Appeals - Success-Based Pricing                                     |
|                                                                             |
|  Pay only when we help you recover denied claims.                           |
|                                                                             |
|  +---------------------------------------+                                  |
|  |                                       |                                  |
|  |  5%                                   |                                  |
|  |  of recovered amount                  |                                  |
|  |                                       |                                  |
|  |  Industry Average: 15-25%             |                                  |
|  |  Your Savings: Up to 80%              |                                  |
|  |                                       |                                  |
|  +---------------------------------------+                                  |
|                                                                             |
|  How it works:                                                              |
|                                                                             |
|  1. Upload your denied claim (835 EOB)                                      |
|  2. We generate an appeal with clinical evidence                            |
|  3. Submit appeal to payer                                                  |
|  4. When payment is received, we charge 5%                                  |
|                                                                             |
|  Example:                                                                   |
|  Denied claim: $5,000                                                       |
|  Appeal successful: $4,500 recovered                                        |
|  Our fee: $225 (5%)                                                         |
|  Your net recovery: $4,275                                                  |
|                                                                             |
|  [Coming Q2 2026 - Join Waitlist]                                           |
|                                                                             |
+-----------------------------------------------------------------------------+
```
