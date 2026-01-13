import { useFlow } from '../FlowProvider'
import { KeyboardHint } from '../KeyboardHint'
import { ConfirmButton } from '../ConfirmButton'
import { CheckCircle, Clock, AlertTriangle, Shield } from 'lucide-react'

/**
 * Step 4: Authorization Check
 * Auto-detects prior auth requirements and finds existing approvals
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

  // Mock auth data - in production, from Epic lookup
  const existingAuth = context.authorization || {
    number: 'PA-2026-0112-7832',
    status: 'approved',
    validFrom: '2026-01-01',
    validTo: '2026-03-31',
    approvedServices: ['96413', '96415', 'J9271'],
  }

  const authRequired = context.authRequired
  const hasValidAuth = existingAuth && existingAuth.status === 'approved'
  const procedureCovered = existingAuth?.approvedServices?.includes(
    context.procedure?.cptCode || ''
  )

  const handleUseAuth = () => {
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

              <div className="mt-4">
                <p className="text-body-sm font-medium text-success-700">Approved Services</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {existingAuth.approvedServices?.map((code: string) => (
                    <span
                      key={code}
                      className={`code rounded-md px-2 py-1 text-sm ${
                        code === context.procedure?.cptCode ||
                        code === context.procedure?.drugCode
                          ? 'bg-success-200 font-semibold text-success-800'
                          : 'bg-success-100 text-success-700'
                      }`}
                    >
                      {code}
                      {(code === context.procedure?.cptCode ||
                        code === context.procedure?.drugCode) && ' ✓'}
                    </span>
                  ))}
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
