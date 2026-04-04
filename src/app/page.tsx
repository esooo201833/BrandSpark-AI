import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Sparkles, Copy, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Create compelling brand content instantly using advanced AI models",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Get results in seconds with our optimized generation pipeline",
  },
  {
    icon: Copy,
    title: "Copy & Export",
    description: "Easily copy or export your generated content in your preferred format",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Track your generations and monitor your content library growth",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-lg">BrandSpark</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
            <Link href="/dashboard/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
            <Link href="/docs" className="text-slate-600 hover:text-slate-900">Docs</Link>
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
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-6 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-powered marketing content
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Create winning brand content
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Generate brand names, slogans, social posts, landing page copy, and more. 
              Powered by advanced AI to match your brand voice perfectly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Start Creating <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-slate-600">
              Powerful tools to streamline your content creation workflow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <Icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to spark your brand?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Get started for free and generate your first piece of content today.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-white">BrandSpark</span>
              </div>
              <p className="text-sm">AI-powered marketing content generation</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Resources</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Docs</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Examples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col items-center gap-4">
            <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Admin Login
            </Link>
            <p className="text-sm text-slate-400">
              © 2026 BrandSpark AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
