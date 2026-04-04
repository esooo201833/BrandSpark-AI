'use client';

import { useState, useCallback } from 'react';
import { generateContent, type GenerateRequest, type GenerateResponse } from '@/lib/api/client';

interface UseGenerateOptions {
  onSuccess?: (response: GenerateResponse) => void;
  onError?: (error: Error) => void;
}

export function useGenerate(options?: UseGenerateOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const generate = useCallback(
    async (request: GenerateRequest) => {
      try {
        setLoading(true);
        setError(null);
        const response = await generateContent(request);

        if (!response.success) {
          throw new Error(response.error || 'Failed to generate content');
        }

        setResult(response);
        options?.onSuccess?.(response);
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error.message);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    loading,
    error,
    result,
    generate,
    reset,
  };
}
