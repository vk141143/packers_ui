import { environment } from '../config/environment';

export const API_CONFIG = {
  USE_REAL_API: import.meta.env.VITE_USE_REAL_API === 'true',
  CLIENT_BASE_URL: environment.getApiUrl('', 'client'),
  CREW_BASE_URL: environment.getApiUrl('', 'crew'),
};

export const makeApiCall = async (endpoint: string, options: RequestInit = {}, apiType: 'client' | 'crew' = 'client') => {
  const baseUrl = apiType === 'client' ? API_CONFIG.CLIENT_BASE_URL : API_CONFIG.CREW_BASE_URL;
  const url = `${baseUrl}${endpoint}`;
  
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired, clear auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      throw new Error('Authentication expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.detail || error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

export const isRealApiEnabled = () => API_CONFIG.USE_REAL_API;