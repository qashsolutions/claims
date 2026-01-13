# Test 6: Specialty-Specific Validation - Mental Health

## Prompt (Copy/Paste to Claude.ai)

```
Using healthcare connectors, validate this mental health claim: CPT 90837 (60-min psychotherapy), ICD-10 F33.1 (Major depressive disorder, recurrent, moderate), Payer Medicare. Check if diagnosis supports procedure, if prior auth is required, and any documentation requirements.
```

## Expected Result

Claude should:
1. Confirm diagnosis F33.1 supports procedure 90837
2. Note that some commercial payers like United Healthcare require prior authorization for 90837
3. Mention session time documentation requirements (start/end times)

## What We're Testing

- Can Claude handle multi-part validation requests?
- Does it check diagnosis-procedure match?
- Does it identify prior auth requirements?
- Does it mention documentation requirements?

## Actual Result

[ ] PASS
[ ] FAIL

**Response received:**

(Paste Claude's response here)

**Notes:**

