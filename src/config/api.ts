const isDev = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

export const API_CONFIG = {
  CLIENT_API: isDev 
    ? '/api' 
    : import.meta.env.VITE_CLIENT_API_URL || (isProduction ? '/api' : 'https://client.voidworksgroup.co.uk/api'),
  CREW_API: isDev 
    ? '/crew-api' 
    : import.meta.env.VITE_CREW_API_URL || (isProduction ? '/crew-api' : 'https://hammerhead-app-du23o.ondigitalocean.app/api'),
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const getApiUrl = (endpoint: string, apiType: 'client' | 'crew' = 'client'): string => {
  const baseUrl = apiType === 'client' ? API_CONFIG.CLIENT_API : API_CONFIG.CREW_API;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
