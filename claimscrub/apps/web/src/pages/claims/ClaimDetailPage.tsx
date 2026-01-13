import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Edit,
  Send,
  ArrowLeft,
  Clock,
  User,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react'
import { Button, Card, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@claimscrub/ui'
import { cn } from '@/lib/utils'
import {
  ValidationCheck,
  DenialRiskBadge,
  SuggestedFix,
  CoveragePanel
} from '@/components/validation'

/**
 * ClaimDetailPage - Comprehensive validation results view
 *
 * Displays validation results for a single claim with:
 * - Status header (Pass/Warning/Fail)
 * - Score and risk assessment
 * - Tabbed content: Validation, Coverage, Documentation, History
 * - Action buttons for submit, export, edit
 *
 * Per design mockup: 04_validation_results.md
 */

type ValidationStatus = 'pass' | 'warning' | 'fail'

interface ClaimDetail {
  id: string
  claimNumber: string
  patientName: string
  dateOfService: string
  validatedAt: string
  status: ValidationStatus
  score: number
  estimatedReimbursement: number
  denialRisk?: string
  providerName: string
  providerNpi: string
  payerName: string
  cptCodes: string[]
  icdCodes: string[]
  priorAuthNumber?: string
  validations: {
    id: string
    checkType: string
    status: ValidationStatus
    message: string
    suggestion?: string
    denialCode?: string
    details?: string
  }[]
}

// Status configuration per design spec
const statusConfig = {
  pass: {
    bg: 'bg-success-100',
    border: 'border-success-300',
    icon: CheckCircle,
    iconColor: 'text-success-600',
    label: 'PASS',
    labelColor: 'text-success-700',
  },
  warning: {
    bg: 'bg-warning-100',
    border: 'border-warning-300',
    icon: AlertTriangle,
    iconColor: 'text-warning-600',
    label: 'WARNING',
    labelColor: 'text-warning-700',
  },
  fail: {
    bg: 'bg-error-100',
    border: 'border-error-300',
    icon: XCircle,
    iconColor: 'text-error-600',
    label: 'FAIL',
    labelColor: 'text-error-700',
  },
}

// Score ranges per design spec
function getScoreColor(score: number): string {
  if (score >= 90) return 'text-success-600'
  if (score >= 70) return 'text-warning-600'
  if (score >= 50) return 'text-orange-600'
  return 'text-error-600'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Review Recommended'
  if (score >= 50) return 'High Risk'
  return 'Critical Issues'
}

export function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('validation')

  // In production, this would come from tRPC query
  // trpc.claims.getById.useQuery({ id })
  const claim: ClaimDetail = {
    id: id || '',
    claimNumber: 'CLM-2026-0112-4521',
    patientName: 'Maria Santos',
    dateOfService: '2026-01-12',
    validatedAt: '2026-01-12T14:34:00Z',
    status: 'pass',
    score: 98,
    estimatedReimbursement: 9450.00,
    providerName: 'Dr. Sarah Chen',
    providerNpi: '1234567893',
    payerName: 'United Healthcare',
    cptCodes: ['96413'],
    icdCodes: ['C50.911'],
    priorAuthNumber: 'AUTH-2026-0112-4521',
    validations: [
      {
        id: '1',
        checkType: 'CPT-ICD Match',
        status: 'pass',
        message: 'C50.911 (Breast cancer) supports CPT 96413 (Chemo IV)',
      },
      {
        id: '2',
        checkType: 'Provider Verification',
        status: 'pass',
        message: 'NPI 1234567893 is active. Specialty: Oncology',
      },
      {
        id: '3',
        checkType: 'Modifier Validation',
        status: 'pass',
        message: 'JW modifier correctly applied for drug wastage',
      },
      {
        id: '4',
        checkType: 'Prior Authorization',
        status: 'pass',
        message: 'Auth AUTH-2026-0112-4521 verified and active',
      },
      {
        id: '5',
        checkType: 'Data Completeness',
        status: 'pass',
        message: 'All required fields present',
      },
      {
        id: '6',
        checkType: 'Timely Filing',
        status: 'pass',
        message: 'DOS 01/12/2026 - 89 days remaining',
      },
    ],
  }

  const config = statusConfig[claim.status]
  const StatusIcon = config.icon

  const handleSubmit = () => {
    // In production: open submission modal
    console.log('Submit to clearinghouse')
  }

  const handleExport = () => {
    // In production: generate and download PDF
    console.log('Export PDF')
  }

  const handleEdit = () => {
    navigate(`/claims/${id}/edit`)
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/claims')}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Claims
      </button>

      {/* Status Header Card */}
      <Card className={cn('p-6', config.bg, config.border, 'border-2')}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <div className={cn(
              'flex h-20 w-20 items-center justify-center rounded-xl',
              claim.status === 'pass' && 'bg-success-200',
              claim.status === 'warning' && 'bg-warning-200',
              claim.status === 'fail' && 'bg-error-200'
            )}>
              <StatusIcon className={cn('h-10 w-10', config.iconColor)} />
            </div>
            <div>
              <p className={cn('text-2xl font-bold', config.labelColor)}>
                {config.label}
              </p>
              <p className={cn('text-lg font-semibold', getScoreColor(claim.score))}>
                Score: {claim.score}/100
              </p>
              <p className="text-sm text-neutral-600">
                {getScoreLabel(claim.score)}
              </p>
            </div>
          </div>

          {/* Claim Info */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Patient</p>
              <p className="font-semibold text-neutral-900">{claim.patientName}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Claim ID</p>
              <p className="font-mono text-sm text-neutral-900">{claim.claimNumber}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Validated</p>
              <p className="text-neutral-900">
                {new Date(claim.validatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Est. Reimbursement</p>
              <p className="font-semibold text-neutral-900">
                ${claim.estimatedReimbursement.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Denial Risk Badge (if applicable) */}
          {claim.denialRisk && (
            <div className="flex-shrink-0">
              <DenialRiskBadge code={claim.denialRisk} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-neutral-200/50">
          {claim.status === 'pass' && (
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Submit to Clearinghouse
            </Button>
          )}
          {claim.status === 'warning' && (
            <>
              <Button onClick={() => {}}>
                Fix Issues
              </Button>
              <Button variant="secondary" onClick={handleSubmit}>
                Submit Anyway
              </Button>
            </>
          )}
          {claim.status === 'fail' && (
            <Button onClick={() => {}}>
              Fix Issues
            </Button>
          )}
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="ghost" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Claim
          </Button>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Validation Tab */}
        <TabsContent value="validation">
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
              Validation Checks
            </h3>
            <div className="space-y-3">
              {claim.validations.map((validation) => (
                <ValidationCheck
                  key={validation.id}
                  checkType={validation.checkType}
                  status={validation.status}
                  message={validation.message}
                  suggestion={validation.suggestion}
                  denialCode={validation.denialCode}
                  details={validation.details}
                />
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Coverage Tab */}
        <TabsContent value="coverage">
          <CoveragePanel
            cptCode={claim.cptCodes[0]}
            icdCode={claim.icdCodes[0]}
            payerName={claim.payerName}
          />
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation">
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
              Documentation Requirements
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-neutral-50">
                <FileText className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-900">Required for CPT 96413</p>
                  <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                    <li>- Pathology report confirming malignancy</li>
                    <li>- Treatment plan from oncologist</li>
                    <li>- Drug administration record with start/end times</li>
                    <li>- Prior authorization (if applicable)</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
              Claim History
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
                  <CheckCircle className="h-5 w-5 text-success-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Validation Passed</p>
                  <p className="text-sm text-neutral-500">Score: 98/100</p>
                </div>
                <p className="text-sm text-neutral-500">
                  {new Date(claim.validatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                  <FileText className="h-5 w-5 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Claim Created</p>
                  <p className="text-sm text-neutral-500">Via agentic flow</p>
                </div>
                <p className="text-sm text-neutral-500">
                  {new Date(claim.dateOfService).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Claim Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-5 w-5 text-neutral-400" />
            <h4 className="font-semibold text-neutral-900">Patient</h4>
          </div>
          <p className="text-neutral-700">{claim.patientName}</p>
          <p className="text-sm text-neutral-500">{claim.payerName}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="h-5 w-5 text-neutral-400" />
            <h4 className="font-semibold text-neutral-900">Provider</h4>
          </div>
          <p className="text-neutral-700">{claim.providerName}</p>
          <p className="text-sm font-mono text-neutral-500">NPI: {claim.providerNpi}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-5 w-5 text-neutral-400" />
            <h4 className="font-semibold text-neutral-900">Service Date</h4>
          </div>
          <p className="text-neutral-700">
            {new Date(claim.dateOfService).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </Card>
      </div>
    </div>
  )
}
