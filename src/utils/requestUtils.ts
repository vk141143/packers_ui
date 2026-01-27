// Production-ready request utilities
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class RequestTimeoutError extends Error {
  constructor(timeout: number) {
    super(`Request timeout after ${timeout}ms`);
    this.name = 'RequestTimeoutError';
  }
}

export async function fetchWithTimeout(
  url: string, 
  config: RequestConfig = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES, retryDelay = RETRY_DELAY, ...fetchConfig } = config;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Retry on 5xx errors or network issues
    if (response.status >= 500 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return fetchWithTimeout(url, { ...config, retries: retries - 1 });
    }
    
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Retry on network errors
    if ((error.name === 'AbortError' || error.name === 'TypeError') && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return fetchWithTimeout(url, { ...config, retries: retries - 1 });
    }
    
    if (error.name === 'AbortError') {
      throw new RequestTimeoutError(timeout);
    }
    
    throw error;
  }
}

export function isTokenExpired(token: string): boolean {
  if (!token || token.startsWith('mock_token')) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}