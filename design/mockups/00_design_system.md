# ClaimScrub Design System

## Brand Identity

**Product Name:** ClaimScrub
**Tagline:** Catch claim errors before payers do.

---

## Color Palette

### Primary Colors (Warm)

| Name | Hex | Usage |
|------|-----|-------|
| **Slate 900** | #0f172a | Primary text, headings |
| **Slate 700** | #334155 | Secondary text |
| **Slate 500** | #64748b | Muted text, borders |
| **Slate 100** | #f1f5f9 | Backgrounds, cards |

### Accent Colors (Warm Earth Tones)

| Name | Hex | Usage |
|------|-----|-------|
| **Amber 600** | #d97706 | Primary action, CTA buttons |
| **Amber 100** | #fef3c7 | Warning backgrounds |
| **Terracotta** | #c2410c | Secondary accent |
| **Sage 600** | #16a34a | Success states |
| **Sage 100** | #dcfce7 | Success backgrounds |
| **Rose 600** | #dc2626 | Error states |
| **Rose 100** | #fee2e2 | Error backgrounds |

### Semantic Colors

| State | Background | Border | Text |
|-------|------------|--------|------|
| **Pass** | #dcfce7 | #16a34a | #166534 |
| **Warning** | #fef3c7 | #d97706 | #92400e |
| **Fail** | #fee2e2 | #dc2626 | #991b1b |
| **Info** | #f1f5f9 | #64748b | #334155 |

---

## Typography

### Font Stack

| Type | Font Family | Fallback |
|------|-------------|----------|
| **Headings** | Merriweather (serif) | Georgia, serif |
| **Body** | Inter (sans-serif) | system-ui, sans-serif |
| **Data/Code** | JetBrains Mono | monospace |

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 32px | 700 | 1.2 |
| H2 | 24px | 700 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| H4 | 18px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 400 | 1.4 |
| Data | 14px | 500 | 1.4 |

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Icon gaps |
| md | 16px | Component padding |
| lg | 24px | Section spacing |
| xl | 32px | Page margins |
| 2xl | 48px | Large sections |

---

## Components

### Buttons

```
Primary:    [bg: amber-600, text: white, hover: amber-700]
Secondary:  [bg: slate-100, text: slate-700, hover: slate-200]
Ghost:      [bg: transparent, text: slate-700, hover: slate-100]
Danger:     [bg: rose-600, text: white, hover: rose-700]
```

### Cards

```
Default:    [bg: white, border: slate-200, radius: 8px, shadow: sm]
Elevated:   [bg: white, border: none, radius: 12px, shadow: lg]
Interactive:[bg: white, border: slate-200, radius: 8px, hover: shadow-md]
```

### Status Badges

```
Pass:       [bg: sage-100, text: sage-800, border: sage-300]
Warning:    [bg: amber-100, text: amber-800, border: amber-300]
Fail:       [bg: rose-100, text: rose-800, border: rose-300]
Pending:    [bg: slate-100, text: slate-600, border: slate-300]
```

### Form Inputs

```
Default:    [bg: white, border: slate-300, radius: 6px]
Focus:      [border: amber-500, ring: amber-100]
Error:      [border: rose-500, ring: rose-100]
Disabled:   [bg: slate-50, border: slate-200, text: slate-400]
```

---

## Iconography

- **Style:** Outline, 24px default
- **Library:** Lucide Icons (MIT license)
- **Stroke Width:** 1.5px
- **Key Icons:**
  - Dashboard: LayoutDashboard
  - Claims: FileText
  - Validation: CheckCircle, XCircle, AlertTriangle
  - Provider: User
  - Settings: Settings
  - Chat: MessageSquare
  - Voice: Mic
  - Upload: Upload
  - Search: Search

---

## Layout Grid

| Breakpoint | Width | Columns | Gutter |
|------------|-------|---------|--------|
| Mobile | < 640px | 4 | 16px |
| Tablet | 640-1024px | 8 | 24px |
| Desktop | > 1024px | 12 | 32px |

### Page Structure

```
+----------------------------------------------------------+
|  Top Bar (56px)                                          |
+------------+---------------------------------------------+
|            |                                             |
|  Sidebar   |  Main Content Area                          |
|  (240px)   |  (flex-1, max-width: 1280px)               |
|            |                                             |
|            |                                             |
+------------+---------------------------------------------+
```

---

## Motion

| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover) | 150ms | ease-out |
| Small (expand) | 200ms | ease-in-out |
| Medium (modal) | 300ms | ease-in-out |
| Large (page) | 400ms | ease-in-out |

---

## Accessibility

- **Contrast:** WCAG AA minimum (4.5:1 for text)
- **Focus:** Visible focus rings on all interactive elements
- **Labels:** All form inputs must have labels
- **Keyboard:** Full keyboard navigation support
- **Screen Readers:** ARIA labels where needed
