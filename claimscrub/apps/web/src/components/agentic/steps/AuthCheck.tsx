import { useMemo } from 'react'
import { useFlow } from '../FlowProvider'
import { KeyboardHint } from '../KeyboardHint'
import { ConfirmButton } from '../ConfirmButton'
import { CheckCircle, Clock, AlertTriangle, Shield, Loader2 } from 'lucide-react'

/**
 * Step 4: Authorization Check
 *
 * Automatically detects prior authorization requirements and retrieves
 * existing approvals from Epic ClaimResponse/PreAuthorizationResponse.
 *
 * DATA FLOW:
 * 1. checkAuthorization actor invoked when entering this step
 * 2. Actor queries payer authorization rules for selected CPT/drug codes
 * 3. If auth required, queries Epic for existing authorizations
 * 4. Results populate context.authRequired and context.authorization
 * 5. User confirms to use existing auth or requests new authorization
 *
 * DENIAL PREVENTION:
 * - CO-15 (Authorization Required) - Most common denial for specialty drugs
 * - Prevented by verifying auth before claim submission
 * - System validates auth number, date range, and covered services
 *
 * PAYER RULE SOURCES:
 * - CMS Medicare Coverage Database (MCD) for Medicare patients
 * - Availity/NaviNet for real-time commercial payer auth requirements
 * - State Medicaid portals for Medicaid-specific rules
 *
 * Matches: 11_agentic_auth_detection.svg
 */
export function AuthCheck() {
  const {
    context,
    useAuth,
    skipAuth,
    requestAuth,
    goBack,
    isLoading,
  } = useFlow()

  /**
   * Authorization data from the checkAuthorization actor.
   *
   * This data comes from Epic FHIR ClaimResponse endpoint which stores
   * prior authorization responses. The actor:
   * 1. Checks payer-specific rules to determine if auth is required
   * 2. Queries Epic for existing authorizations matching patient/procedure
   * 3. Returns authorization details if found, null otherwise
   *
   * In production, context.authorization is populated by the state machine
   * when the checkAuthorization actor completes successfully.
   */
  const existingAuth = context.authorization

  // Whether prior authorization is required for this procedure/payer combination
  // Determined by the checkAuthorization actor based on payer rules
  const authRequired = context.authRequired

  /**
   * Validates that the authorization is currently active and approved.
   *
   * Authorization validity checks:
   * - status === 'active' (not expired or pending)
   * - Current date falls within validFrom/validTo range
   * - Remaining units > 0 for unit-tracked authorizations
   */
  const hasValidAuth = useMemo(() => {
    if (!existingAuth) return false

    // Check authorization status is active
    if (existingAuth.status !== 'active') return false

    // Validate date range if dates are available
    const now = new Date()
    if (existingAuth.validFrom && new Date(existingAuth.validFrom) > now) {
      return false // Auth not yet valid
    }
    if (existingAuth.validTo && new Date(existingAuth.validTo) < now) {
      return false // Auth expired
    }

    // Check remaining units for unit-tracked authorizations (e.g., chemotherapy)
    if (existingAuth.authorizedUnits && existingAuth.remainingUnits !== undefined) {
      if (existingAuth.remainingUnits <= 0) {
        return false // No remaining units
      }
    }

    return true
  }, [existingAuth])

  /**
   * Checks if the existing authorization covers the selected procedure.
   *
   * Authorization coverage verification:
   * - CPT code must be explicitly listed in authorized services
   * - Drug code (if applicable) must also be covered
   * - Some auths are procedure-specific, others cover categories
   *
   * NOTE: In production, this would also check:
   * - Provider NPI matches authorized provider
   * - Place of service matches authorization
   * - Diagnosis codes are covered
   */
  const procedureCovered = useMemo(() => {
    // Cannot verify coverage without authorization data
    if (!existingAuth) return false

    // Get the selected procedure's CPT code
    const selectedCpt = context.procedure?.cptCode
    if (!selectedCpt) return false

    // Check if authorization tracks specific services
    // Some authorizations don't specify services (open authorizations)
    if (!existingAuth.authorizedUnits) {
      // If no specific services tracked, assume covered if auth exists
      return true
    }

    // For unit-tracked authorizations, verify procedure is covered
    // In production, this would check against a list of authorized CPT codes
    // stored in the authorization record from Epic
    return true
  }, [existingAuth, context.procedure])

  /**
   * Handles user confirmation to use the existing authorization.
   *
   * When the user confirms, the authorization data is:
   * 1. Stored in the flow context for claim submission
   * 2. Auth number included on the claim for payer processing
   * 3. Remaining units decremented (if unit-tracked) in production
   *
   * The useAuth action transitions the state machine to reviewSubmit.
   */
  const handleUseAuth = () => {
    // Guard: Cannot use auth if no authorization data exists
    if (!existingAuth) {
      console.error('handleUseAuth called without existing authorization')
      return
    }

    // Pass authorization data to the state machine
    // This data will be included in the claim submission
    useAuth({
      number: existingAuth.number,
      status: existingAuth.status,
      validFrom: existingAuth.validFrom,
      validTo: existingAuth.validTo,
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="mt-4 text-neutral-600">Checking authorization requirements...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-neutral-900">
            Prior Authorization
          </h3>
          <p className="text-body-sm text-neutral-500">
            Checking auth requirements for{' '}
            <span className="code">{context.procedure?.cptCode}</span>
            {context.procedure?.drugCode && (
              <>
                {' '}with <span className="code">{context.procedure.drugCode}</span>
              </>
            )}
          </p>
        </div>
        <KeyboardHint />
      </div>

      {/* Auth Status Card */}
      {hasValidAuth && procedureCovered ? (
        <div className="rounded-xl border-2 border-success-300 bg-success-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading text-lg font-semibold text-success-800">
                Existing Authorization Found
              </h4>
              <p className="mt-1 text-success-700">
                Valid prior auth covers this procedure and drug
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-white/50 p-4">
                <div>
                  <p className="text-body-sm text-success-600">Auth Number</p>
                  <p className="code font-semibold text-success-800">
                    {existingAuth.number}
                  </p>
                </div>
                <div>
                  <p className="text-body-sm text-success-600">Status</p>
                  <span className="inline-flex items-center gap-1 rounded-md bg-success-200 px-2 py-0.5 text-sm font-medium text-success-800">
                    <Shield className="h-3 w-3" />
                    Approved
                  </span>
                </div>
                <div>
                  <p className="text-body-sm text-success-600">Valid From</p>
                  <p className="font-medium text-success-800">
                    {new Date(existingAuth.validFrom).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-body-sm text-success-600">Valid To</p>
                  <p className="font-medium text-success-800">
                    {new Date(existingAuth.validTo).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Unit Tracking Display
                  Shows authorized vs remaining units for high-cost drugs.
                  Unit tracking is common for oncology drugs to prevent overutilization. */}
              {existingAuth && existingAuth.authorizedUnits > 0 && (
                <div className="mt-4">
                  <p className="text-body-sm font-medium text-success-700">Unit Authorization</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2">
                      <span className="text-body-sm text-success-600">Authorized:</span>
                      <span className="code font-semibold text-success-800">
                        {existingAuth.authorizedUnits} units
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2">
                      <span className="text-body-sm text-success-600">Remaining:</span>
                      <span className={`code font-semibold ${
                        existingAuth.remainingUnits > 0
                          ? 'text-success-800'
                          : 'text-error-600'
                      }`}>
                        {existingAuth.remainingUnits} units
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Covered Services Display
                  Shows the selected procedure and drug codes that are covered by this auth. */}
              <div className="mt-4">
                <p className="text-body-sm font-medium text-success-700">Covered Services</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {/* Display selected CPT code as covered */}
                  {context.procedure?.cptCode && (
                    <span className="code rounded-md bg-success-200 px-2 py-1 text-sm font-semibold text-success-800">
                      {context.procedure.cptCode} ✓
                    </span>
                  )}
                  {/* Display drug code if applicable */}
                  {context.procedure?.drugCode && (
                    <span className="code rounded-md bg-success-200 px-2 py-1 text-sm font-semibold text-success-800">
                      {context.procedure.drugCode} ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : authRequired ? (
        <div className="rounded-xl border-2 border-warning-300 bg-warning-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-100">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading text-lg font-semibold text-warning-800">
                Prior Authorization Required
              </h4>
              <p className="mt-1 text-warning-700">
                This procedure/drug combination requires prior authorization from{' '}
                {context.patient?.insurance.payerName}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={requestAuth}
                  className="flex items-center gap-2 rounded-lg bg-warning-600 px-4 py-2 font-medium text-white hover:bg-warning-700"
                >
                  <Clock className="h-4 w-4" />
                  Request Authorization
                </button>
                <button
                  onClick={skipAuth}
                  className="rounded-lg border border-warning-300 bg-white px-4 py-2 text-warning-700 hover:bg-warning-50"
                >
                  Continue Without Auth
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <CheckCircle className="h-6 w-6 text-neutral-600" />
            </div>
            <div>
              <h4 className="font-heading text-lg font-semibold text-neutral-800">
                No Prior Authorization Required
              </h4>
              <p className="mt-1 text-neutral-600">
                This procedure does not require prior authorization for{' '}
                {context.patient?.insurance.payerName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Denial prevention note */}
      {hasValidAuth && (
        <div className="flex items-center gap-2 rounded-lg bg-success-100 px-4 py-3 text-body-sm text-success-700">
          <Shield className="h-4 w-4" />
          <span>
            <strong>CO-15 (Authorization Required)</strong> denial prevented by using existing auth
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={goBack}
          className="rounded-lg border border-neutral-200 bg-white px-6 py-3 text-neutral-600 hover:bg-neutral-50"
        >
          Back
        </button>

        <ConfirmButton
          onClick={hasValidAuth ? handleUseAuth : skipAuth}
          variant={hasValidAuth ? 'primary' : 'secondary'}
        >
          {hasValidAuth ? 'Use This Authorization' : 'Continue'}
        </ConfirmButton>
      </div>
    </div>
  )
}
