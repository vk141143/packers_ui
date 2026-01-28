const isDev = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Validate required environment variables in production
if (isProduction && false) {
  const requiredVars = ['VITE_CLIENT_API_URL', 'VITE_CREW_API_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const API_CONFIG = {
  CLIENT_API: 'https://client.voidworksgroup.co.uk',
  CREW_API: 'https://hammerhead-app-du23o.ondigitalocean.app',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const getApiUrl = (endpoint: string, apiType: 'client' | 'crew' | 'admin' = 'client'): string => {
  const baseUrl = apiType === 'client' ? API_CONFIG.CLIENT_API : API_CONFIG.CREW_API;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Fallback API URLs for testing
export const FALLBACK_ENDPOINTS = {
  LOGIN_ADMIN: [`${API_CONFIG.CREW_API}/login/admin`, `${API_CONFIG.CREW_API}/auth/login/admin`, `${API_CONFIG.CREW_API}/api/login/admin`],
  LOGIN_CREW: [`${API_CONFIG.CREW_API}/login/crew`, `${API_CONFIG.CREW_API}/auth/login/crew`, `${API_CONFIG.CREW_API}/api/login/crew`],
  CREW_JOBS: [`${API_CONFIG.CREW_API}/crew/jobs`, `${API_CONFIG.CREW_API}/api/crew/jobs`, `${API_CONFIG.CREW_API}/jobs`],
};

// Try multiple endpoints until one works
export const tryMultipleEndpoints = async (endpoints: string[], options: RequestInit): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, options);
      if (response.ok || response.status !== 404) {
        return response;
      }
    } catch (error) {
      lastError = error as Error;
      continue;
    }
  }
  
  throw lastError || new Error('All endpoints failed');
};
