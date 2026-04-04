'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Download, Trash2, Clock, Filter } from 'lucide-react';
import { getContentTypeLabel, getToneLabel } from '@/lib/api/constants';

interface Generation {
  id: string;
  type: string;
  tone: string;
  input: Record<string, string>;
  output: string;
  createdAt: string | Date;
  model?: string;
}

interface HistoryListProps {
  limit?: number;
}

export function HistoryList({ limit = 10 }: HistoryListProps) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/history');
        const data = await response.json();

        if (data.success) {
          setGenerations(data.data.generations || []);
        } else {
          setError(data.error || 'Failed to load history');
        }
      } catch (err) {
        setError('Failed to fetch history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filtered = useMemo(() => {
    let result = generations;

    if (filter) {
      result = result.filter((g) => g.type.includes(filter) || g.tone.includes(filter));
    }

    return result.slice(0, limit);
  }, [generations, filter, limit]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  if (loading) {
    return (
      <div>
        <p className="text-sm text-slate-500 text-center py-8">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-sm text-red-600 text-center py-8">{error}</p>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div>
        <p className="text-sm text-slate-500 text-center py-8">
          No generations yet. Create some content to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter by type or tone..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm px-3 py-2 rounded border border-input bg-transparent focus-visible:outline-1 focus-visible:outline-ring"
        />
      </div>

      {/* Generation Items */}
      <div className="space-y-3">
        {filtered.map((generation) => (
          <Card key={generation.id} className="p-4 hover:shadow-sm transition-shadow">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getContentTypeLabel(generation.type)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getToneLabel(generation.tone)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(generation.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p className="text-sm text-slate-700 line-clamp-3">{generation.output}</p>
              </div>

              {/* Input Summary */}
              <div className="text-xs text-slate-500 space-y-1">
                {Object.entries(generation.input).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(generation.output, generation.id)}
                  className="flex-1 gap-2 h-7 text-xs"
                >
                  <Copy className="w-3 h-3" />
                  {copiedId === generation.id ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 h-7 text-xs"
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(generation.id)}
                  className="gap-2 h-7 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* More Items Indicator */}
      {generations.length > limit && (
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-3">
            Showing {filtered.length} of {generations.length} generations
          </p>
          <Button variant="outline" size="sm" className="text-xs">
            View All ({generations.length})
          </Button>
        </div>
      )}
    </div>
  );
}
