# Screen 02: Dashboard

## Overview

**Purpose:** Central hub showing claim statistics, recent validations, and quick actions
**URL:** `/dashboard`

---

## Wireframe

```
+-----------------------------------------------------------------------------------+
| [Logo] ClaimScrub                    [Search claims...]        [?] [Bell] [Avatar]|
+-----------------------------------------------------------------------------------+
|        |                                                                          |
|   [=]  |  Dashboard                                                               |
|        |  -----------------------------------------------------------------------  |
| -------|                                                                          |
|        |  +------------------+ +------------------+ +------------------+ +-------+ |
|  Dash  |  |                  | |                  | |                  | |       | |
|        |  | Claims Today     | | Pass Rate        | | Flagged          | | Saved | |
|  Claims|  |                  | |                  | |                  | |       | |
|        |  |      47          | |     94.2%        | |       3          | | $2,847| |
|  Chat  |  |                  | |                  | |                  | |       | |
|        |  | +12 from yesterday| | +2.1% this week | | -5 from yesterday| | /week | |
|  Report|  +------------------+ +------------------+ +------------------+ +-------+ |
|        |                                                                          |
|  ------+  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|  Settin|  |  Quick Actions                                                       | |
|        |  |                                                                      | |
|        |  |  +------------------+  +------------------+  +------------------+     | |
|        |  |  |                  |  |                  |  |                  |     | |
|        |  |  | [+] New Claim    |  | [^] Upload 837   |  | [^] Batch CSV    |     | |
|        |  |  |                  |  |                  |  |                  |     | |
|        |  |  +------------------+  +------------------+  +------------------+     | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|        |  |  Recent Validations                                    [View All >]  | |
|        |  |                                                                      | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | Patient         | CPT      | Status   | Risk    | Time        |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | Maria Santos    | 96413    | [PASS]   | --      | 2 min ago   |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | James Wilson    | 90837    | [WARN]   | CO-15   | 5 min ago   |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | Emily Chen      | 59400    | [PASS]   | --      | 12 min ago  |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | Robert Johnson  | 99214    | [FAIL]   | CO-11   | 18 min ago  |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |  | Sarah Williams  | 95251    | [WARN]   | CO-16   | 24 min ago  |  | |
|        |  |  +----------------------------------------------------------------+  | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------+ +----------------------------------+ |
|        |  |                                  | |                                  | |
|        |  |  Denial Risk by Code             | |  Claims by Specialty             | |
|        |  |                                  | |                                  | |
|        |  |  CO-11  =========== 34%          | |  Mental Health    ====== 28%    | |
|        |  |  CO-15  ======== 26%             | |  Oncology         ===== 24%     | |
|        |  |  CO-16  ====== 18%               | |  OB-GYN           ==== 22%      | |
|        |  |  CO-4   ==== 12%                 | |  Endocrinology    ==== 21%      | |
|        |  |  Other  === 10%                  | |  Other            = 5%          | |
|        |  |                                  | |                                  | |
|        |  +----------------------------------+ +----------------------------------+ |
|        |                                                                          |
+-----------------------------------------------------------------------------------+
```

---

## Specifications

### Header

| Element | Spec |
|---------|------|
| Height | 56px |
| Logo | 32px height, clickable to dashboard |
| Search | 320px width, expandable on focus |
| Help Icon | Opens help panel |
| Notifications | Badge shows unread count |
| Avatar | Dropdown with profile, settings, logout |

### Sidebar

| Element | Spec |
|---------|------|
| Width | 240px (collapsible to 64px on mobile) |
| Active Item | Amber-600 left border, Amber-50 background |
| Icons | 20px, Slate-500 default, Amber-600 active |

### Stat Cards

| Element | Spec |
|---------|------|
| Height | 120px |
| Padding | 24px |
| Number | 36px, Merriweather, Slate-900 |
| Label | 14px, Inter, Slate-500 |
| Change | 12px, green/red based on direction |

### Quick Actions

| Button | Icon | Action |
|--------|------|--------|
| New Claim | Plus | Opens claim entry form |
| Upload 837 | Upload | Opens file picker for 837 |
| Batch CSV | Upload | Opens file picker for CSV |

### Recent Validations Table

| Column | Width | Content |
|--------|-------|---------|
| Patient | 25% | Name, clickable |
| CPT | 15% | Code, monospace |
| Status | 15% | Badge (Pass/Warn/Fail) |
| Risk | 20% | Denial code or "--" |
| Time | 15% | Relative time |
| Actions | 10% | View, Edit icons |

### Charts

| Chart | Type | Library |
|-------|------|---------|
| Denial Risk | Horizontal bar | Recharts |
| Specialty | Horizontal bar | Recharts |

---

## Interactions

| Action | Result |
|--------|--------|
| Click stat card | Navigate to filtered claims list |
| Click quick action | Open respective modal/form |
| Click table row | Open claim detail view |
| Hover table row | Show action icons |
| Click "View All" | Navigate to claims list |

---

## Empty State

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

---

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| < 1024px | Sidebar collapses to icons only |
| < 768px | Stat cards stack 2x2, charts stack vertically |
| < 640px | Sidebar becomes bottom nav, single column layout |
