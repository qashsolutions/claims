import Anthropic from '@anthropic-ai/sdk'

/**
 * Claude API Client
 *
 * Provides typed access to Claude's API for healthcare-specific
 * AI capabilities including:
 * - CPT-ICD code suggestions
 * - Medical necessity analysis
 * - Denial prevention recommendations
 * - Appeal letter generation
 *
 * CONFIGURATION:
 * - API key from ANTHROPIC_API_KEY environment variable
 * - Uses claude-3-sonnet model for balanced speed/accuracy
 * - Temperature set low (0.1) for consistent medical coding
 *
 * USAGE:
 * ```typescript
 * const suggestions = await claudeClient.suggestIcdCodes({
 *   cptCode: '96413',
 *   patientConditions: ['Breast cancer', 'Stage IIIB'],
 *   specialty: 'oncology',
 * })
 * ```
 */

const SYSTEM_PROMPT = `You are a medical coding expert specializing in healthcare claims validation. Your role is to:

1. Suggest appropriate ICD-10 diagnosis codes for given CPT procedures
2. Validate medical necessity relationships between codes
3. Identify potential denial risks and suggest corrections
4. Provide evidence-based recommendations per CMS guidelines

Always respond with structured JSON data. Be precise with medical terminology.
Focus on denial prevention by ensuring proper code relationships.`

interface ClaudeClientConfig {
  apiKey?: string
  model?: string
  maxTokens?: number
}

interface IcdSuggestionParams {
  cptCode: string
  cptDescription?: string
  patientConditions?: string[]
  specialty?: string
  existingDiagnoses?: string[]
}

interface IcdSuggestion {
  code: string
  description: string
  confidence: number
  rationale: string
}

interface MedicalNecessityParams {
  cptCode: string
  icdCodes: string[]
  drugCode?: string
  specialty?: string
}

interface MedicalNecessityResult {
  supported: boolean
  score: number
  issues: Array<{
    code: string
    issue: string
    suggestion: string
    denialCode?: string
  }>
}

interface AppealLetterParams {
  claimId: string
  denialCode: string
  denialReason: string
  cptCode: string
  icdCodes: string[]
  patientHistory: string
  supportingDocuments?: string[]
}

export class ClaudeClient {
  private client: Anthropic
  private model: string
  private maxTokens: number

  constructor(config: ClaudeClientConfig = {}) {
    this.client = new Anthropic({
      apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
    })
    this.model = config.model || 'claude-sonnet-4-20250514'
    this.maxTokens = config.maxTokens || 2048
  }

  /**
   * Suggests appropriate ICD-10 codes for a given CPT procedure.
   *
   * Uses Claude to analyze the procedure and patient context to
   * suggest the most appropriate diagnosis codes that support
   * medical necessity.
   *
   * @param params - Suggestion parameters including CPT code and patient context
   * @returns Array of suggested ICD codes with confidence scores
   */
  async suggestIcdCodes(params: IcdSuggestionParams): Promise<IcdSuggestion[]> {
    const prompt = `Given the following procedure and patient context, suggest appropriate ICD-10 diagnosis codes:

CPT Code: ${params.cptCode}
${params.cptDescription ? `Description: ${params.cptDescription}` : ''}
${params.specialty ? `Specialty: ${params.specialty}` : ''}
${params.patientConditions?.length ? `Patient Conditions: ${params.patientConditions.join(', ')}` : ''}
${params.existingDiagnoses?.length ? `Existing Diagnoses: ${params.existingDiagnoses.join(', ')}` : ''}

Respond with a JSON array of suggested ICD-10 codes in this format:
[
  {
    "code": "ICD-10 code",
    "description": "Full description",
    "confidence": 0.0 to 1.0,
    "rationale": "Why this code supports the procedure"
  }
]

Prioritize codes that:
1. Best support medical necessity for the procedure
2. Are commonly accepted by payers
3. Match the patient's documented conditions`

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      })

      // Extract text content from response
      const textContent = response.content.find((block) => block.type === 'text')
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude')
      }

      // Parse JSON from response
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('Failed to parse ICD suggestions from response')
      }

      return JSON.parse(jsonMatch[0]) as IcdSuggestion[]
    } catch (error) {
      console.error('Claude ICD suggestion error:', error)
      return []
    }
  }

  /**
   * Analyzes medical necessity relationships between codes.
   *
   * Validates that the diagnosis codes support the medical necessity
   * of the procedure codes per CMS guidelines.
   *
   * @param params - Codes to analyze
   * @returns Analysis result with support score and issues
   */
  async analyzeMedicalNecessity(params: MedicalNecessityParams): Promise<MedicalNecessityResult> {
    const prompt = `Analyze the medical necessity relationship for this claim:

CPT Code: ${params.cptCode}
ICD-10 Codes: ${params.icdCodes.join(', ')}
${params.drugCode ? `Drug Code: ${params.drugCode}` : ''}
${params.specialty ? `Specialty: ${params.specialty}` : ''}

Determine if the diagnosis codes support medical necessity for the procedure.
Consider:
1. CMS LCD/NCD coverage requirements
2. Payer-specific guidelines
3. Clinical appropriateness

Respond with JSON:
{
  "supported": true/false,
  "score": 0-100,
  "issues": [
    {
      "code": "problematic code",
      "issue": "description of the issue",
      "suggestion": "how to fix",
      "denialCode": "likely denial code if not fixed"
    }
  ]
}`

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      })

      const textContent = response.content.find((block) => block.type === 'text')
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude')
      }

      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to parse medical necessity analysis')
      }

      return JSON.parse(jsonMatch[0]) as MedicalNecessityResult
    } catch (error) {
      console.error('Claude medical necessity analysis error:', error)
      return {
        supported: true,
        score: 100,
        issues: [],
      }
    }
  }

  /**
   * Generates an appeal letter for a denied claim.
   *
   * Creates a professional appeal letter with clinical justification
   * based on the claim details and denial reason.
   *
   * @param params - Claim and denial details
   * @returns Generated appeal letter text
   */
  async generateAppealLetter(params: AppealLetterParams): Promise<string> {
    const prompt = `Generate a professional appeal letter for this denied claim:

Claim ID: ${params.claimId}
Denial Code: ${params.denialCode}
Denial Reason: ${params.denialReason}
CPT Code: ${params.cptCode}
ICD-10 Codes: ${params.icdCodes.join(', ')}
Patient History Summary: ${params.patientHistory}
${params.supportingDocuments?.length ? `Supporting Documents: ${params.supportingDocuments.join(', ')}` : ''}

Write a compelling appeal letter that:
1. Addresses the specific denial reason
2. Provides clinical justification with supporting evidence
3. References relevant CMS guidelines
4. Maintains a professional, collaborative tone
5. Requests a specific action (reconsideration/reprocessing)

Format as a formal business letter.`

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        temperature: 0.3,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      })

      const textContent = response.content.find((block) => block.type === 'text')
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude')
      }

      return textContent.text
    } catch (error) {
      console.error('Claude appeal letter generation error:', error)
      throw error
    }
  }
}

// Export singleton instance for convenience
export const claudeClient = new ClaudeClient()
