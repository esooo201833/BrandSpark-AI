'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Home, Zap as ZapIcon, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";

const navItems = [
  { href: "/dashboard", label: "Generator", icon: ZapIcon },
  { href: "/dashboard/history", label: "History", icon: Clock },
  { href: "/dashboard/templates", label: "Templates", icon: Home },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>BrandSpark</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-900">Free Plan</p>
          <p className="text-xs text-blue-700">100 credits remaining</p>
        </div>
        
        <LanguageSwitcher />
        
        <Link href="/dashboard/pricing">
          <Button variant="default" className="w-full bg-amber-500 hover:bg-amber-600" size="sm">
            Upgrade
          </Button>
        </Link>
      </div>
    </aside>
  );
}
