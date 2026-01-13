import { Link } from 'react-router-dom'
import { Card, CardHeader, CardContent, Button, Badge, Input } from '@claimscrub/ui'

export default function ClaimsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Claims</h1>
          <p className="text-body-sm text-neutral-500">Manage and track your claims</p>
        </div>
        <Link to="/claims/new">
          <Button>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Claim
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Input placeholder="Search claims..." className="max-w-sm" />
            <select className="rounded-lg border border-neutral-300 px-3 py-2 text-body">
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="VALIDATED">Validated</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="DENIED">Denied</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 text-left text-body-sm font-medium text-neutral-500">Claim ID</th>
                <th className="py-3 text-left text-body-sm font-medium text-neutral-500">Patient</th>
                <th className="py-3 text-left text-body-sm font-medium text-neutral-500">DOS</th>
                <th className="py-3 text-left text-body-sm font-medium text-neutral-500">CPT</th>
                <th className="py-3 text-left text-body-sm font-medium text-neutral-500">Charge</th>
                <th className="py-3 text-left text-body-sm font-medium text-neutral-500">Score</th>
                <th className="py-3 text-left text-body-sm font-medium text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'CLM-001', patient: 'Maria Santos', dos: '01/12/2026', cpt: '96413', charge: 9650, score: 100, status: 'VALIDATED' },
                { id: 'CLM-002', patient: 'John Smith', dos: '01/10/2026', cpt: '90837', charge: 250, score: 85, status: 'WARNING' },
                { id: 'CLM-003', patient: 'Sarah Johnson', dos: '01/08/2026', cpt: '99215', charge: 185, score: 100, status: 'SUBMITTED' },
                { id: 'CLM-004', patient: 'Robert Davis', dos: '01/05/2026', cpt: '59400', charge: 4200, score: 100, status: 'PAID' },
              ].map((claim) => (
                <tr key={claim.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 font-mono text-body-sm text-neutral-600">{claim.id}</td>
                  <td className="py-3 font-medium text-neutral-900">{claim.patient}</td>
                  <td className="py-3 text-neutral-600">{claim.dos}</td>
                  <td className="py-3 font-mono text-neutral-900">{claim.cpt}</td>
                  <td className="py-3 text-neutral-900">${claim.charge.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`font-mono font-bold ${claim.score === 100 ? 'text-success-600' : 'text-warning-600'}`}>
                      {claim.score}%
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        claim.status === 'VALIDATED' || claim.status === 'SUBMITTED' || claim.status === 'PAID'
                          ? 'success'
                          : 'warning'
                      }
                    >
                      {claim.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
