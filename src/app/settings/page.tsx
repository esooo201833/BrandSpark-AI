import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Profile</h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="mail" className="text-sm">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="name" className="text-sm">Display Name</Label>
              <Input id="name" placeholder="Your name" className="mt-2" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </Card>

        {/* Brand Voice */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Brand Voice</h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="brand-name" className="text-sm">Brand Name</Label>
              <Input id="brand-name" placeholder="Your brand name" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="voice-type" className="text-sm">Default Voice</Label>
              <Select defaultValue="professional">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Update Brand Profile</Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Preferences</h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="model" className="text-sm">AI Model</Label>
              <Select defaultValue="gpt4">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4 (More creative)</SelectItem>
                  <SelectItem value="gpt35">GPT-3.5 (Faster)</SelectItem>
                  <SelectItem value="claude">Claude (Balanced)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Preferences</Button>
          </div>
        </Card>

        {/* Billing */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Billing</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900">Current Plan</p>
                <p className="text-sm text-slate-600">Free - 100 generations/month</p>
              </div>
              <Button variant="outline">Upgrade</Button>
            </div>
          </div>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            Delete Account
          </Button>
        </Card>
      </div>
    </div>
  );
}
