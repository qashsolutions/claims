# Test 5: CPT-ICD Mismatch Detection - Should FAIL

## Prompt (Copy/Paste to Claude.ai)

```
Validate this claim: CPT 96413 (chemotherapy infusion) with ICD-10 J18.9 (pneumonia). Is this valid?
```

## Expected Result

Claude should return FAIL. Pneumonia (J18.9) does not support chemotherapy infusion (96413). The diagnosis must be a malignant neoplasm (C-codes) to justify chemotherapy. This tests whether Claude can detect mismatches.

## What We're Testing

- Can Claude detect invalid CPT-ICD pairings?
- Does it correctly identify that pneumonia doesn't justify chemo?
- Does it suggest correct diagnosis codes (C-codes)?

## Actual Result

[ ] PASS (Claude correctly identified the mismatch)
[ ] FAIL (Claude incorrectly approved or missed the mismatch)

**Response received:**

(Paste Claude's response here)

**Notes:**

