'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Sparkles, 
  FileText, 
  Zap, 
  Shield, 
  CreditCard,
  ArrowRight,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span className="font-bold text-lg">BrandSpark AI</span>
            </Link>
            <nav className="hidden md:flex gap-8 text-sm">
              <Link href="/" className="text-slate-600 hover:text-slate-900">Home</Link>
              <Link href="/docs" className="text-slate-900 font-medium">Docs</Link>
              <Link href="/dashboard/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-xl opacity-90">
              Learn how to use BrandSpark AI to create amazing marketing content
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <a href="#getting-started" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-700">
                <Zap className="w-4 h-4" />
                Getting Started
              </a>
              <a href="#features" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-700">
                <Sparkles className="w-4 h-4" />
                Features
              </a>
              <a href="#content-types" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-700">
                <FileText className="w-4 h-4" />
                Content Types
              </a>
              <a href="#pricing" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-700">
                <CreditCard className="w-4 h-4" />
                Pricing Plans
              </a>
              <a href="#security" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-700">
                <Shield className="w-4 h-4" />
                Security
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Getting Started */}
            <section id="getting-started" className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Getting Started</h2>
              </div>
              <div className="space-y-4 text-slate-600">
                <p>Welcome to BrandSpark AI! Here's how to get started:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li><strong>Create an account</strong> - Sign up with your email or use Google/GitHub OAuth</li>
                  <li><strong>Verify your email</strong> - Check your inbox for the verification link</li>
                  <li><strong>Choose a plan</strong> - Select from Free, Basic, Pro, or Enterprise plans</li>
                  <li><strong>Start generating</strong> - Access the dashboard and create amazing content</li>
                </ol>
                <div className="mt-6">
                  <Link href="/signup">
                    <Button className="bg-amber-500 hover:bg-amber-600">
                      Get Started Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Features</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Generation</h3>
                  <p className="text-sm text-slate-600">Advanced AI models create high-quality marketing content instantly</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">Multiple Content Types</h3>
                  <p className="text-sm text-slate-600">Product descriptions, social media posts, blog articles, and more</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">Brand Voice Customization</h3>
                  <p className="text-sm text-slate-600">Define your brand personality and tone for consistent content</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">History & Templates</h3>
                  <p className="text-sm text-slate-600">Save your favorite generations and reuse templates</p>
                </div>
              </div>
            </section>

            {/* Content Types */}
            <section id="content-types" className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Content Types</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold text-sm">AD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Ad Copy</h3>
                    <p className="text-sm text-slate-600">Compelling advertising copy for Google Ads, Facebook Ads, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">SM</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Social Media</h3>
                    <p className="text-sm text-slate-600">Engaging posts for Instagram, Twitter, LinkedIn, and Facebook</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">BL</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Blog Content</h3>
                    <p className="text-sm text-slate-600">SEO-optimized blog posts and articles</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">PD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Product Descriptions</h3>
                    <p className="text-sm text-slate-600">Detailed and persuasive product descriptions for e-commerce</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Pricing Plans</h2>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold text-slate-900">Free</h3>
                  <p className="text-2xl font-bold text-amber-500">$0</p>
                  <p className="text-sm text-slate-600">50 generations/month</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold text-slate-900">Basic</h3>
                  <p className="text-2xl font-bold text-amber-500">$9</p>
                  <p className="text-sm text-slate-600">200 generations/month</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold text-slate-900">Pro</h3>
                  <p className="text-2xl font-bold text-amber-500">$29</p>
                  <p className="text-sm text-slate-600">Unlimited generations</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold text-slate-900">Enterprise</h3>
                  <p className="text-2xl font-bold text-amber-500">$99</p>
                  <p className="text-sm text-slate-600">API access + support</p>
                </div>
              </div>
            </section>

            {/* Security */}
            <section id="security" className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Security</h2>
              </div>
              <div className="space-y-4 text-slate-600">
                <p>Your data security is our top priority:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email verification required for all accounts</li>
                  <li>Secure OAuth authentication with Google and GitHub</li>
                  <li>Encrypted data storage</li>
                  <li>Regular security audits</li>
                  <li>GDPR compliant data handling</li>
                </ul>
              </div>
            </section>

            {/* Help Section */}
            <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Need Help?</h2>
              </div>
              <p className="mb-6 opacity-90">
                Can't find what you're looking for? Contact our support team or check the FAQ.
              </p>
              <div className="flex gap-4">
                <Link href="/contact">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                    View FAQ
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
