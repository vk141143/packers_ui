interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface BatchRequest {
  id: string;
  endpoint: string;
  params?: any;
  resolve: (data: any) => void;
  reject: (error: any) => void;
}

class ApiService {
  private cache = new Map<string, CacheEntry<any>>();
  private batchQueue = new Map<string, BatchRequest[]>();
  private batchTimeouts = new Map<string, NodeJS.Timeout>();
  private readonly batchDelay = 50;
  private readonly defaultTtl = 300000; // 5 minutes

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }

  private isValidCache<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    return entry && this.isValidCache(entry) ? entry.data : null;
  }

  private setCache<T>(key: string, data: T, ttl = this.defaultTtl): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  private async executeBatch(endpoint: string): Promise<void> {
    const requests = this.batchQueue.get(endpoint) || [];
    if (!requests.length) return;

    this.batchQueue.delete(endpoint);
    this.batchTimeouts.delete(endpoint);

    try {
      const batchParams = requests.map(req => ({ id: req.id, ...req.params }));
      const response = await fetch(`${endpoint}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: batchParams })
      });

      const results = await response.json();
      
      requests.forEach(req => {
        const result = results.find((r: any) => r.id === req.id);
        if (result?.error) {
          req.reject(new Error(result.error));
        } else {
          const cacheKey = this.getCacheKey(endpoint, req.params);
          this.setCache(cacheKey, result.data);
          req.resolve(result.data);
        }
      });
    } catch (error) {
      requests.forEach(req => req.reject(error));
    }
  }

  async get<T>(endpoint: string, params?: any, options?: { ttl?: number; batch?: boolean }): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getFromCache<T>(cacheKey);
    
    if (cached) return cached;

    if (options?.batch) {
      return new Promise((resolve, reject) => {
        const requestId = Math.random().toString(36);
        const request: BatchRequest = { id: requestId, endpoint, params, resolve, reject };

        if (!this.batchQueue.has(endpoint)) {
          this.batchQueue.set(endpoint, []);
        }
        this.batchQueue.get(endpoint)!.push(request);

        if (!this.batchTimeouts.has(endpoint)) {
          const timeout = setTimeout(() => this.executeBatch(endpoint), this.batchDelay);
          this.batchTimeouts.set(endpoint, timeout);
        }
      });
    }

    const response = await fetch(`${endpoint}?${new URLSearchParams(params)}`);
    const data = await response.json();
    
    this.setCache(cacheKey, data, options?.ttl);
    return data;
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response.json();
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) this.cache.delete(key);
      }
    } else {
      this.cache.clear();
    }
  }

  prefetch<T>(endpoint: string, params?: any, ttl?: number): Promise<T> {
    return this.get<T>(endpoint, params, { ttl });
  }
}

export const apiService = new ApiService();