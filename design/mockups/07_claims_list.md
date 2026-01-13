# Screen 07: Claims List

## Overview

**Purpose:** Browse, filter, and manage all validated claims
**URL:** `/claims`

---

## Wireframe

```
+-----------------------------------------------------------------------------------+
| [Logo] ClaimScrub                    [Search claims...]        [?] [Bell] [Avatar]|
+-----------------------------------------------------------------------------------+
|        |                                                                          |
|   [=]  |  Claims                                                   [+ New Claim]  |
|        |  -----------------------------------------------------------------------  |
| -------|                                                                          |
|        |  +----------------------------------------------------------------------+ |
|  Dash  |  |                                                                      | |
|        |  |  [All]  [Pass]  [Warning]  [Failed]  [Pending]           [Filter v]  | |
|  Claims*|  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|  Chat  |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|  Report|  |                                                                      | |
|        |  |  +---+  +-----------------------------------------------------+      | |
|  ------+  |  |[ ]|  | Search by patient name, claim ID, or CPT code...    |      | |
|        |  |  +---+  +-----------------------------------------------------+      | |
|  Settin|  |                                                                      | |
|        |  |  Showing 47 claims                              [Sort: Newest v]     | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|        |  |  +------------------------------------------------------------------+| |
|        |  |  |[ ]| Patient        | Claim ID      | CPT   | Status  | DOS      || |
|        |  |  +------------------------------------------------------------------+| |
|        |  |  |[ ]| Maria Santos   | CLM-2026-4521 | 96413 | [PASS]  | 01/12/26 || |
|        |  |  |   | Medicare       | $9,650.00     |       |         |          || |
|        |  |  +------------------------------------------------------------------+| |
|        |  |  |[ ]| James Wilson   | CLM-2026-4522 | 90837 | [WARN]  | 01/12/26 || |
|        |  |  |   | United HC      | $185.00       | CO-15 |         |          || |
|        |  |  +------------------------------------------------------------------+| |
|        |  |  |[ ]| Emily Chen     | CLM-2026-4520 | 59400 | [PASS]  | 01/11/26 || |
|        |  |  |   | Aetna          | $4,200.00     |       |         |          || |
|        |  |  +------------------------------------------------------------------+| |
|        |  |  |[ ]| Robert Johnson | CLM-2026-4523 | 96413 | [FAIL]  | 01/12/26 || |
|        |  |  |   | Medicare       | $8,450.00     | CO-11 |         |          || |
|        |  |  +------------------------------------------------------------------+| |
|        |  |  |[ ]| Sarah Williams | CLM-2026-4519 | 95251 | [WARN]  | 01/11/26 || |
|        |  |  |   | BCBS           | $275.00       | CO-16 |         |          || |
|        |  |  +------------------------------------------------------------------+| |
|        |  |  |[ ]| Michael Brown  | CLM-2026-4518 | 99214 | [PASS]  | 01/10/26 || |
|        |  |  |   | Cigna          | $145.00       |       |         |          || |
|        |  |  +------------------------------------------------------------------+| |
|        |  |                                                                      | |
|        |  |  [<]  Page 1 of 8  [>]                                               | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
+-----------------------------------------------------------------------------------+
```

---

## Filter Panel (Expanded)

```
+----------------------------------------------------------------------+
|                                                                      |
|  Filters                                              [Clear All]    |
|                                                                      |
|  +--------------------------------+  +-----------------------------+ |
|  | Date Range                     |  | Payer                       | |
|  | [01/01/2026] - [01/12/2026]    |  | [All Payers]            [v] | |
|  +--------------------------------+  +-----------------------------+ |
|                                                                      |
|  +--------------------------------+  +-----------------------------+ |
|  | Specialty                      |  | Provider                    | |
|  | [All Specialties]          [v] |  | [All Providers]         [v] | |
|  +--------------------------------+  +-----------------------------+ |
|                                                                      |
|  +--------------------------------+  +-----------------------------+ |
|  | Denial Risk                    |  | Charge Amount               | |
|  | [ ] CO-11                      |  | Min: [$0]                   | |
|  | [ ] CO-15                      |  | Max: [$10,000]              | |
|  | [ ] CO-16                      |  +-----------------------------+ |
|  | [ ] CO-4                       |                                 |
|  | [ ] CO-29                      |                                 |
|  +--------------------------------+                                 |
|                                                                      |
|  [Apply Filters]                                                     |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Bulk Actions Bar

```
+----------------------------------------------------------------------+
|                                                                      |
|  3 claims selected                                                   |
|                                                                      |
|  [Export Selected]  [Revalidate]  [Delete]           [Deselect All]  |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Claim Row - Expanded View

```
+----------------------------------------------------------------------+
|                                                                      |
| [v] Maria Santos                    CLM-2026-4521         01/12/2026 |
|     Medicare Part B                 $9,650.00             [PASS]     |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |  Service Lines                                                 |  |
|  |                                                                |  |
|  |  Line 1: 96413 (Chemo IV infusion) - C50.911 - JW - $8,450.00  |  |
|  |  Line 2: 96415 (Chemo IV addl hr) - C50.911 - $1,200.00        |  |
|  |                                                                |  |
|  |  Validation Score: 98/100                                      |  |
|  |  Last Validated: Jan 12, 2026 at 2:34 PM                       |  |
|  |                                                                |  |
|  |  [View Details]  [Revalidate]  [Export]  [Edit]                |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Specifications

### Status Tabs

| Tab | Filter | Count Badge |
|-----|--------|-------------|
| All | None | Total count |
| Pass | status=pass | Green badge |
| Warning | status=warning | Amber badge |
| Failed | status=fail | Rose badge |
| Pending | status=pending | Slate badge |

### Table Columns

| Column | Width | Content |
|--------|-------|---------|
| Checkbox | 48px | Multi-select |
| Patient | 20% | Name, payer (secondary) |
| Claim ID | 15% | ID, charge amount (secondary) |
| CPT | 10% | Primary CPT code |
| Status | 12% | Badge + denial code if applicable |
| DOS | 12% | Date of service |
| Actions | 10% | View, Edit, More |

### Sort Options

- Newest first (default)
- Oldest first
- Patient A-Z
- Patient Z-A
- Highest charge
- Lowest charge
- Status (Failed first)

### Pagination

| Element | Spec |
|---------|------|
| Items per page | 25 (configurable: 10, 25, 50, 100) |
| Page buttons | Previous, Next, page numbers |
| Jump to page | Input field for large datasets |

---

## Interactions

| Action | Result |
|--------|--------|
| Click row | Expand inline preview |
| Double-click row | Navigate to claim detail |
| Click checkbox | Select for bulk actions |
| Click column header | Sort by column |
| Click tab | Filter by status |
| Click "View Details" | Navigate to validation results |
| Click "Export Selected" | Download CSV/PDF of selected |

---

## Empty States

### No Claims

```
+----------------------------------------------------------------------+
|                                                                      |
|                        [Document Icon]                               |
|                                                                      |
|                   No claims validated yet                            |
|                                                                      |
|         Start by creating your first claim or uploading              |
|                     an 837 file for validation.                      |
|                                                                      |
|                    [+ Create First Claim]                            |
|                                                                      |
+----------------------------------------------------------------------+
```

### No Results (with filters)

```
+----------------------------------------------------------------------+
|                                                                      |
|                        [Search Icon]                                 |
|                                                                      |
|                   No claims match your filters                       |
|                                                                      |
|         Try adjusting your filters or search terms.                  |
|                                                                      |
|                      [Clear All Filters]                             |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Mobile View

```
+----------------------------------+
|                                  |
| Claims                    [+]    |
|                                  |
| [All] [Pass] [Warn] [Fail]       |
|                                  |
| +------------------------------+ |
| |                              | |
| | Maria Santos         [PASS]  | |
| | CLM-2026-4521                | |
| | 96413 | $9,650 | 01/12/26    | |
| |                              | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| |                              | |
| | James Wilson         [WARN]  | |
| | CLM-2026-4522        CO-15   | |
| | 90837 | $185 | 01/12/26      | |
| |                              | |
| +------------------------------+ |
|                                  |
+----------------------------------+
```
