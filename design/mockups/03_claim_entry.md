# Screen 03: Claim Entry Form

## Overview

**Purpose:** Enter or import claim data for validation
**URL:** `/claims/new`

---

## Wireframe

```
+-----------------------------------------------------------------------------------+
| [Logo] ClaimScrub                    [Search claims...]        [?] [Bell] [Avatar]|
+-----------------------------------------------------------------------------------+
|        |                                                                          |
|   [=]  |  New Claim                                              [Cancel] [Save]  |
|        |  -----------------------------------------------------------------------  |
| -------|                                                                          |
|        |  +----------------------------------------------------------------------+ |
|  Dash  |  |  [1. Patient]    [2. Provider]    [3. Services]    [4. Review]       | |
|        |  +----------------------------------------------------------------------+ |
|  Claims|                                                                          |
|        |  +----------------------------------------------------------------------+ |
|  Chat  |  |                                                                      | |
|        |  |  Patient Information                                                 | |
|  Report|  |                                                                      | |
|        |  |  +---------------------------+  +---------------------------+        | |
|  ------+  |  | First Name *              |  | Last Name *               |        | |
|        |  |  | Maria                     |  | Santos                    |        | |
|  Settin|  |  +---------------------------+  +---------------------------+        | |
|        |  |                                                                      | |
|        |  |  +---------------------------+  +---------------------------+        | |
|        |  |  | Date of Birth *           |  | Gender *                  |        | |
|        |  |  | 03/15/1985                |  | Female                [v] |        | |
|        |  |  +---------------------------+  +---------------------------+        | |
|        |  |                                                                      | |
|        |  |  Insurance Information                                               | |
|        |  |  ------------------------------------------------------------------- | |
|        |  |                                                                      | |
|        |  |  +---------------------------+  +---------------------------+        | |
|        |  |  | Payer *                   |  | Plan Type                 |        | |
|        |  |  | Medicare              [v] |  | Part B                [v] |        | |
|        |  |  +---------------------------+  +---------------------------+        | |
|        |  |                                                                      | |
|        |  |  +---------------------------+  +---------------------------+        | |
|        |  |  | Member ID *               |  | Group Number              |        | |
|        |  |  | 1EG4-TE5-MK72             |  | GRP-4521                  |        | |
|        |  |  +---------------------------+  +---------------------------+        | |
|        |  |                                                                      | |
|        |  |  +-------------------------------------------------------------+    | |
|        |  |  | Prior Authorization #                                       |    | |
|        |  |  | AUTH-2026-0112-4521                                         |    | |
|        |  |  +-------------------------------------------------------------+    | |
|        |  |                                                                      | |
|        |  |                                           [Back]  [Continue -->]     | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
+-----------------------------------------------------------------------------------+
```

---

## Step 2: Provider Information

```
+----------------------------------------------------------------------+
|  [1. Patient]    [2. Provider *]    [3. Services]    [4. Review]     |
+----------------------------------------------------------------------+
|                                                                      |
|  Provider Information                                                |
|                                                                      |
|  +---------------------------+  +---------------------------+        |
|  | Rendering Provider NPI *  |  | Billing Provider NPI      |        |
|  | 1234567893                |  | 1234567893                |        |
|  +---------------------------+  +---------------------------+        |
|  | [v] Dr. Sarah Chen, MD    |  | [v] Same as rendering     |        |
|  | Oncology                  |  |                           |        |
|  | Memorial Health System    |  |                           |        |
|  +---------------------------+  +---------------------------+        |
|                                                                      |
|  +---------------------------+  +---------------------------+        |
|  | Taxonomy Code             |  | Service Facility NPI      |        |
|  | 207RX0202X            [v] |  | 1234567893                |        |
|  +---------------------------+  +---------------------------+        |
|                                                                      |
|  Place of Service                                                    |
|  +-------------------------------------------------------------+    |
|  | 11 - Office                                              [v] |    |
|  +-------------------------------------------------------------+    |
|                                                                      |
|                                           [<-- Back]  [Continue -->] |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Step 3: Services (Line Items)

```
+----------------------------------------------------------------------+
|  [1. Patient]    [2. Provider]    [3. Services *]    [4. Review]     |
+----------------------------------------------------------------------+
|                                                                      |
|  Service Lines                                          [+ Add Line] |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  | Line 1                                                    [x]  |  |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  | +----------------+  +----------------+  +--------------------+ |  |
|  | | Date of Service|  | CPT Code *     |  | Modifiers          | |  |
|  | | 01/12/2026     |  | 96413          |  | [JW] [  ] [  ]     | |  |
|  | +----------------+  +----------------+  +--------------------+ |  |
|  |                                                                |  |
|  | CPT Description: Chemotherapy IV infusion, first hour          |  |
|  |                                                                |  |
|  | +---------------------------------------------+  +----------+  |  |
|  | | ICD-10 Diagnosis Codes *                    |  | Units    |  |  |
|  | | C50.911  Malignant neoplasm, right breast   |  | 1        |  |  |
|  | | [+ Add diagnosis]                           |  |          |  |  |
|  | +---------------------------------------------+  +----------+  |  |
|  |                                                                |  |
|  | +---------------------------+  +---------------------------+   |  |
|  | | Drug Code (J-Code)        |  | Drug Units                |   |  |
|  | | J9271 - Pembrolizumab     |  | 200                       |   |  |
|  | +---------------------------+  +---------------------------+   |  |
|  |                                                                |  |
|  | +---------------------------+                                  |  |
|  | | Charge Amount             |                                  |  |
|  | | $8,450.00                 |                                  |  |
|  | +---------------------------+                                  |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  | Line 2                                                    [x]  |  |
|  +----------------------------------------------------------------+  |
|  | DOS: 01/12/2026  |  CPT: 96415  |  Mod: --  |  Units: 2        |  |
|  | ICD-10: C50.911  |  Charge: $1,200.00                          |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|                                           [<-- Back]  [Continue -->] |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Step 4: Review & Validate

```
+----------------------------------------------------------------------+
|  [1. Patient]    [2. Provider]    [3. Services]    [4. Review *]     |
+----------------------------------------------------------------------+
|                                                                      |
|  Review Claim                                                        |
|                                                                      |
|  +--------------------------------+  +-----------------------------+ |
|  |                                |  |                             | |
|  |  Patient                       |  |  Provider                   | |
|  |  Maria Santos                  |  |  Dr. Sarah Chen, MD         | |
|  |  DOB: 03/15/1985               |  |  NPI: 1234567893            | |
|  |  Medicare Part B               |  |  Oncology                   | |
|  |  ID: 1EG4-TE5-MK72             |  |  Memorial Health System     | |
|  |                                |  |                             | |
|  +--------------------------------+  +-----------------------------+ |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |  Service Lines                                                 |  |
|  |                                                                |  |
|  |  +----------------------------------------------------------+  |  |
|  |  | Line | DOS        | CPT   | Mod | ICD-10  | Charge       |  |  |
|  |  +----------------------------------------------------------+  |  |
|  |  | 1    | 01/12/2026 | 96413 | JW  | C50.911 | $8,450.00    |  |  |
|  |  | 2    | 01/12/2026 | 96415 | --  | C50.911 | $1,200.00    |  |  |
|  |  +----------------------------------------------------------+  |  |
|  |                                                                |  |
|  |  Total Charges: $9,650.00                                      |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |  Pre-Validation Checks                                         |  |
|  |                                                                |  |
|  |  [v] Patient information complete                              |  |
|  |  [v] Provider NPI validated                                    |  |
|  |  [v] All required fields present                               |  |
|  |  [v] Date of service within filing limit                       |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|                              [<-- Back]  [Validate Claim -->]        |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Specifications

### Step Indicator

| State | Style |
|-------|-------|
| Completed | Amber-600 background, white text, checkmark |
| Current | Amber-600 border, Amber-600 text |
| Upcoming | Slate-300 border, Slate-500 text |

### Form Fields

| Field | Type | Validation |
|-------|------|------------|
| First/Last Name | Text | Required, 2-50 chars |
| DOB | Date picker | Required, not future |
| Gender | Select | Required |
| Payer | Searchable select | Required |
| Member ID | Text | Required |
| NPI | Text + lookup | Required, Luhn validated |
| CPT | Searchable select | Required, valid code |
| ICD-10 | Multi-select | At least one required |
| Modifiers | Multi-select | Max 4 |
| Charge | Currency | Required, > 0 |

### NPI Lookup

When NPI is entered:
1. Validate format (Luhn algorithm)
2. Query NPI Registry
3. Show provider details inline
4. Flag if inactive or specialty mismatch

### CPT/ICD Autocomplete

```
+------------------------------------------+
| Search: "964"                            |
+------------------------------------------+
| 96413 - Chemo IV infusion, 1st hr        |
| 96415 - Chemo IV infusion, addl hr       |
| 96416 - Chemo IV infusion, initiation    |
| 96417 - Chemo IV infusion, each addl     |
+------------------------------------------+
```

---

## Interactions

| Action | Result |
|--------|--------|
| Enter NPI | Auto-lookup, show provider card |
| Select CPT | Show description, suggest modifiers |
| Enter ICD-10 | Auto-validate, show description |
| Click "+ Add Line" | Add new service line |
| Click "Validate Claim" | Run validation, show results |

---

## Error Handling

| Error | Display |
|-------|---------|
| Invalid NPI | Red border, "Invalid NPI format" below |
| NPI not found | Yellow border, "NPI not found in registry" |
| Missing required | Red border, "This field is required" |
| Invalid date | Red border, "Please enter a valid date" |
