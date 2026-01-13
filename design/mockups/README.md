# ClaimScrub PWA - Mockup Specifications

## Overview

This directory contains detailed mockup specifications for the ClaimScrub healthcare claim scrubber PWA. These specifications are designed for flagship-quality implementation.

---

## Design Principles

1. **Restrained and Sophisticated** - No glows, no emojis, no neon colors
2. **Warm Over Cold** - Earth tones, amber accents, sage for success
3. **Typography Hierarchy** - Serif headings, sans-serif body, monospace for data
4. **Content-Rich** - Educational panels, detailed explanations, actionable insights
5. **Professional Medical Reference** - Not generic AI output

---

## Document Index

| File | Description |
|------|-------------|
| `00_design_system.md` | Colors, typography, spacing, components |
| `01_login_auth.md` | Login, MFA, Epic OAuth flows |
| `02_dashboard.md` | Main dashboard with stats and quick actions |
| `03_claim_entry.md` | Multi-step claim entry form |
| `04_validation_results.md` | Pass/Warn/Fail results with recommendations |
| `05_chat_assistant.md` | AI chat with voice input |
| `06_pricing_plans.md` | Pricing tiers and billing management |
| `07_claims_list.md` | Claims table with filters and bulk actions |
| `08_onboarding.md` | New user onboarding flow |

---

## User Flows

### Flow 1: New User Onboarding

```
Landing Page -> Sign Up -> Email Verification -> Onboarding Step 1 (Welcome)
-> Step 2 (Connect Epic - optional) -> Step 3 (Practice Profile)
-> Step 4 (MFA Setup) -> Step 5 (First Claim) -> Dashboard
```

### Flow 2: Claim Validation (Manual Entry)

```
Dashboard -> New Claim -> Step 1 (Patient Info) -> Step 2 (Provider Info)
-> Step 3 (Service Lines) -> Step 4 (Review) -> Validate
-> Validation Results -> [Fix Issues / Submit / Export]
```

### Flow 3: Claim Validation (837 Upload)

```
Dashboard -> Upload 837 -> Parse & Preview -> Confirm Claims
-> Batch Validate -> Results Summary -> [View Individual / Export All]
```

### Flow 4: Chat-Based Document Lookup

```
Any Page -> Open Chat Panel -> Voice/Text Query
-> AI Response with Actions -> [View Claim / Apply Fix / Navigate]
```

### Flow 5: Denial Appeal (Phase 3 - Future)

```
Dashboard -> Upload 835 EOB -> Identify Denial -> Generate Appeal
-> Review Appeal Letter -> Submit -> Track Status -> Payment Received
-> Success Fee Applied
```

---

## Screen States

Each screen should handle these states:

| State | Description |
|-------|-------------|
| Loading | Skeleton loaders, not spinners |
| Empty | Helpful message with CTA |
| Error | Clear error message with recovery action |
| Success | Confirmation with next steps |
| Partial | Some data loaded, some pending |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640-1024px | Two columns, collapsible sidebar |
| Desktop | > 1024px | Full layout with sidebar |

---

## Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all interactions
- Screen reader compatible (ARIA labels)
- Color contrast ratios >= 4.5:1
- Focus indicators on all interactive elements
- Skip links for main content

---

## Implementation Priority

### Phase 1 (MVP)

1. Login/Auth (01)
2. Dashboard (02)
3. Claim Entry (03)
4. Validation Results (04)
5. Claims List (07)
6. Onboarding (08)

### Phase 2

1. Chat Assistant (05)
2. Pricing/Billing (06)
3. Advanced filters
4. Batch operations

### Phase 3

1. 835 EOB upload
2. Appeal generation
3. Success fee tracking
4. Analytics dashboard

---

## Tech Stack Reference

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Components | Radix UI (headless) |
| Charts | Recharts |
| Icons | Lucide |
| Forms | React Hook Form + Zod |
| State | Zustand or React Query |
| Auth | Supabase Auth |
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) |
| AI | Claude API |

---

## Finalized Pricing

| Tier | Price | Details |
|------|-------|---------|
| Free Trial | $0 | 7 days, 1 claim/day, 10MB max |
| Pay Per Claim | $10 | Per claim up to 10MB |
| Unlimited Monthly | $100/mo | Unlimited claims, all features |
| Unlimited Annual | $70/mo | $840/year, save 30% |
| Success Fee (Phase 3) | 5% | Of recovered amount on appeals |

---

## Next Steps

1. Review mockups with stakeholders
2. Create file structure and architecture doc
3. Set up project scaffolding
4. Implement design system in code
5. Build screens in priority order
