import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loginClient, logout as authLogout } from '../services/authService';
import { logError, safeSync } from '../utils/errorHandler';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Safely check for existing auth token and user data
    const token = safeSync(() => localStorage.getItem('access_token'), null, 'AuthContext-getToken');
    const userData = safeSync(() => localStorage.getItem('user_data'), null, 'AuthContext-getUserData');
    
    if (import.meta.env.DEV) {
      console.log('🔐 AuthContext: Checking stored auth data');
      console.log('Token exists:', !!token);
      console.log('User data exists:', !!userData);
    }
    
    if (token && userData) {
      const parsedUser = safeSync(() => {
        const parsed = JSON.parse(userData);
        // Validate user object structure
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.email && parsed.role) {
          return parsed;
        }
        throw new Error('Invalid user data structure');
      }, null, 'AuthContext-parseUser');
      
      if (parsedUser) {
        if (import.meta.env.DEV) {
          console.log('🔐 AuthContext: Loaded user from storage:', parsedUser);
        }
        setUser(parsedUser);
      } else {
        // Invalid user data - clear auth
        if (import.meta.env.DEV) {
          console.log('🔐 AuthContext: Invalid user data - clearing auth');
        }
        authLogout();
      }
    } else if (token && !userData) {
      // Token exists but no user data - clear all auth data
      if (import.meta.env.DEV) {
        console.log('🔐 AuthContext: Token exists but no user data - clearing auth data');
      }
      authLogout();
    } else {
      if (import.meta.env.DEV) {
        console.log('🔐 AuthContext: No stored auth data found');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (import.meta.env.DEV) {
      console.log('🔐 AuthContext: Attempting login for:', email);
    }
    
    try {
      // Use the authService login function
      await loginClient(email, password);
      
      // Reload user data from localStorage
      const userData = safeSync(() => localStorage.getItem('user_data'), null, 'AuthContext-loginGetUserData');
      if (userData) {
        const parsedUser = safeSync(() => JSON.parse(userData), null, 'AuthContext-loginParseUser');
        if (parsedUser) {
          if (import.meta.env.DEV) {
            console.log('🔐 AuthContext: Login successful, user:', parsedUser);
          }
          setUser(parsedUser);
        } else {
          throw new Error('Failed to parse user data after login');
        }
      } else {
        throw new Error('No user data found after login');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('🔐 AuthContext: Login failed:', error);
      }
      logError(error, 'AuthContext-login');
      throw error;
    }
  };

  const logout = () => {
    if (import.meta.env.DEV) {
      console.log('🔐 AuthContext: Logging out');
    }
    try {
      authLogout();
      setUser(null);
    } catch (error) {
      logError(error, 'AuthContext-logout');
      // Force logout even if there's an error
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};