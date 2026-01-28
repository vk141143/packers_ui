const isDev = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Validate required environment variables in production
if (isProduction) {
  const requiredVars = ['VITE_CLIENT_API_URL', 'VITE_CREW_API_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export const API_CONFIG = {
  CLIENT_API: isDev 
    ? '/api' 
    : import.meta.env.VITE_CLIENT_API_URL || '/api',
  CREW_API: isDev 
    ? '/crew-api' 
    : import.meta.env.VITE_CREW_API_URL || '/crew-api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const getApiUrl = (endpoint: string, apiType: 'client' | 'crew' = 'client'): string => {
  const baseUrl = apiType === 'client' ? API_CONFIG.CLIENT_API : API_CONFIG.CREW_API;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
