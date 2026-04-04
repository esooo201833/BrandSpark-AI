/**
 * API client utilities for making requests to the backend
 */

export interface GenerateRequest {
  type: string;
  tone: string;
  input: Record<string, string>;
  model?: 'gpt-4o-mini' | 'gpt-4o';
}

export interface GenerateResponse {
  success: boolean;
  data?: {
    content: string;
    contentId: string;
    type: string;
    tone: string;
  };
  error?: string;
}

export async function generateContent(request: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}

export interface HistoryItem {
  id: string;
  type: string;
  tone: string;
  input: Record<string, string>;
  output: string;
  createdAt: string | Date;
  model?: string;
}

export interface HistoryResponse {
  success: boolean;
  data?: {
    generations: HistoryItem[];
    count: number;
  };
  error?: string;
}

export async function fetchHistory(type?: string): Promise<HistoryResponse> {
  const params = new URLSearchParams();
  if (type) {
    params.append('type', type);
  }

  const response = await fetch(`/api/history?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}
