import { getStoredToken, refreshToken } from './authService';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL = 'https://hammerhead-app-du23o.ondigitalocean.app/api';

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = getStoredToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      let response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Handle token refresh if unauthorized
      if (response.status === 401 && token) {
        try {
          await refreshToken();
          const newToken = getStoredToken();
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(`${this.baseURL}${endpoint}`, config);
        } catch (refreshError) {
          return { success: false, error: 'Authentication failed' };
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        return { success: false, error: errorData.message || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  clearCache(): void {
    // Implementation for cache clearing if needed
  }
}

export const apiClient = new ApiClient();