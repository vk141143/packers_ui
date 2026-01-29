import { environment } from './environment';

const isDev = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

export const API_CONFIG = {
  CLIENT_API: environment.getApiUrl(),
  CREW_API: environment.getApiUrl(),
  ADMIN_API: environment.getApiUrl(),
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const getApiUrl = (endpoint: string, apiType: 'client' | 'crew' | 'admin' = 'client'): string => {
  const baseUrl = environment.getApiUrl('', apiType === 'admin' ? 'crew' : apiType);
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Production-ready API call with retry logic
export const apiCall = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      // Retry on server errors (5xx) or network issues
      if (i === retries - 1) {
        return response;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      // Exponential backoff on network errors
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  throw new Error('Max retries exceeded');
};
