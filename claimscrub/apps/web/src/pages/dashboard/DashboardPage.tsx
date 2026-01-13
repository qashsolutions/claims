import { Link } from 'react-router-dom'
import { Card, CardHeader, CardContent, Button, Badge } from '@claimscrub/ui'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-body-sm text-neutral-500">Welcome back. Your claims at a glance.</p>
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-neutral-500">Claims This Month</p>
            <p className="mt-1 font-heading text-2xl font-bold text-neutral-900">47</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-neutral-500">Avg Validation Score</p>
            <p className="mt-1 font-heading text-2xl font-bold text-success-600">96%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-neutral-500">Denials Prevented</p>
            <p className="mt-1 font-heading text-2xl font-bold text-primary-600">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-neutral-500">Est. Revenue Protected</p>
            <p className="mt-1 font-heading text-2xl font-bold text-neutral-900">$34,500</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="font-heading text-lg font-semibold text-neutral-900">Quick Actions</h2>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link
            to="/claims/new"
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900">New Claim</p>
              <p className="text-body-sm text-neutral-500">Start a new claim validation</p>
            </div>
          </Link>

          <Link
            to="/claims"
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900">View Claims</p>
              <p className="text-body-sm text-neutral-500">See all your claims</p>
            </div>
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900">Settings</p>
              <p className="text-body-sm text-neutral-500">Configure your account</p>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Claims */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-neutral-900">Recent Claims</h2>
            <Link to="/claims" className="text-body-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Sample claims */}
            {[
              { id: 'CLM-001', patient: 'Maria Santos', score: 100, status: 'VALIDATED' },
              { id: 'CLM-002', patient: 'John Smith', score: 85, status: 'WARNING' },
              { id: 'CLM-003', patient: 'Sarah Johnson', score: 100, status: 'SUBMITTED' },
            ].map((claim) => (
              <div
                key={claim.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-body-sm text-neutral-500">{claim.id}</span>
                  <span className="font-medium text-neutral-900">{claim.patient}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${claim.score === 100 ? 'text-success-600' : 'text-warning-600'}`}>
                    {claim.score}%
                  </span>
                  <Badge
                    variant={
                      claim.status === 'VALIDATED' || claim.status === 'SUBMITTED'
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {claim.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
