interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'staging';
  CLIENT_API_BASE_URL: string;
  CREW_API_BASE_URL: string;
  WS_URL: string;
  ENCRYPTION_KEY: string;
  DATA_KEY: string;
  SALT: string;
  MAPBOX_TOKEN: string;
  STRIPE_PUBLIC_KEY: string;
  SENTRY_DSN: string;
  ANALYTICS_ID: string;
  FEATURE_FLAGS: FeatureFlags;
  SECURITY: SecuritySettings;
  RATE_LIMITS: RateLimitConfig;
  MONITORING: MonitoringConfig;
  LOGGING: LoggingConfig;
  ERROR_REPORTING: ErrorReportingConfig;
}

interface FeatureFlags {
  ENABLE_REAL_TIME_TRACKING: boolean;
  ENABLE_VOICE_ASSISTANT: boolean;
  ENABLE_AI_ESTIMATES: boolean;
  ENABLE_ADVANCED_ANALYTICS: boolean;
  ENABLE_BETA_FEATURES: boolean;
  ENABLE_DEBUG_MODE: boolean;
  ENABLE_OFFLINE_MODE: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
}

interface SecuritySettings {
  TOKEN_EXPIRY_MS: number;
  REFRESH_THRESHOLD_MS: number;
  MAX_LOGIN_ATTEMPTS: number;
  LOCKOUT_DURATION_MS: number;
  SESSION_TIMEOUT_MS: number;
  CSRF_ENABLED: boolean;
  HTTPS_ONLY: boolean;
  SECURE_COOKIES: boolean;
}

interface RateLimitConfig {
  API_REQUESTS_PER_MINUTE: number;
  LOGIN_ATTEMPTS_PER_HOUR: number;
  BOOKING_REQUESTS_PER_DAY: number;
  FILE_UPLOADS_PER_HOUR: number;
}

interface MonitoringConfig {
  ERROR_REPORTING: boolean;
  PERFORMANCE_MONITORING: boolean;
  USER_ANALYTICS: boolean;
  API_MONITORING: boolean;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
}

interface LoggingConfig {
  enabled: boolean;
  endpoint: string;
  apiKey: string;
  batchSize: number;
  flushInterval: number;
  retryAttempts: number;
  enableConsoleOverride: boolean;
}

interface ErrorReportingConfig {
  enabled: boolean;
  endpoint: string;
  apiKey: string;
  includeStackTrace: boolean;
  includeUserContext: boolean;
  enableSourceMaps: boolean;
  filterSensitiveData: boolean;
}

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  private loadConfiguration(): EnvironmentConfig {
    const env = import.meta.env?.MODE || 'development';
    
    return {
      NODE_ENV: env as 'development' | 'production' | 'staging',
      CLIENT_API_BASE_URL: this.getClientApiUrlForEnv(env),
      CREW_API_BASE_URL: this.getCrewApiUrlForEnv(env),
      WS_URL: this.getWebSocketUrlForEnv(env),
      ENCRYPTION_KEY: import.meta.env?.VITE_ENCRYPTION_KEY || this.generateFallbackKey(),
      DATA_KEY: import.meta.env?.VITE_DATA_KEY || this.generateFallbackKey(),
      SALT: import.meta.env?.VITE_SALT || 'default-salt-change-in-production',
      MAPBOX_TOKEN: import.meta.env?.VITE_MAPBOX_TOKEN || '',
      STRIPE_PUBLIC_KEY: import.meta.env?.VITE_STRIPE_PUBLIC_KEY || '',
      SENTRY_DSN: import.meta.env?.VITE_SENTRY_DSN || '',
      ANALYTICS_ID: import.meta.env?.VITE_ANALYTICS_ID || '',
      FEATURE_FLAGS: this.getFeatureFlags(env),
      SECURITY: this.getSecuritySettings(env),
      RATE_LIMITS: this.getRateLimits(env),
      MONITORING: this.getMonitoringConfig(env),
      LOGGING: this.getLoggingConfig(env),
      ERROR_REPORTING: this.getErrorReportingConfig(env)
    };
  }

  private getClientApiUrlForEnv(env: string): string {
    switch (env) {
      case 'production':
        return import.meta.env.VITE_API_URL_PROD || 'https://client.voidworksgroup.co.uk';
      case 'staging':
        return import.meta.env.VITE_API_URL_STAGING || 'https://staging-api.packersandmovers.com';
      default:
        return import.meta.env.VITE_API_URL_DEV || 'http://localhost:3001';
    }
  }

  private getCrewApiUrlForEnv(env: string): string {
    switch (env) {
      case 'production':
        return import.meta.env.VITE_CREW_API_URL_PROD || 'https://voidworksgroup.co.uk';
      case 'staging':
        return import.meta.env.VITE_CREW_API_URL_STAGING || 'https://staging-crew.packersandmovers.com';
      default:
        return import.meta.env.VITE_CREW_API_URL_DEV || 'http://localhost:3001';
    }
  }

  private getWebSocketUrlForEnv(env: string): string {
    const metaEnv = import.meta.env || {};
    switch (env) {
      case 'production':
        return metaEnv.VITE_WS_URL_PROD || 'wss://ws.packersandmovers.com';
      case 'staging':
        return metaEnv.VITE_WS_URL_STAGING || 'wss://staging-ws.packersandmovers.com';
      default:
        return metaEnv.VITE_WS_URL_DEV || 'ws://localhost:3002';
    }
  }

  private getFeatureFlags(env: string): FeatureFlags {
    const isProd = env === 'production';
    
    return {
      ENABLE_REAL_TIME_TRACKING: this.getBooleanEnv('VITE_ENABLE_REAL_TIME_TRACKING', true),
      ENABLE_VOICE_ASSISTANT: this.getBooleanEnv('VITE_ENABLE_VOICE_ASSISTANT', !isProd),
      ENABLE_AI_ESTIMATES: this.getBooleanEnv('VITE_ENABLE_AI_ESTIMATES', true),
      ENABLE_ADVANCED_ANALYTICS: this.getBooleanEnv('VITE_ENABLE_ADVANCED_ANALYTICS', isProd),
      ENABLE_BETA_FEATURES: this.getBooleanEnv('VITE_ENABLE_BETA_FEATURES', !isProd),
      ENABLE_DEBUG_MODE: this.getBooleanEnv('VITE_ENABLE_DEBUG_MODE', !isProd),
      ENABLE_OFFLINE_MODE: this.getBooleanEnv('VITE_ENABLE_OFFLINE_MODE', false),
      ENABLE_PUSH_NOTIFICATIONS: this.getBooleanEnv('VITE_ENABLE_PUSH_NOTIFICATIONS', isProd)
    };
  }

  private getSecuritySettings(env: string): SecuritySettings {
    const isProd = env === 'production';
    
    return {
      TOKEN_EXPIRY_MS: parseInt(import.meta.env.VITE_TOKEN_EXPIRY_MS) || (isProd ? 3600000 : 7200000),
      REFRESH_THRESHOLD_MS: parseInt(import.meta.env.VITE_REFRESH_THRESHOLD_MS) || 300000,
      MAX_LOGIN_ATTEMPTS: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || (isProd ? 3 : 5),
      LOCKOUT_DURATION_MS: parseInt(import.meta.env.VITE_LOCKOUT_DURATION_MS) || 900000,
      SESSION_TIMEOUT_MS: parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MS) || 1800000,
      CSRF_ENABLED: this.getBooleanEnv('VITE_CSRF_ENABLED', isProd),
      HTTPS_ONLY: this.getBooleanEnv('VITE_HTTPS_ONLY', isProd),
      SECURE_COOKIES: this.getBooleanEnv('VITE_SECURE_COOKIES', isProd)
    };
  }

  private getRateLimits(env: string): RateLimitConfig {
    const isProd = env === 'production';
    
    return {
      API_REQUESTS_PER_MINUTE: parseInt(import.meta.env.VITE_API_REQUESTS_PER_MINUTE) || (isProd ? 60 : 120),
      LOGIN_ATTEMPTS_PER_HOUR: parseInt(import.meta.env.VITE_LOGIN_ATTEMPTS_PER_HOUR) || (isProd ? 5 : 10),
      BOOKING_REQUESTS_PER_DAY: parseInt(import.meta.env.VITE_BOOKING_REQUESTS_PER_DAY) || (isProd ? 10 : 50),
      FILE_UPLOADS_PER_HOUR: parseInt(import.meta.env.VITE_FILE_UPLOADS_PER_HOUR) || (isProd ? 20 : 100)
    };
  }

  private getMonitoringConfig(env: string): MonitoringConfig {
    const isProd = env === 'production';
    
    return {
      ERROR_REPORTING: this.getBooleanEnv('VITE_ERROR_REPORTING', isProd),
      PERFORMANCE_MONITORING: this.getBooleanEnv('VITE_PERFORMANCE_MONITORING', isProd),
      USER_ANALYTICS: this.getBooleanEnv('VITE_USER_ANALYTICS', isProd),
      API_MONITORING: this.getBooleanEnv('VITE_API_MONITORING', true),
      LOG_LEVEL: (import.meta.env?.VITE_LOG_LEVEL as any) || (isProd ? 'error' : 'debug')
    };
  }

  private getLoggingConfig(env: string): LoggingConfig {
    const isProd = env === 'production';
    
    return {
      enabled: this.getBooleanEnv('VITE_LOGGING_ENABLED', isProd),
      endpoint: this.getLoggingEndpoint(env),
      apiKey: import.meta.env.VITE_LOGGING_API_KEY || '',
      batchSize: parseInt(import.meta.env.VITE_LOGGING_BATCH_SIZE) || 10,
      flushInterval: parseInt(import.meta.env.VITE_LOGGING_FLUSH_INTERVAL) || 30000,
      retryAttempts: parseInt(import.meta.env.VITE_LOGGING_RETRY_ATTEMPTS) || 3,
      enableConsoleOverride: this.getBooleanEnv('VITE_LOGGING_CONSOLE_OVERRIDE', !isProd)
    };
  }

  private getErrorReportingConfig(env: string): ErrorReportingConfig {
    const isProd = env === 'production';
    
    return {
      enabled: this.getBooleanEnv('VITE_ERROR_REPORTING_ENABLED', isProd),
      endpoint: this.getErrorReportingEndpoint(env),
      apiKey: import.meta.env.VITE_ERROR_REPORTING_API_KEY || '',
      includeStackTrace: this.getBooleanEnv('VITE_ERROR_INCLUDE_STACK_TRACE', true),
      includeUserContext: this.getBooleanEnv('VITE_ERROR_INCLUDE_USER_CONTEXT', isProd),
      enableSourceMaps: this.getBooleanEnv('VITE_ERROR_ENABLE_SOURCE_MAPS', isProd),
      filterSensitiveData: this.getBooleanEnv('VITE_ERROR_FILTER_SENSITIVE_DATA', true)
    };
  }

  private getLoggingEndpoint(env: string): string {
    switch (env) {
      case 'production':
        return import.meta.env.VITE_LOGGING_ENDPOINT_PROD || 'https://logs.packersandmovers.com/api/logs';
      case 'staging':
        return import.meta.env.VITE_LOGGING_ENDPOINT_STAGING || 'https://staging-logs.packersandmovers.com/api/logs';
      default:
        return import.meta.env.VITE_LOGGING_ENDPOINT_DEV || 'http://localhost:3003/api/logs';
    }
  }

  private getErrorReportingEndpoint(env: string): string {
    switch (env) {
      case 'production':
        return import.meta.env.VITE_ERROR_ENDPOINT_PROD || 'https://errors.packersandmovers.com/api/errors';
      case 'staging':
        return import.meta.env.VITE_ERROR_ENDPOINT_STAGING || 'https://staging-errors.packersandmovers.com/api/errors';
      default:
        return import.meta.env.VITE_ERROR_ENDPOINT_DEV || 'http://localhost:3004/api/errors';
    }
  }

  private getBooleanEnv(key: string, defaultValue: boolean): boolean {
    const value = import.meta.env?.[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  private generateFallbackKey(): string {
    console.warn('Using fallback encryption key. Set proper keys in production!');
    return 'fallback-key-' + Math.random().toString(36).substring(2);
  }

  private validateConfiguration(): void {
    const errors: string[] = [];

    if (this.config.NODE_ENV === 'production') {
      if (this.config.ENCRYPTION_KEY.includes('fallback')) {
        console.warn('Production encryption key not set');
      }
      if (!this.config.SENTRY_DSN) {
        console.warn('Sentry DSN not configured for production');
      }
      if (!this.config.STRIPE_PUBLIC_KEY) {
        console.warn('Stripe public key not configured');
      }
    }

    if (errors.length > 0) {
      console.error('Environment configuration errors:', errors);
    }
  }

  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.config.FEATURE_FLAGS[feature];
  }

  getApiUrl(endpoint: string = '', apiType: 'client' | 'crew' = 'client'): string {
    const baseUrl = apiType === 'client' ? this.config.CLIENT_API_BASE_URL : this.config.CREW_API_BASE_URL;
    return `${baseUrl}${endpoint}`;
  }

  getWebSocketUrl(): string {
    return this.config.WS_URL;
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  getSecurityConfig(): SecuritySettings {
    return { ...this.config.SECURITY };
  }

  getRateLimitConfig(): RateLimitConfig {
    return { ...this.config.RATE_LIMITS };
  }


}

// Export singleton instance
export const environment = EnvironmentManager.getInstance();

// Export types
export type {
  EnvironmentConfig,
  FeatureFlags,
  SecuritySettings,
  RateLimitConfig,
  MonitoringConfig,
  LoggingConfig,
  ErrorReportingConfig
};

// Utility functions
export const env = {
  get: (key: string, defaultValue?: string): string => {
    return import.meta.env[key] || defaultValue || '';
  },
  
  getBoolean: (key: string, defaultValue: boolean = false): boolean => {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  },
  
  getNumber: (key: string, defaultValue: number = 0): number => {
    const value = import.meta.env[key];
    return value ? parseInt(value, 10) : defaultValue;
  },
  
  isProduction: (): boolean => import.meta.env.MODE === 'production',
  isDevelopment: (): boolean => import.meta.env.MODE === 'development',
  isStaging: (): boolean => import.meta.env.MODE === 'staging'
};