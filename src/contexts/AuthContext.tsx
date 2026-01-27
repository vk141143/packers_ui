import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loginClient, logout as authLogout } from '../services/authService';

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
    // Check for existing auth token and user data
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (import.meta.env.DEV) {
      console.log('🔐 AuthContext: Checking stored auth data');
      console.log('Token exists:', !!token);
      console.log('User data exists:', !!userData);
    }
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (import.meta.env.DEV) {
          console.log('🔐 AuthContext: Loaded user from storage:', parsedUser);
        }
        setUser(parsedUser);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to parse user data:', error);
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
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (import.meta.env.DEV) {
          console.log('🔐 AuthContext: Login successful, user:', parsedUser);
        }
        setUser(parsedUser);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('🔐 AuthContext: Login failed:', error);
      }
      throw error;
    }
  };

  const logout = () => {
    if (import.meta.env.DEV) {
      console.log('🔐 AuthContext: Logging out');
    }
    authLogout();
    setUser(null);
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