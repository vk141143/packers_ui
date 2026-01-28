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
  CLIENT_API: isDev 
    ? '/api' 
    : 'https://client.voidworksgroup.co.uk',
  CREW_API: isDev 
    ? '/crew-api' 
    : 'https://voidworksgroup.co.uk',
  ADMIN_API: isDev 
    ? '/admin-api' 
    : 'https://hammerhead-app-du23o.ondigitalocean.app',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const getApiUrl = (endpoint: string, apiType: 'client' | 'crew' | 'admin' = 'client'): string => {
  const baseUrl = apiType === 'client' ? API_CONFIG.CLIENT_API : 
                  apiType === 'admin' ? API_CONFIG.ADMIN_API : API_CONFIG.CREW_API;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
