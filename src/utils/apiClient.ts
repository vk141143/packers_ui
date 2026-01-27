import { getApiUrl } from '../config/api';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

class ApiClient {
  private async makeRequest(endpoint: string, config: RequestConfig = {}, apiType: 'client' | 'crew' = 'client') {
    const { method = 'GET', headers = {}, body, timeout = 30000 } = config;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = getApiUrl(endpoint, apiType);
      const response = await fetch(url, {
        method,
        headers: defaultHeaders,
        body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
        signal: controller.signal,
        credentials: 'omit', // Prevent CORS credential issues
        mode: 'cors',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          message: `HTTP ${response.status}: ${response.statusText}` 
        }));
        throw new Error(error.detail || error.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      // CORS or network error fallback
      if (error.message?.includes('CORS') || error.message?.includes('fetch')) {
        console.warn(`API request failed, possible CORS issue: ${error.message}`);
        throw new Error('Network error - please check your connection');
      }
      
      throw error;
    }
  }

  async get(endpoint: string, apiType: 'client' | 'crew' = 'client') {
    return this.makeRequest(endpoint, { method: 'GET' }, apiType);
  }

  async post(endpoint: string, data: any, apiType: 'client' | 'crew' = 'client') {
    return this.makeRequest(endpoint, { method: 'POST', body: data }, apiType);
  }

  async patch(endpoint: string, data: any, apiType: 'client' | 'crew' = 'client') {
    return this.makeRequest(endpoint, { method: 'PATCH', body: data }, apiType);
  }

  async delete(endpoint: string, apiType: 'client' | 'crew' = 'client') {
    return this.makeRequest(endpoint, { method: 'DELETE' }, apiType);
  }

  async postWithAuth(endpoint: string, data: any, apiType: 'client' | 'crew' = 'client') {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No access token available');
    
    return this.makeRequest(endpoint, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data,
    }, apiType);
  }

  async getWithAuth(endpoint: string, apiType: 'client' | 'crew' = 'client') {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No access token available');
    
    return this.makeRequest(endpoint, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    }, apiType);
  }
}

export const apiClient = new ApiClient();