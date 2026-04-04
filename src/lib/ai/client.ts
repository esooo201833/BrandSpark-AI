import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OPENAI_API_KEY not set - OpenAI features will fail at runtime');
      // Return dummy client that throws when used
      return new Proxy({} as OpenAI, {
        get: () => {
          throw new Error('OPENAI_API_KEY environment variable is not set');
        },
      });
    }
    
    openaiInstance = new OpenAI({
      apiKey,
    });
  }
  
  return openaiInstance;
}

// For backward compatibility - lazy initialization
export const openai = new Proxy({} as OpenAI, {
  get: (target, prop) => {
    const client = getOpenAIClient();
    return (client as any)[prop];
  },
});

// Rate limiting helper - simple in-memory cache
const requestCache = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const existing = requestCache.get(identifier);

  if (!existing || now > existing.resetAt) {
    requestCache.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  existing.count++;
  return true;
}
