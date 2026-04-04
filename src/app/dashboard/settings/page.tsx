import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Lock, Palette, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">
                  <Lock className="w-5 h-5 text-slate-400" />
                  Account
                </h2>
                <p className="text-sm text-slate-600">Manage your account settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  disabled
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Plan</label>
                <div className="mt-1 flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  <span className="text-sm text-slate-600">Free Plan</span>
                  <Badge>Free</Badge>
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">
                  <Palette className="w-5 h-5 text-slate-400" />
                  Preferences
                </h2>
                <p className="text-sm text-slate-600">Customize your experience</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Default Tone
                </label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus-visible:outline-1 focus-visible:outline-ring">
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Creative</option>
                  <option>Technical</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Default Model
                </label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus-visible:outline-1 focus-visible:outline-ring">
                  <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                  <option value="gpt-4o">GPT-4o (More Powerful)</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="auto-save" defaultChecked className="w-4 h-4" />
                <label htmlFor="auto-save" className="text-sm text-slate-700">
                  Auto-save generations to history
                </label>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">
                  <Bell className="w-5 h-5 text-slate-400" />
                  Notifications
                </h2>
                <p className="text-sm text-slate-600">Control how we notify you</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="email-updates" defaultChecked className="w-4 h-4" />
                <label htmlFor="email-updates" className="text-sm text-slate-700">
                  Email me about updates and new features
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="credits" defaultChecked className="w-4 h-4" />
                <label htmlFor="credits" className="text-sm text-slate-700">
                  Notify me when credits are running low
                </label>
              </div>
            </div>
          </Card>

          {/* Data & Privacy */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-1">
                  <Database className="w-5 h-5 text-slate-400" />
                  Data & Privacy
                </h2>
                <p className="text-sm text-slate-600">Manage your data</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                All your generated content is stored securely and encrypted. We never share your data with third parties.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Download My Data
                </Button>
                <Button variant="outline" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Save */}
        <div className="flex gap-2">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
