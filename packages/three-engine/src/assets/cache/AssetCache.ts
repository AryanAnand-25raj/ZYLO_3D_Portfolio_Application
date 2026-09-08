export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxCapacity: number;
  hitRate: number;
}

export class AssetCache<T = any> {
  private cache: Map<string, { value: T; lastAccessed: number; sizeBytes: number }>;
  private maxCapacity: number;
  private maxByteSize: number;
  private currentByteSize: number;
  private hits: number;
  private misses: number;
  private accessCounter: number;

  constructor(maxCapacity = 50, maxByteSize = 100 * 1024 * 1024) {
    this.cache = new Map();
    this.maxCapacity = maxCapacity;
    this.maxByteSize = maxByteSize;
    this.currentByteSize = 0;
    this.hits = 0;
    this.misses = 0;
    this.accessCounter = 0;
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    this.hits++;
    entry.lastAccessed = ++this.accessCounter;
    return entry.value;
  }

  public set(key: string, value: T, estimatedSizeBytes = 500000): void {
    // If key exists, update value and timestamp
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.currentByteSize -= existing.sizeBytes;
      this.currentByteSize += estimatedSizeBytes;
      existing.value = value;
      existing.lastAccessed = ++this.accessCounter;
      existing.sizeBytes = estimatedSizeBytes;
      return;
    }

    // Evict oldest if exceeding capacity
    while (this.cache.size >= this.maxCapacity || (this.currentByteSize + estimatedSizeBytes > this.maxByteSize && this.cache.size > 0)) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      lastAccessed: ++this.accessCounter,
      sizeBytes: estimatedSizeBytes,
    });
    this.currentByteSize += estimatedSizeBytes;
  }

  public delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    this.currentByteSize -= entry.sizeBytes;
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
    this.currentByteSize = 0;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  public getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      maxCapacity: this.maxCapacity,
      hitRate: total > 0 ? Number((this.hits / total).toFixed(3)) : 0,
    };
  }
}

// Global singleton cache instance for 3D engine models and assets
export const globalModelCache = new AssetCache<any>(40, 60 * 1024 * 1024);
