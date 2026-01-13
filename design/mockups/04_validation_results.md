# Screen 04: Validation Results

## Overview

**Purpose:** Display comprehensive validation results with actionable recommendations
**URL:** `/claims/:id/validation`

---

## Wireframe - Pass Result

```
+-----------------------------------------------------------------------------------+
| [Logo] ClaimScrub                    [Search claims...]        [?] [Bell] [Avatar]|
+-----------------------------------------------------------------------------------+
|        |                                                                          |
|   [=]  |  Validation Results                                                      |
|        |  -----------------------------------------------------------------------  |
| -------|                                                                          |
|        |  +----------------------------------------------------------------------+ |
|  Dash  |  |                                                                      | |
|        |  |  +------------------------+                                          | |
|  Claims|  |  |                        |    Maria Santos                          | |
|        |  |  |     [Checkmark]        |    Claim ID: CLM-2026-0112-4521          | |
|  Chat  |  |  |       PASS             |    Validated: Jan 12, 2026 at 2:34 PM    | |
|        |  |  |                        |                                          | |
|  Report|  |  |    Score: 98/100       |    Estimated Reimbursement: $9,450.00    | |
|        |  |  |                        |                                          | |
|  ------+  |  +------------------------+                                          | |
|        |  |                                                                      | |
|  Settin|  |  [Submit to Clearinghouse]  [Export PDF]  [Edit Claim]               | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|        |  |  [Validation]  [Coverage]  [Documentation]  [History]                | |
|        |  |  ================================================================    | |
|        |  |                                                                      | |
|        |  |  Validation Checks                                                   | |
|        |  |                                                                      | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | [v] CPT-ICD Match                                    PASS     |  | |
|        |  |  |     C50.911 (Breast cancer) supports CPT 96413 (Chemo IV)     |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | [v] Provider Verification                            PASS     |  | |
|        |  |  |     NPI 1234567893 is active. Specialty: Oncology             |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | [v] Modifier Validation                              PASS     |  | |
|        |  |  |     JW modifier correctly applied for drug wastage            |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | [v] Prior Authorization                              PASS     |  | |
|        |  |  |     Auth AUTH-2026-0112-4521 verified and active              |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | [v] Data Completeness                                PASS     |  | |
|        |  |  |     All required fields present                               |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | [v] Timely Filing                                    PASS     |  | |
|        |  |  |     DOS 01/12/2026 - 89 days remaining                        |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
+-----------------------------------------------------------------------------------+
```

---

## Wireframe - Warning Result

```
+----------------------------------------------------------------------+
|                                                                      |
|  +------------------------+                                          |
|  |                        |    James Wilson                          |
|  |   [Warning Triangle]   |    Claim ID: CLM-2026-0112-4522          |
|  |      WARNING           |    Validated: Jan 12, 2026 at 2:41 PM    |
|  |                        |                                          |
|  |    Score: 72/100       |    Risk: CO-15 (Missing Authorization)   |
|  |                        |                                          |
|  +------------------------+                                          |
|                                                                      |
|  [Fix Issues]  [Submit Anyway]  [Export PDF]  [Edit Claim]           |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  [Validation]  [Coverage]  [Documentation]  [History]                |
|  ================================================================    |
|                                                                      |
|  Validation Checks                                                   |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  | [v] CPT-ICD Match                                    PASS      |  |
|  |     F33.1 (MDD, recurrent) supports CPT 90837 (Psychotherapy)  |  |
|  +----------------------------------------------------------------+  |
|  | [!] Prior Authorization                              WARNING   |  |
|  |                                                                |  |
|  |     CPT 90837 (60-min psychotherapy) may require prior         |  |
|  |     authorization with some payers.                            |  |
|  |                                                                |  |
|  |     Risk: CO-15 - Authorization not obtained                   |  |
|  |                                                                |  |
|  |     Recommendation:                                            |  |
|  |     - United Healthcare requires prior auth after 12 sessions  |  |
|  |     - Medicare generally does not require auth                 |  |
|  |     - Check payer-specific requirements                        |  |
|  |                                                                |  |
|  |     [Check Authorization Requirements]  [Add Auth Number]      |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|  | [v] Provider Verification                             PASS     |  |
|  |     NPI 1234567893 is active. Specialty: Psychiatry            |  |
|  +----------------------------------------------------------------+  |
|  | [!] Documentation Requirements                        INFO     |  |
|  |     60-minute session requires start/end time documentation    |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Wireframe - Fail Result

```
+----------------------------------------------------------------------+
|                                                                      |
|  +------------------------+                                          |
|  |                        |    Robert Johnson                        |
|  |      [X Circle]        |    Claim ID: CLM-2026-0112-4523          |
|  |        FAIL            |    Validated: Jan 12, 2026 at 2:58 PM    |
|  |                        |                                          |
|  |    Score: 34/100       |    Risk: CO-11 (Diagnosis Mismatch)      |
|  |                        |                                          |
|  +------------------------+                                          |
|                                                                      |
|  [Fix Issues]  [Export PDF]  [Edit Claim]                            |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  [Validation]  [Coverage]  [Documentation]  [History]                |
|  ================================================================    |
|                                                                      |
|  Validation Checks                                                   |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  | [x] CPT-ICD Match                                    FAIL      |  |
|  |                                                                |  |
|  |     MISMATCH DETECTED                                          |  |
|  |                                                                |  |
|  |     CPT 96413 (Chemotherapy IV infusion) requires an           |  |
|  |     oncology diagnosis (C-codes).                              |  |
|  |                                                                |  |
|  |     Current: J18.9 (Pneumonia, unspecified)                    |  |
|  |                                                                |  |
|  |     Denial Risk: CO-11 - Diagnosis inconsistent with procedure |  |
|  |                                                                |  |
|  |     +--------------------------------------------------------+ |  |
|  |     | Suggested ICD-10 Codes for CPT 96413:                  | |  |
|  |     |                                                        | |  |
|  |     | C50.911 - Malignant neoplasm, right female breast      | |  |
|  |     | C34.90 - Malignant neoplasm, unspecified lung          | |  |
|  |     | C18.9  - Malignant neoplasm, colon unspecified         | |  |
|  |     | C61    - Malignant neoplasm of prostate                | |  |
|  |     |                                                        | |  |
|  |     | [Apply C50.911]  [View All Suggestions]                | |  |
|  |     +--------------------------------------------------------+ |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|  | [v] Provider Verification                             PASS     |  |
|  +----------------------------------------------------------------+  |
|  | [x] Prior Authorization                               FAIL     |  |
|  |     Chemotherapy requires prior authorization. None provided.  |  |
|  |     [Request Authorization]                                    |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Coverage Tab

```
+----------------------------------------------------------------------+
|                                                                      |
|  [Validation]  [Coverage *]  [Documentation]  [History]              |
|  ================================================================    |
|                                                                      |
|  Medicare Coverage Analysis                                          |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |  CPT 96413 - Chemotherapy IV Infusion                          |  |
|  |                                                                |  |
|  |  Coverage Status: COVERED (with conditions)                    |  |
|  |                                                                |  |
|  |  +----------------------------------------------------------+  |  |
|  |  | National Coverage Determinations (NCDs)                  |  |  |
|  |  +----------------------------------------------------------+  |  |
|  |  | NCD 110.17 - Anti-Cancer Chemotherapy                    |  |  |
|  |  | Covers chemotherapy for FDA-approved indications and     |  |  |
|  |  | off-label use supported by medical compendia.            |  |  |
|  |  +----------------------------------------------------------+  |  |
|  |                                                                |  |
|  |  +----------------------------------------------------------+  |  |
|  |  | Local Coverage Determinations (LCDs)                     |  |  |
|  |  +----------------------------------------------------------+  |  |
|  |  | LCD L35396 - Biomarkers for Oncology                     |  |  |
|  |  | MAC: Novitas Solutions                                   |  |  |
|  |  | Requires documentation of tumor markers for targeted     |  |  |
|  |  | therapies including pembrolizumab.                       |  |  |
|  |  +----------------------------------------------------------+  |  |
|  |                                                                |  |
|  |  Documentation Requirements                                    |  |
|  |  - Pathology report confirming malignancy                     |  |
|  |  - Treatment plan from oncologist                             |  |
|  |  - Drug administration record with start/end times            |  |
|  |  - Prior authorization (if applicable)                        |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  Drug Coverage: J9271 (Pembrolizumab)                                |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  FDA-Approved Indications:                                     |  |
|  |  - TNBC (triple-negative breast cancer) with PD-L1 >= 10%     |  |
|  |  - Unresectable/metastatic melanoma                           |  |
|  |  - NSCLC with PD-L1 >= 1%                                     |  |
|  |  - [View all 18 approved indications]                         |  |
|  |                                                                |  |
|  |  Prior Authorization: REQUIRED                                 |  |
|  |  Average Wholesale Price: $10,897.56 per 100mg                |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Specifications

### Status Header

| Status | Background | Icon | Border |
|--------|------------|------|--------|
| Pass | sage-100 | CheckCircle (sage-600) | sage-300 |
| Warning | amber-100 | AlertTriangle (amber-600) | amber-300 |
| Fail | rose-100 | XCircle (rose-600) | rose-300 |

### Score Display

| Range | Color | Label |
|-------|-------|-------|
| 90-100 | sage-600 | Excellent |
| 70-89 | amber-600 | Review Recommended |
| 50-69 | orange-600 | High Risk |
| 0-49 | rose-600 | Critical Issues |

### Validation Check Card

| Element | Spec |
|---------|------|
| Container | White bg, slate-200 border, 8px radius |
| Status Icon | 20px, positioned left |
| Title | 16px, Inter semibold, Slate-900 |
| Status Badge | 12px, right-aligned |
| Description | 14px, Inter regular, Slate-600 |
| Recommendation | 14px, sage-700 on sage-50 background |

### Tab Navigation

| State | Style |
|-------|-------|
| Active | Amber-600 text, amber-600 bottom border |
| Inactive | Slate-500 text, no border |
| Hover | Slate-700 text |

---

## Interactions

| Action | Result |
|--------|--------|
| Click "Fix Issues" | Scroll to first error, open edit mode |
| Click "Apply [code]" | Update claim, re-validate |
| Click "Submit to Clearinghouse" | Open submission modal |
| Click "Export PDF" | Generate and download PDF report |
| Switch tabs | Show corresponding content |
| Click denial code | Open modal with detailed explanation |

---

## Denial Code Reference Modal

```
+--------------------------------------------------+
|                                                  |
|  CO-11: Diagnosis Inconsistent with Procedure    |
|                                              [x] |
+--------------------------------------------------+
|                                                  |
|  Description                                     |
|  The diagnosis provided does not support the     |
|  medical necessity of the procedure billed.      |
|                                                  |
|  Common Causes                                   |
|  - Wrong ICD-10 code selected                    |
|  - Diagnosis doesn't match specialty             |
|  - Missing secondary diagnosis                   |
|                                                  |
|  Prevention                                      |
|  - Verify ICD-10 codes match procedure type      |
|  - Include all relevant diagnoses                |
|  - Document medical necessity clearly            |
|                                                  |
|  Appeal Success Rate: 62%                        |
|                                                  |
|  [View Appeal Template]  [Close]                 |
|                                                  |
+--------------------------------------------------+
```
