import { ExternalLink, Shield, FileText, AlertCircle } from 'lucide-react'
import { Card, Badge, Button } from '@claimscrub/ui'
import { cn } from '@/lib/utils'
import type { Claim } from '@claimscrub/shared'

/**
 * CoveragePanel Component
 *
 * Displays Medicare/payer coverage analysis for a claim.
 * Per design mockup 04_validation_results.md - Coverage Tab.
 *
 * Sections:
 * - NCD (National Coverage Determinations)
 * - LCD (Local Coverage Determinations)
 * - Documentation Requirements
 * - Drug Coverage (for J-codes)
 *
 * Data Sources:
 * - CMS Medicare Coverage Database (MCD)
 * - MAC-specific LCDs
 * - FDA drug indications
 *
 * @example
 * ```tsx
 * <CoveragePanel claim={claim} />
 * ```
 */

export interface CoveragePanelProps {
  claim?: Claim
  cptCode?: string
  icdCode?: string
  payerName?: string
  className?: string
}

// Coverage data types - in production, data comes from the CMS connector
// via tRPC: trpc.coverage.getCoverage.useQuery({ cptCode })
interface CoverageInfo {
  cptCode: string
  coverageStatus: 'covered' | 'covered_with_conditions' | 'not_covered' | 'unknown'
  ncds: Array<{
    id: string
    title: string
    description: string
    effectiveDate: string
  }>
  lcds: Array<{
    id: string
    title: string
    mac: string
    description: string
  }>
  documentationRequirements: string[]
  drugInfo?: {
    code: string
    name: string
    indications: string[]
    priorAuthRequired: boolean
    averageWholesalePrice?: string
  }
}

export function CoveragePanel({ claim, cptCode: cptCodeProp, icdCode, payerName: payerNameProp, className }: CoveragePanelProps) {
  // In production, this would be fetched from the API based on claim CPT codes
  // For now, we'll show a realistic example based on the claim
  const cptCode = cptCodeProp || claim?.serviceLines?.[0]?.cptCode || '96413'
  const payerName = payerNameProp || claim?.payerName || 'Unknown Payer'

  const coverageInfo: CoverageInfo = {
    cptCode,
    coverageStatus: 'covered_with_conditions',
    ncds: [
      {
        id: 'NCD 110.17',
        title: 'Anti-Cancer Chemotherapy',
        description: 'Covers chemotherapy for FDA-approved indications and off-label use supported by medical compendia.',
        effectiveDate: '2024-01-01',
      },
    ],
    lcds: [
      {
        id: 'L35396',
        title: 'Biomarkers for Oncology',
        mac: 'Novitas Solutions',
        description: 'Requires documentation of tumor markers for targeted therapies including pembrolizumab.',
      },
    ],
    documentationRequirements: [
      'Pathology report confirming malignancy',
      'Treatment plan from oncologist',
      'Drug administration record with start/end times',
      'Prior authorization (if applicable)',
    ],
    drugInfo: claim?.serviceLines?.[0]?.drugCode ? {
      code: claim.serviceLines[0]!.drugCode!,
      name: 'Pembrolizumab (Keytruda)',
      indications: [
        'TNBC (triple-negative breast cancer) with PD-L1 >= 10%',
        'Unresectable/metastatic melanoma',
        'NSCLC with PD-L1 >= 1%',
      ],
      priorAuthRequired: true,
      averageWholesalePrice: '$10,897.56 per 100mg',
    } : undefined,
  }

  // Coverage status badge
  const statusConfig = {
    covered: {
      badge: 'success' as const,
      text: 'COVERED',
    },
    covered_with_conditions: {
      badge: 'warning' as const,
      text: 'COVERED (with conditions)',
    },
    not_covered: {
      badge: 'error' as const,
      text: 'NOT COVERED',
    },
    unknown: {
      badge: 'default' as const,
      text: 'UNKNOWN',
    },
  }

  const status = statusConfig[coverageInfo.coverageStatus]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Coverage Header */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-neutral-900">
              Medicare Coverage Analysis
            </h3>
            <Badge variant={status.badge}>{status.text}</Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <FileText className="h-4 w-4" />
            <span>
              CPT {coverageInfo.cptCode} - Chemotherapy IV Infusion
            </span>
          </div>
        </div>
      </Card>

      {/* NCDs Section */}
      {coverageInfo.ncds.length > 0 && (
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-primary-600" />
              <h4 className="font-heading font-semibold text-neutral-900">
                National Coverage Determinations (NCDs)
              </h4>
            </div>

            <div className="space-y-3">
              {coverageInfo.ncds.map((ncd) => (
                <div
                  key={ncd.id}
                  className="p-3 rounded-md border border-neutral-200 bg-neutral-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-semibold text-primary-600">
                        {ncd.id}
                      </span>
                      <span className="text-neutral-600 ml-2">- {ncd.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?ncdid=${ncd.id.replace('NCD ', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">{ncd.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* LCDs Section */}
      {coverageInfo.lcds.length > 0 && (
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-warning-600" />
              <h4 className="font-heading font-semibold text-neutral-900">
                Local Coverage Determinations (LCDs)
              </h4>
            </div>

            <div className="space-y-3">
              {coverageInfo.lcds.map((lcd) => (
                <div
                  key={lcd.id}
                  className="p-3 rounded-md border border-neutral-200 bg-neutral-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-semibold text-warning-600">
                        LCD {lcd.id}
                      </span>
                      <span className="text-neutral-600 ml-2">- {lcd.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?lcdid=${lcd.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">MAC: {lcd.mac}</p>
                  <p className="mt-2 text-sm text-neutral-600">{lcd.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Documentation Requirements */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-neutral-600" />
            <h4 className="font-heading font-semibold text-neutral-900">
              Documentation Requirements
            </h4>
          </div>

          <ul className="space-y-2">
            {coverageInfo.documentationRequirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                <span className="text-neutral-400 mt-0.5">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Drug Coverage (if applicable) */}
      {coverageInfo.drugInfo && (
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary-600" />
                <h4 className="font-heading font-semibold text-neutral-900">
                  Drug Coverage: {coverageInfo.drugInfo.code}
                </h4>
              </div>
              {coverageInfo.drugInfo.priorAuthRequired && (
                <Badge variant="warning">Prior Auth Required</Badge>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-neutral-700">Drug Name: </span>
                <span className="text-sm text-neutral-600">{coverageInfo.drugInfo.name}</span>
              </div>

              <div>
                <span className="text-sm font-medium text-neutral-700 block mb-1">
                  FDA-Approved Indications:
                </span>
                <ul className="space-y-1">
                  {coverageInfo.drugInfo.indications.slice(0, 3).map((indication, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>{indication}</span>
                    </li>
                  ))}
                </ul>
                {coverageInfo.drugInfo.indications.length > 3 && (
                  <Button variant="ghost" size="sm" className="mt-2">
                    View all {coverageInfo.drugInfo.indications.length} approved indications
                  </Button>
                )}
              </div>

              {coverageInfo.drugInfo.averageWholesalePrice && (
                <div className="pt-3 border-t border-neutral-200">
                  <span className="text-sm font-medium text-neutral-700">
                    Average Wholesale Price:{' '}
                  </span>
                  <span className="text-sm text-neutral-600">
                    {coverageInfo.drugInfo.averageWholesalePrice}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
