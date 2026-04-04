'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Download, Trash2, Clock, Maximize2 } from 'lucide-react';
import { getContentTypeLabel, getToneLabel } from '@/lib/api/constants';

interface Generation {
  id: string;
  type: string;
  tone: string;
  createdAt: string;
  output: string;
  input: Record<string, string>;
  model?: string;
}

export function FullHistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Load history on mount
  React.useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/history');
        const data = await response.json();
        if (data.success) {
          setGenerations(data.data.generations || []);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const filtered = generations
    .filter((g) => !filter || g.type.includes(filter) || g.tone.includes(filter))
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

  const groupedByType = filtered.reduce(
    (acc: Record<string, Generation[]>, gen) => {
      const type = gen.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(gen);
      return acc;
    },
    {} as Record<string, typeof filtered>
  );

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4 sticky top-0 z-10 bg-white">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Filter
            </label>
            <input
              type="text"
              placeholder="Search type or tone..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded border border-input bg-transparent focus-visible:outline-1 focus-visible:outline-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="w-full text-sm px-3 py-2 rounded border border-input bg-transparent focus-visible:outline-1 focus-visible:outline-ring"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            All Generations ({filtered.length})
          </h2>
          <p className="text-sm text-slate-600">
            {Object.keys(groupedByType).length} different content types
          </p>
        </div>
      </div>

      {/* Grouped Content */}
      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          No generations found matching your filters.
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByType).map(([type, items]) => (
            <div key={type}>
              <div className="mb-3">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  {getContentTypeLabel(type)}
                  <Badge variant="secondary" className="text-xs">
                    {items.length}
                  </Badge>
                </h3>
              </div>
              <div className="space-y-2">
                {items.map((gen) => (
                  <Card
                    key={gen.id}
                    className="p-4 cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => setExpanded(expanded === gen.id ? null : gen.id)}
                  >
                    <div className="space-y-2">
                      {/* Summary */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {getToneLabel(gen.tone)}
                            </Badge>
                            {gen.model && (
                              <Badge variant="outline" className="text-xs">
                                {gen.model}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 line-clamp-2">
                            {gen.output}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(gen.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Maximize2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </div>

                      {/* Expanded View */}
                      {expanded === gen.id && (
                        <div className="pt-4 border-t border-slate-200 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-slate-600 mb-1">
                              Full Output
                            </p>
                            <div className="bg-slate-50 p-3 rounded text-sm text-slate-700 max-h-96 overflow-y-auto">
                              {gen.output}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-600 mb-1">
                              Input
                            </p>
                            <div className="space-y-1 text-xs text-slate-600">
                              {Object.entries(gen.input).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(gen.output)}
                              className="flex-1 gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Download className="w-4 h-4" />
                              Export
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
