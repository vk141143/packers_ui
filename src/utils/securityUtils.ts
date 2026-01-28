import CryptoJS from 'crypto-js';

interface TokenPayload {
  userId: string;
  role: string;
  exp: number;
  iat: number;
}

interface SecurityConfig {
  tokenExpiry: number;
  refreshThreshold: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

class SecureTokenManager {
  private static instance: SecureTokenManager;
  private readonly config: SecurityConfig = {
    tokenExpiry: 3600000, // 1 hour
    refreshThreshold: 300000, // 5 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 900000 // 15 minutes
  };

  private constructor() {}

  static getInstance(): SecureTokenManager {
    if (!SecureTokenManager.instance) {
      SecureTokenManager.instance = new SecureTokenManager();
    }
    return SecureTokenManager.instance;
  }

  generateSecureToken(payload: Omit<TokenPayload, 'exp' | 'iat'>): string {
    const now = Date.now();
    const tokenData: TokenPayload = {
      ...payload,
      iat: now,
      exp: now + this.config.tokenExpiry
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(tokenData),
      this.getEncryptionKey()
    ).toString();

    return btoa(encrypted);
  }

  validateToken(token: string): TokenPayload | null {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        atob(token),
        this.getEncryptionKey()
      ).toString(CryptoJS.enc.Utf8);

      const payload: TokenPayload = JSON.parse(decrypted);
      
      if (Date.now() > payload.exp) {
        this.clearToken();
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  isTokenExpiringSoon(token: string): boolean {
    const payload = this.validateToken(token);
    if (!payload) return true;
    
    return (payload.exp - Date.now()) < this.config.refreshThreshold;
  }

  refreshToken(currentToken: string): string | null {
    const payload = this.validateToken(currentToken);
    if (!payload) return null;

    return this.generateSecureToken({
      userId: payload.userId,
      role: payload.role
    });
  }

  private getEncryptionKey(): string {
    return import.meta.env.VITE_ENCRYPTION_KEY || 'fallback-key-change-in-production';
  }

  storeToken(token: string): void {
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('token_timestamp', Date.now().toString());
  }

  getStoredToken(): string | null {
    const token = sessionStorage.getItem('auth_token');
    const timestamp = sessionStorage.getItem('token_timestamp');
    
    if (!token || !timestamp) return null;
    
    const age = Date.now() - parseInt(timestamp);
    if (age > this.config.tokenExpiry) {
      this.clearToken();
      return null;
    }
    
    return token;
  }

  clearToken(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('token_timestamp');
    localStorage.removeItem('login_attempts');
    localStorage.removeItem('lockout_until');
  }
}

class SecurityValidator {
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
    if (!/\d/.test(password)) errors.push('Password must contain number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character');
    
    return { valid: errors.length === 0, errors };
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
}

class RateLimiter {
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map();

  static checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  static getRemainingAttempts(identifier: string, maxAttempts: number = 5): number {
    const record = this.attempts.get(identifier);
    if (!record || Date.now() > record.resetTime) return maxAttempts;
    return Math.max(0, maxAttempts - record.count);
  }

  static clearAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

class CSRFProtection {
  private static token: string | null = null;

  static generateCSRFToken(): string {
    this.token = CryptoJS.lib.WordArray.random(32).toString();
    sessionStorage.setItem('csrf_token', this.token);
    return this.token;
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token && token === this.token;
  }

  static getCSRFToken(): string | null {
    return sessionStorage.getItem('csrf_token');
  }
}

export const securityUtils = {
  tokenManager: SecureTokenManager.getInstance(),
  validator: SecurityValidator,
  rateLimiter: RateLimiter,
  csrf: CSRFProtection,
  
  hashPassword: (password: string): string => {
    return CryptoJS.SHA256(password + import.meta.env.VITE_SALT).toString();
  },

  generateSecureId: (): string => {
    return CryptoJS.lib.WordArray.random(16).toString();
  },

  encryptSensitiveData: (data: string): string => {
    return CryptoJS.AES.encrypt(data, import.meta.env.VITE_DATA_KEY || 'fallback').toString();
  },

  decryptSensitiveData: (encryptedData: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, import.meta.env.VITE_DATA_KEY || 'fallback');
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  },

  logSecurityEvent: (event: string, details: Record<string, any> = {}): void => {
    console.warn(`[SECURITY] ${event}:`, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...details
    });
  }
};

export type { TokenPayload, SecurityConfig };