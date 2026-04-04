'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCw, Download, AlertCircle } from 'lucide-react';
import { useGenerate } from '@/hooks/useGenerate';
import { useLanguage } from '@/hooks/useLanguage';
import { contentTypes, tones, inputFieldsForType, getContentTypeLabel, getToneLabel } from '@/lib/api/constants';

export function ContentGenerator() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>(contentTypes[0].id);
  const [selectedTone, setSelectedTone] = useState<string>(tones[0].id);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { generate, loading, result, error } = useGenerate();

  const currentFields = useMemo(() => {
    return inputFieldsForType[selectedType] || [];
  }, [selectedType]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setInputs({});
  };

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!selectedType || !selectedTone || Object.keys(inputs).length === 0) {
      return;
    }

    try {
      await generate({
        type: selectedType,
        tone: selectedTone,
        input: inputs,
        model: 'gpt-4o-mini',
      });
    } catch {
      // Error is handled by the hook
    }
  };

  const handleCopy = async () => {
    if (result?.data?.content) {
      await navigator.clipboard.writeText(result.data.content);
      setCopiedId('copy');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const canGenerate = selectedType && selectedTone && Object.keys(inputs).length > 0;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card className="p-6">
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-semibold">{t('generateContent')}</h3>
          </div>

          {/* Type Selection */}
          <div>
            <Label htmlFor="type" className="text-sm font-medium">
              {t('selectContentType')}
            </Label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="mt-1 flex h-8 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-hidden transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {contentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tone Selection */}
          <div>
            <Label htmlFor="tone" className="text-sm font-medium">
              {t('selectTone')}
            </Label>
            <select
              id="tone"
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="mt-1 flex h-8 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-hidden transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tones.map((tone) => (
                <option key={tone.id} value={tone.id}>
                  {tone.label} — {tone.description}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Input Fields */}
          <div className="space-y-3 pt-2">
            {currentFields.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </Label>
                {field.name === 'features' ? (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={inputs[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="mt-1 min-h-24 resize-none"
                  />
                ) : (
                  <Input
                    id={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    value={inputs[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex gap-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="w-full"
            size="lg"
          >
            {loading ? t('generating') : t('generate')}
          </Button>
        </div>
      </Card>

      {/* Output Panel */}
      <div className="space-y-4">
        <Card className="p-6 min-h-96 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('generateContent')}</h3>
            {result?.data ? (
              <>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {getContentTypeLabel(result.data.type)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getToneLabel(result.data.tone)}
                  </Badge>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200 min-h-40">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{result.data.content}</p>
                </div>
              </>
            ) : (
              <div className="bg-slate-50 p-4 rounded border border-dashed border-slate-300 min-h-40 flex items-center justify-center">
                <p className="text-sm text-slate-500 text-center">
                  {t('generateContent')} will appear here
                </p>
              </div>
            )}
          </div>

          {result?.data && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedId === 'copy' ? t('copied') : t('copy')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                onClick={handleGenerate}
                variant="outline"
                size="sm"
                disabled={loading}
                className="gap-2"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
