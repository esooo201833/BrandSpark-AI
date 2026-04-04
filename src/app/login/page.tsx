'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Mail, Loader2, ArrowLeft, Sparkles, Github } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle "email not verified" case
        if (data.canResendEmail) {
          setNeedsVerification(true);
          setUserEmail(formData.email);
        }
        setError(data.error_ar || data.error || 'Login failed');
        return;
      }

      // Store user data and token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push(data.redirectUrl || '/dashboard');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setOauthLoading('google');
    window.location.href = '/api/auth/signin/google';
  };

  const handleGitHubLogin = () => {
    setOauthLoading('GitHub');
    window.location.href = '/api/auth/signin/GitHub';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <span className="font-bold text-2xl">BrandSpark AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Login</h1>
          <p className="text-slate-600">Welcome back!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className={`${needsVerification ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded`}>
              {error}
              {needsVerification && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                    <Link 
                    href={`/verify-email?email=${encodeURIComponent(userEmail)}`}
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Resend verification email
                  </Link>
                </div>
              )}
            </div>
          )}

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

          <Button 
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-600"
            disabled={loading || oauthLoading !== null}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                Logging in...
              </>
            ) : 'Login'}
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
            onClick={handleGoogleLogin}
            disabled={loading || oauthLoading !== null}
          >
            {oauthLoading === 'google' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                Logging in...
              </>
            ) : 'Login with Google'}
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGitHubLogin}
            disabled={loading || oauthLoading !== null}
          >
            {oauthLoading === 'GitHub' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                Logging in...
              </>
            ) : 'Login with GitHub'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-600">
            New user?{' '}
            <Link href="/signup" className="text-amber-500 hover:text-amber-600 font-medium">
              Sign Up
            </Link>
          </p>
          <Link href="/forgot-password" className="text-sm text-slate-500 hover:text-slate-700 block">
            Forgot your password?
          </Link>
        </div>
      </Card>
    </div>
  );
}
