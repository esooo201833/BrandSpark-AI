'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Zap, Mail, CheckCircle2, Loader2, RefreshCw, AlertCircle, Github } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [emailFailed, setEmailFailed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (!formData.agreeTerms) {
        setError('You must agree to the terms');
        return;
      }

      // Call real API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Show verification message instead of redirecting
      setShowVerificationMessage(true);
      setRegisteredEmail(data.email);
      setEmailFailed(data.emailFailed || false);
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setOauthLoading('google');
    // Use NextAuth for Google OAuth
    window.location.href = '/api/auth/signin/google';
  };

  const handleGitHubSignup = () => {
    setOauthLoading('GitHub');
    // Use NextAuth for GitHub OAuth
    window.location.href = '/api/auth/signin/GitHub';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-amber-500" />
            <span className="font-bold text-2xl">BrandSpark AI</span>
          </Link>
          {showVerificationMessage ? (
            <>
              <div className="flex justify-center mb-4">
                <Mail className="w-16 h-16 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Verify Your Email</h1>
              <p className="text-slate-600">
                Activation link sent to:<br />
                <strong className="text-amber-600">{registeredEmail}</strong>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
              <p className="text-slate-600">Start your journey today</p>
            </>
          )}
        </div>

        {showVerificationMessage ? (
          /* Verification Message UI */
          <div className="space-y-6">
            {emailFailed ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800 space-y-1">
                    <p className="font-medium">Account created, but email failed to send!</p>
                    <p className="text-amber-700">
                      Verification email could not be sent due to email configuration issues. 
                      Please click the button below to try again.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch('/api/auth/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: registeredEmail }),
                      });
                      if (res.ok) {
                        setEmailFailed(false);
                      }
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-amber-500 text-amber-700 hover:bg-amber-50"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin ml-2" /> Sending...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 ml-2" /> Resend verification email</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Account created successfully!</p>
                    <p className="text-blue-600">Please click the activation link in the email to verify your account.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                Go to Login
              </Button>
              
              <p className="text-xs text-center text-slate-500">
                Didn't receive the email? Check Spam folder or{' '}
                <Link 
                  href={`/verify-email?email=${encodeURIComponent(registeredEmail)}`}
                  className="text-amber-500 hover:text-amber-600"
                >
                  Resend link
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading || oauthLoading !== null}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading || oauthLoading !== null}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading || oauthLoading !== null}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading || oauthLoading !== null}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))
                  }
                  disabled={loading || oauthLoading !== null}
                />
                <Label htmlFor="agreeTerms" className="text-sm font-normal cursor-pointer">
                  I agree to{' '}
                  <Link href="/terms" className="text-amber-500 hover:text-amber-600">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={loading || oauthLoading !== null}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    Creating...
                  </>
                ) : 'Sign Up'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-600">or</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignup}
                disabled={loading || oauthLoading !== null}
              >
                {oauthLoading === 'google' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    Signing up...
                  </>
                ) : 'Sign up with Google'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGitHubSignup}
                disabled={loading || oauthLoading !== null}
              >
                {oauthLoading === 'GitHub' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    Signing up...
                  </>
                ) : 'Sign up with GitHub'}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="text-amber-500 hover:text-amber-600 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
