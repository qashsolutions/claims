import type { Claim, ValidationResult, ValidationCheck, ValidationStatus } from '@claimscrub/shared'

export interface RuleContext {
  claim: Claim
  now?: Date
}

export interface RuleResult {
  status: ValidationStatus
  message: string
  suggestion?: string
  denialCode?: string
  metadata?: Record<string, unknown>
}

export interface ValidationRule {
  id: string
  name: string
  checkType: ValidationCheck
  description: string
  validate: (context: RuleContext) => Promise<RuleResult> | RuleResult
}

export class RuleEngine {
  private rules: Map<string, ValidationRule> = new Map()

  register(rule: ValidationRule): void {
    this.rules.set(rule.id, rule)
  }

  registerMany(rules: ValidationRule[]): void {
    for (const rule of rules) {
      this.register(rule)
    }
  }

  getRule(id: string): ValidationRule | undefined {
    return this.rules.get(id)
  }

  getRulesByCheck(checkType: ValidationCheck): ValidationRule[] {
    return Array.from(this.rules.values()).filter((rule) => rule.checkType === checkType)
  }

  async validateClaim(
    claim: Claim,
    checks?: ValidationCheck[]
  ): Promise<ValidationResult[]> {
    const context: RuleContext = {
      claim,
      now: new Date(),
    }

    const rulesToRun = checks
      ? Array.from(this.rules.values()).filter((r) => checks.includes(r.checkType))
      : Array.from(this.rules.values())

    const results: ValidationResult[] = []

    for (const rule of rulesToRun) {
      try {
        const result = await rule.validate(context)
        results.push({
          id: crypto.randomUUID(),
          checkType: rule.checkType,
          status: result.status,
          message: result.message,
          suggestion: result.suggestion,
          denialCode: result.denialCode,
          metadata: result.metadata,
        })
      } catch (error) {
        results.push({
          id: crypto.randomUUID(),
          checkType: rule.checkType,
          status: 'FAIL',
          message: `Rule ${rule.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        })
      }
    }

    return results
  }

  calculateScore(results: ValidationResult[]): number {
    if (results.length === 0) return 100

    const weights = {
      PASS: 1,
      WARNING: 0.7,
      FAIL: 0,
    }

    const total = results.reduce((sum, r) => sum + weights[r.status], 0)
    return Math.round((total / results.length) * 100)
  }
}
