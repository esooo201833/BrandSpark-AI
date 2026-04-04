import { FullHistoryPage } from '@/components/history/full-history';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Generation History</h1>
          <p className="text-slate-600">View and manage all your generated content</p>
        </div>

        {/* Full History Component */}
        <FullHistoryPage />
      </div>
    </div>
  );
}
