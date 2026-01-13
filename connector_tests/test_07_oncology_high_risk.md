# Test 7: Oncology High-Risk Claim

## Prompt (Copy/Paste to Claude.ai)

```
Validate this oncology claim using ICD-10 and CMS connectors: CPT 96413 (Chemotherapy IV infusion, first hour), Drug J9271 (Pembrolizumab), ICD-10 C50.911 (Breast cancer), No modifiers included. What's missing? What denial codes are we at risk for?
```

## Expected Result

Claude should:
1. Return WARNING status (not outright FAIL, since diagnosis matches)
2. Indicate that prior authorization is typically required for Pembrolizumab
3. Suggest adding JW modifier if there was drug wastage
4. Flag CO-15 (missing auth) denial risk
5. Potentially flag CO-4 (modifier) denial risk

## What We're Testing

- Can Claude identify multiple issues in one claim?
- Does it understand oncology-specific requirements (J-codes, modifiers)?
- Does it correctly identify denial risk codes?
- Does it provide actionable fix suggestions?

## Actual Result

[ ] PASS
[ ] FAIL

**Response received:**

(Paste Claude's response here)

**Notes:**

