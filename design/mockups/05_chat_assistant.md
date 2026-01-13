# Screen 05: Chat Assistant

## Overview

**Purpose:** AI-powered assistant for quick document lookup and claim questions
**URL:** `/chat` or floating panel on all pages

---

## Wireframe - Floating Panel (Collapsed)

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                                    +-----------------------------+|
|                                                    |                             ||
|  [Main Application Content]                        |  [Message Icon]             ||
|                                                    |  Ask ClaimScrub             ||
|                                                    |                             ||
|                                                    +-----------------------------+|
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## Wireframe - Floating Panel (Expanded)

```
+-----------------------------------------------------------------------------------+
|                                          +---------------------------------------+|
|                                          |  ClaimScrub Assistant            [_] ||
|                                          +---------------------------------------+|
|                                          |                                       ||
|  [Main Application Content]              |  Today                                ||
|                                          |                                       ||
|                                          |  +----------------------------------+ ||
|                                          |  | What are the prior auth          | ||
|                                          |  | requirements for CPT 90837?      | ||
|                                          |  +----------------------------------+ ||
|                                          |                                       ||
|                                          |  +----------------------------------+ ||
|                                          |  |                                  | ||
|                                          |  | CPT 90837 (60-minute             | ||
|                                          |  | psychotherapy) prior auth        | ||
|                                          |  | requirements vary by payer:      | ||
|                                          |  |                                  | ||
|                                          |  | Medicare Part B                  | ||
|                                          |  | Generally not required for       | ||
|                                          |  | standard outpatient mental       | ||
|                                          |  | health services.                 | ||
|                                          |  |                                  | ||
|                                          |  | United Healthcare                | ||
|                                          |  | Required after 12 sessions per   | ||
|                                          |  | calendar year.                   | ||
|                                          |  |                                  | ||
|                                          |  | Aetna                            | ||
|                                          |  | May require after 20 sessions.   | ||
|                                          |  |                                  | ||
|                                          |  | [View Full Coverage Details]     | ||
|                                          |  |                                  | ||
|                                          |  +----------------------------------+ ||
|                                          |                                       ||
|                                          +---------------------------------------+|
|                                          |                                       ||
|                                          | +-----------------------------------+ ||
|                                          | | Ask about claims, codes, or...   | ||
|                                          | +-----------------------------------+ ||
|                                          | [Mic]                        [Send] | ||
|                                          +---------------------------------------+|
+-----------------------------------------------------------------------------------+
```

---

## Wireframe - Full Page Chat

```
+-----------------------------------------------------------------------------------+
| [Logo] ClaimScrub                    [Search claims...]        [?] [Bell] [Avatar]|
+-----------------------------------------------------------------------------------+
|        |                                                                          |
|   [=]  |  Assistant                                                               |
|        |  -----------------------------------------------------------------------  |
| -------|                                                                          |
|        |  +----------------------------------------------------------------------+ |
|  Dash  |  |                                                                      | |
|        |  |  +------------------------------+  +------------------------------+  | |
|  Claims|  |  | Suggested Questions          |  | Recent Documents             |  | |
|        |  |  |                              |  |                              |  | |
|  Chat *|  |  | - What diagnosis codes       |  | - Maria Santos EOB           |  | |
|        |  |  |   support CPT 96413?         |  |   Jan 12, 2026               |  | |
|  Report|  |  |                              |  |                              |  | |
|        |  |  | - Does J9271 require         |  | - James Wilson Claim         |  | |
|  ------+  |  |   prior authorization?       |  |   Jan 12, 2026               |  | |
|        |  |  |                              |  |                              |  | |
|  Settin|  |  | - Show me claims at          |  | - Auth Request #4521         |  | |
|        |  |  |   risk for CO-11             |  |   Jan 11, 2026               |  | |
|        |  |  |                              |  |                              |  | |
|        |  |  +------------------------------+  +------------------------------+  | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|        |  |                     [ClaimScrub Logo Icon]                           | |
|        |  |                                                                      | |
|        |  |              How can I help with your claims today?                  | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
|        |  +----------------------------------------------------------------------+ |
|        |  |                                                                      | |
|        |  | +------------------------------------------------------------------+ | |
|        |  | | Ask about claims, coverage, codes, or pull up documents...      | | |
|        |  | +------------------------------------------------------------------+ | |
|        |  |                                                                      | |
|        |  | [Mic]  [Attach]                                            [Send]    | |
|        |  |                                                                      | |
|        |  +----------------------------------------------------------------------+ |
|        |                                                                          |
+-----------------------------------------------------------------------------------+
```

---

## Wireframe - Active Conversation

```
+----------------------------------------------------------------------+
|                                                                      |
|  Today                                                               |
|                                                                      |
|  +------------------------------------------------------------------+|
|  |                                                                  ||
|  |  Show me all claims with CO-11 risk from this week       2:34 PM ||
|  |                                                                  ||
|  +------------------------------------------------------------------+|
|                                                                      |
|  +------------------------------------------------------------------+|
|  |                                                                  ||
|  |  I found 3 claims with CO-11 (Diagnosis Mismatch) risk:          ||
|  |                                                                  ||
|  |  +------------------------------------------------------------+ ||
|  |  | Patient       | CPT   | Issue                    | Action  | ||
|  |  +------------------------------------------------------------+ ||
|  |  | R. Johnson    | 96413 | J18.9 doesn't support    | [View]  | ||
|  |  |               |       | chemotherapy             |         | ||
|  |  +------------------------------------------------------------+ ||
|  |  | T. Martinez   | 59510 | E11.9 doesn't support    | [View]  | ||
|  |  |               |       | C-section                |         | ||
|  |  +------------------------------------------------------------+ ||
|  |  | K. Patel      | 90837 | Z00.00 doesn't support   | [View]  | ||
|  |  |               |       | psychotherapy            |         | ||
|  |  +------------------------------------------------------------+ ||
|  |                                                                  ||
|  |  Would you like me to suggest correct diagnosis codes for        ||
|  |  any of these claims?                                            ||
|  |                                                                  ||
|  +------------------------------------------------------------------+|
|                                                                      |
|  +------------------------------------------------------------------+|
|  |                                                                  ||
|  |  Yes, suggest codes for R. Johnson                       2:35 PM ||
|  |                                                                  ||
|  +------------------------------------------------------------------+|
|                                                                      |
|  +------------------------------------------------------------------+|
|  |                                                                  ||
|  |  For R. Johnson's claim (CPT 96413 - Chemotherapy IV             ||
|  |  infusion), here are appropriate diagnosis codes:                ||
|  |                                                                  ||
|  |  Recommended ICD-10 Codes:                                       ||
|  |                                                                  ||
|  |  C50.911 - Malignant neoplasm of right female breast             ||
|  |            Most common for breast cancer chemotherapy            ||
|  |                                                                  ||
|  |  C50.912 - Malignant neoplasm of left female breast              ||
|  |                                                                  ||
|  |  C34.90  - Malignant neoplasm of lung, unspecified               ||
|  |            If treating lung cancer                               ||
|  |                                                                  ||
|  |  Note: The specific code should match the patient's              ||
|  |  documented cancer diagnosis from pathology reports.             ||
|  |                                                                  ||
|  |  [Apply C50.911 to Claim]  [View Patient History]                ||
|  |                                                                  ||
|  +------------------------------------------------------------------+|
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
| +------------------------------------------------------------------+ |
| | Type a message or speak...                                       | |
| +------------------------------------------------------------------+ |
|                                                                      |
| [Mic]  [Attach]                                            [Send]    |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Voice Input State

```
+----------------------------------------------------------------------+
|                                                                      |
| +------------------------------------------------------------------+ |
| |                                                                  | |
| |                    [Pulsing Mic Icon]                            | |
| |                                                                  | |
| |                      Listening...                                | |
| |                                                                  | |
| |     "Show me claims at risk for..."                              | |
| |                                                                  | |
| +------------------------------------------------------------------+ |
|                                                                      |
|                           [Stop]                                     |
|                                                                      |
+----------------------------------------------------------------------+
```

---

## Specifications

### Chat Panel

| Element | Spec |
|---------|------|
| Width (floating) | 400px |
| Width (full page) | 100%, max 800px centered |
| Height (floating) | 500px max, resizable |
| Background | White |
| Border | Slate-200, 12px radius |
| Shadow | lg |

### Messages

| Type | Style |
|------|-------|
| User | Right-aligned, Amber-50 bg, Slate-900 text |
| Assistant | Left-aligned, White bg, Slate-700 text |
| System | Centered, Slate-100 bg, Slate-500 text |

### Input Area

| Element | Spec |
|---------|------|
| Container | 56px min height, Slate-50 bg, top border |
| Input | 16px, Inter, expandable textarea |
| Mic Button | 40px, Slate-500, hover: Amber-600 |
| Send Button | 40px, Amber-600, disabled: Slate-300 |

### Voice Recording

| State | Visual |
|-------|--------|
| Idle | Mic icon, Slate-500 |
| Recording | Pulsing amber circle, live transcript |
| Processing | Spinner, "Processing..." |

---

## Supported Queries

### Document Lookup

- "Show me [patient name]'s recent claims"
- "Pull up the EOB for claim #[number]"
- "Find claims submitted last week"

### Code Information

- "What diagnosis codes support CPT [code]?"
- "Does [CPT code] require prior authorization?"
- "Explain ICD-10 code [code]"

### Claim Analysis

- "Show me claims at risk for [denial code]"
- "Which claims are approaching filing deadline?"
- "What's the denial rate for [specialty]?"

### Coverage Questions

- "What are Medicare requirements for [procedure]?"
- "Does [drug] require prior auth?"
- "Show NCD/LCD for [CPT code]"

---

## Interactions

| Action | Result |
|--------|--------|
| Click mic | Start voice recording |
| Click stop | Process voice, populate input |
| Press Enter | Send message |
| Click [View] on result | Navigate to claim detail |
| Click [Apply code] | Update claim, confirm action |
| Click attachment | Open file picker |
| Minimize panel | Collapse to floating button |

---

## Empty State

```
+----------------------------------------------------------------------+
|                                                                      |
|                     [ClaimScrub Logo Icon]                           |
|                                                                      |
|              How can I help with your claims today?                  |
|                                                                      |
|  Try asking:                                                         |
|                                                                      |
|  "What ICD-10 codes support chemotherapy?"                           |
|                                                                      |
|  "Show me claims at risk for denial"                                 |
|                                                                      |
|  "Does CPT 90837 require prior auth?"                                |
|                                                                      |
+----------------------------------------------------------------------+
```
