import { useMemo } from 'react'
import { CheckCircle, XCircle, AlertTriangle, FileText, Download, Edit } from 'lucide-react'
import { Button, Card, Tabs, TabsList, TabsTrigger, TabsContent } from '@claimscrub/ui'
import { cn } from '@/lib/utils'
import { ValidationCheck } from './ValidationCheck'
import { CoveragePanel } from './CoveragePanel'
import type { Validation, Claim } from '@claimscrub/shared'

/**
 * ValidationResult Component
 *
 * Displays comprehensive validation results with actionable recommendations.
 * Follows design mockup: 04_validation_results.md
 *
 * Features:
 * - Status header with score (Pass/Warning/Fail)
 * - Individual validation checks with expandable details
 * - Coverage tab showing NCD/LCD information
 * - Action buttons (Submit, Export, Edit)
 *
 * Status Colors per Design System:
 * - Pass: sage-100 bg, sage-600 icon, sage-300 border
 * - Warning: amber-100 bg, amber-600 icon, amber-300 border
 * - Fail: rose-100 bg, rose-600 icon, rose-300 border
 *
 * @example
 * ```tsx
 * <ValidationResult
 *   claim={claim}
 *   validations={validations}
 *   onSubmit={handleSubmit}
 *   onExport={handleExport}
 *   onEdit={handleEdit}
 * />
 * ```
 */

interface ValidationResultProps {
  claim: Claim
  validations: Validation[]
  onSubmit?: () => void
  onExport?: () => void
  onEdit?: () => void
  onFixIssues?: () => void
}

export function ValidationResult({
  claim,
  validations,
  onSubmit,
  onExport,
  onEdit,
  onFixIssues,
}: ValidationResultProps) {
  // Calculate overall status based on validations
  const { status, score, primaryRisk } = useMemo(() => {
    const passCount = validations.filter((v) => v.status === 'PASS').length
    const warnCount = validations.filter((v) => v.status === 'WARN').length
    const failCount = validations.filter((v) => v.status === 'FAIL').length
    const total = validations.length

    // Score calculation: Pass=100%, Warn=50%, Fail=0%
    const score = total > 0
      ? Math.round(((passCount * 100) + (warnCount * 50)) / total)
      : 0

    // Determine overall status
    let status: 'pass' | 'warning' | 'fail' = 'pass'
    if (failCount > 0) status = 'fail'
    else if (warnCount > 0) status = 'warning'

    // Find primary risk (first fail or warn)
    const failedValidation = validations.find((v) => v.status === 'FAIL')
    const warnValidation = validations.find((v) => v.status === 'WARN')
    const primaryRisk = failedValidation?.denialCode || warnValidation?.denialCode || null

    return { status, score, primaryRisk }
  }, [validations])

  // Status-specific styles per design system
  const statusStyles = {
    pass: {
      bg: 'bg-success-50',
      border: 'border-success-300',
      icon: <CheckCircle className="h-12 w-12 text-success-600" />,
      label: 'PASS',
      labelColor: 'text-success-800',
      scoreColor: 'text-success-600',
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-300',
      icon: <AlertTriangle className="h-12 w-12 text-warning-600" />,
      label: 'WARNING',
      labelColor: 'text-warning-800',
      scoreColor: 'text-warning-600',
    },
    fail: {
      bg: 'bg-error-50',
      border: 'border-error-300',
      icon: <XCircle className="h-12 w-12 text-error-600" />,
      label: 'FAIL',
      labelColor: 'text-error-800',
      scoreColor: 'text-error-600',
    },
  }

  const styles = statusStyles[status]

  // Score label per design system ranges
  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Review Recommended'
    if (score >= 50) return 'High Risk'
    return 'Critical Issues'
  }

  return (
    <div className="space-y-6">
      {/* Status Header Card */}
      <Card className={cn('border-2', styles.border, styles.bg)}>
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Status Icon and Score */}
            <div className="flex flex-col items-center text-center min-w-[120px]">
              {styles.icon}
              <span className={cn('mt-2 text-xl font-bold', styles.labelColor)}>
                {styles.label}
              </span>
              <span className={cn('text-2xl font-bold', styles.scoreColor)}>
                Score: {score}/100
              </span>
              <span className="text-sm text-neutral-600">{getScoreLabel(score)}</span>
            </div>

            {/* Claim Details */}
            <div className="flex-1">
              <h2 className="font-heading text-xl font-semibold text-neutral-900">
                {claim.patientName}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Claim ID: <span className="font-mono">{claim.claimNumber}</span>
              </p>
              <p className="text-sm text-neutral-600">
                Validated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>

              {/* Primary Risk if warning/fail */}
              {primaryRisk && (
                <div className={cn(
                  'mt-3 px-3 py-2 rounded-md',
                  status === 'fail' ? 'bg-error-100' : 'bg-warning-100'
                )}>
                  <span className={cn(
                    'text-sm font-medium',
                    status === 'fail' ? 'text-error-800' : 'text-warning-800'
                  )}>
                    Risk: {primaryRisk}
                  </span>
                </div>
              )}

              {/* Estimated Reimbursement for passing claims */}
              {status === 'pass' && (
                <p className="mt-3 text-lg font-semibold text-success-700">
                  Estimated Reimbursement: ${claim.totalCharge.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-3">
            {status === 'pass' ? (
              <>
                <Button onClick={onSubmit}>
                  <FileText className="h-4 w-4 mr-2" />
                  Submit to Clearinghouse
                </Button>
                <Button variant="secondary" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="secondary" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Claim
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onFixIssues}>
                  Fix Issues
                </Button>
                {status === 'warning' && (
                  <Button variant="secondary" onClick={onSubmit}>
                    Submit Anyway
                  </Button>
                )}
                <Button variant="secondary" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="secondary" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Claim
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="validation">
        <TabsList variant="underline">
          <TabsTrigger value="validation" variant="underline">Validation</TabsTrigger>
          <TabsTrigger value="coverage" variant="underline">Coverage</TabsTrigger>
          <TabsTrigger value="documentation" variant="underline">Documentation</TabsTrigger>
          <TabsTrigger value="history" variant="underline">History</TabsTrigger>
        </TabsList>

        {/* Validation Checks Tab */}
        <TabsContent value="validation">
          <Card>
            <div className="p-4">
              <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
                Validation Checks
              </h3>
              <div className="space-y-3">
                {validations.map((validation) => (
                  <ValidationCheck
                    key={validation.id}
                    validation={validation}
                  />
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Coverage Tab */}
        <TabsContent value="coverage">
          <CoveragePanel claim={claim} />
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation">
          <Card>
            <div className="p-6 text-center text-neutral-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
              <p>Documentation requirements will be displayed here.</p>
              <p className="text-sm mt-2">
                Based on the selected procedures and payer requirements.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <div className="p-6 text-center text-neutral-500">
              <p>Validation history for this claim will be displayed here.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
