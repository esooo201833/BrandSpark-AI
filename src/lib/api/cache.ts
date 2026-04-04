// Simple in-memory cache for generated content
// In production, use Redis for distributed cache

interface CacheEntry {
  content: string;
  createdAt: number;
  ttl: number; // Time to live in milliseconds
}

class ContentCache {
  private cache = new Map<string, CacheEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  /**
   * Generate cache key from request parameters
   */
  generateKey(type: string, tone: string, input: Record<string, string>): string {
    const sortedInput = Object.keys(input)
      .sort()
      .map(key => `${key}:${input[key]}`)
      .join('|');
    return `${type}:${tone}:${sortedInput}`;
  }

  /**
   * Get cached content if available and not expired
   */
  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.createdAt > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.content;
  }

  /**
   * Set cache entry with TTL
   */
  set(key: string, content: string, ttlSeconds: number = 3600): void {
    this.cache.set(key, {
      content,
      createdAt: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  /**
   * Clear expired entries periodically
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.createdAt > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 5 * 60 * 1000); // Run every 5 minutes
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      items: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        createdAt: new Date(entry.createdAt),
        expiresAt: new Date(entry.createdAt + entry.ttl),
      })),
    };
  }
}

export const contentCache = new ContentCache();
