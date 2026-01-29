interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

class ApiIntegrationHelper {
  private config: ApiConfig;
  private isTestMode: boolean = false;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 5000,
      retries: 3,
      ...config
    };
  }

  setTestMode(enabled: boolean): void {
    this.isTestMode = enabled;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    if (this.isTestMode) {
      return this.mockRequest<T>(endpoint, options);
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: response.statusText
      };
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  }

  private mockRequest<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    const mockData = { id: 1, message: 'Mock response' } as T;
    return Promise.resolve({
      data: mockData,
      status: 200,
      message: 'OK'
    });
  }
}

export { ApiIntegrationHelper, ApiConfig, ApiResponse };