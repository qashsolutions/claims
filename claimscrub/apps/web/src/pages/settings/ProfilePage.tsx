import { Card, CardHeader, CardContent, Button, Input } from '@claimscrub/ui'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-body-sm text-neutral-500">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar */}
        <div className="space-y-1">
          <button className="w-full rounded-lg bg-primary-50 px-4 py-2 text-left font-medium text-primary-700">
            Profile
          </button>
          <button className="w-full rounded-lg px-4 py-2 text-left text-neutral-600 hover:bg-neutral-100">
            Billing
          </button>
          <button className="w-full rounded-lg px-4 py-2 text-left text-neutral-600 hover:bg-neutral-100">
            Integrations
          </button>
          <button className="w-full rounded-lg px-4 py-2 text-left text-neutral-600 hover:bg-neutral-100">
            Security
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-heading text-lg font-semibold text-neutral-900">Profile</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                disabled
                helperText="Contact support to change your email"
              />
              <Input label="Full Name" placeholder="Enter your name" />
              <Input label="Job Title" placeholder="e.g., Billing Specialist" />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-heading text-lg font-semibold text-neutral-900">Practice</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Practice Name" placeholder="Enter practice name" />
              <Input label="NPI" placeholder="10-digit NPI" />
              <Input label="Tax ID" placeholder="XX-XXXXXXX" />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
