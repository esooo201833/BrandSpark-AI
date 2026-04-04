import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-b from-slate-50 to-white md:ml-0 ml-0 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
