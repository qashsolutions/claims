# Screen 01: Login & Authentication

## Overview

**Purpose:** Authenticate providers and billing staff via Epic OAuth or email/TOTP
**URL:** `/login`

---

## Wireframe

```
+------------------------------------------------------------------+
|                                                                  |
|                        [ClaimScrub Logo]                         |
|                                                                  |
|                   Catch claim errors before                      |
|                        payers do.                                |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|     +------------------------------------------------------+     |
|     |                                                      |     |
|     |     Welcome Back                                     |     |
|     |                                                      |     |
|     |     Sign in to continue to your dashboard            |     |
|     |                                                      |     |
|     |     +------------------------------------------+     |     |
|     |     |                                          |     |     |
|     |     |     [Epic Logo]                          |     |     |
|     |     |                                          |     |     |
|     |     |     Continue with Epic                   |     |     |
|     |     |                                          |     |     |
|     |     +------------------------------------------+     |     |
|     |                                                      |     |
|     |     -------------------- or --------------------     |     |
|     |                                                      |     |
|     |     Email                                            |     |
|     |     +------------------------------------------+     |     |
|     |     | provider@clinic.com                      |     |     |
|     |     +------------------------------------------+     |     |
|     |                                                      |     |
|     |     Password                                         |     |
|     |     +------------------------------------------+     |     |
|     |     | ********                                 |     |     |
|     |     +------------------------------------------+     |     |
|     |                                                      |     |
|     |     +------------------------------------------+     |     |
|     |     |            Sign In                       |     |     |
|     |     +------------------------------------------+     |     |
|     |                                                      |     |
|     |     Forgot password?                                 |     |
|     |                                                      |     |
|     |     ------------------------------------------------ |     |
|     |                                                      |     |
|     |     New to ClaimScrub?  Create an account            |     |
|     |                                                      |     |
|     +------------------------------------------------------+     |
|                                                                  |
+------------------------------------------------------------------+
|     HIPAA Compliant  |  SOC 2 Type II  |  256-bit Encryption    |
+------------------------------------------------------------------+
```

---

## Screen: MFA Verification

```
+------------------------------------------------------------------+
|                                                                  |
|                        [ClaimScrub Logo]                         |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|     +------------------------------------------------------+     |
|     |                                                      |     |
|     |     Two-Factor Authentication                        |     |
|     |                                                      |     |
|     |     Enter the 6-digit code from your                 |     |
|     |     authenticator app                                |     |
|     |                                                      |     |
|     |     +----+ +----+ +----+ +----+ +----+ +----+        |     |
|     |     |    | |    | |    | |    | |    | |    |        |     |
|     |     +----+ +----+ +----+ +----+ +----+ +----+        |     |
|     |                                                      |     |
|     |     +------------------------------------------+     |     |
|     |     |            Verify                        |     |     |
|     |     +------------------------------------------+     |     |
|     |                                                      |     |
|     |     Didn't receive a code?  Resend                   |     |
|     |                                                      |     |
|     |     Use a backup code instead                        |     |
|     |                                                      |     |
|     +------------------------------------------------------+     |
|                                                                  |
+------------------------------------------------------------------+
```

---

## Screen: Epic Organization Selection

```
+------------------------------------------------------------------+
|                                                                  |
|                        [ClaimScrub Logo]                         |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|     +------------------------------------------------------+     |
|     |                                                      |     |
|     |     Select Your Organization                         |     |
|     |                                                      |     |
|     |     +------------------------------------------+     |     |
|     |     | Search organizations...              [Q] |     |     |
|     |     +------------------------------------------+     |     |
|     |                                                      |     |
|     |     Recent                                           |     |
|     |                                                      |     |
|     |     +------------------------------------------+     |     |
|     |     | [H]  Memorial Health System             > |     |     |
|     |     +------------------------------------------+     |     |
|     |     | [H]  City Medical Center                > |     |     |
|     |     +------------------------------------------+     |     |
|     |                                                      |     |
|     |     All Organizations                                |     |
|     |                                                      |     |
|     |     +------------------------------------------+     |     |
|     |     | [H]  Atlantic Healthcare Partners       > |     |     |
|     |     +------------------------------------------+     |     |
|     |     | [H]  Bay Area Medical Group             > |     |     |
|     |     +------------------------------------------+     |     |
|     |     | [H]  Central Valley Health              > |     |     |
|     |     +------------------------------------------+     |     |
|     |                                                      |     |
|     +------------------------------------------------------+     |
|                                                                  |
+------------------------------------------------------------------+
```

---

## Specifications

### Components

| Element | Spec |
|---------|------|
| Logo | SVG, 48px height |
| Card | 480px max-width, 32px padding, 12px radius |
| Epic Button | Full width, 48px height, Epic blue (#1D4ED8) |
| Form Inputs | 48px height, 16px padding |
| Submit Button | Full width, 48px height, Amber 600 |
| Trust Badges | 14px, Slate 500, centered row |

### Interactions

| Action | Result |
|--------|--------|
| Click "Continue with Epic" | Redirect to Epic OAuth flow |
| Submit email/password | Validate, then show MFA screen |
| Enter valid MFA code | Redirect to Dashboard |
| Invalid MFA code | Shake animation, error message |

### Error States

| Error | Message |
|-------|---------|
| Invalid credentials | "Invalid email or password. Please try again." |
| Account locked | "Account locked. Please contact support." |
| MFA invalid | "Invalid code. Please try again." |
| Epic OAuth failed | "Unable to connect to Epic. Please try again." |

---

## User Flows

### Flow 1: Epic OAuth (Primary)

```
Login Page -> Click "Continue with Epic" -> Epic Org Selection
-> Epic Login -> Epic MFA (if enabled) -> Redirect to Dashboard
```

### Flow 2: Email/Password + TOTP

```
Login Page -> Enter email/password -> MFA Screen
-> Enter TOTP code -> Redirect to Dashboard
```

### Flow 3: New User Registration

```
Login Page -> Click "Create an account" -> Registration Form
-> Email verification -> Setup MFA -> Redirect to Onboarding
```
