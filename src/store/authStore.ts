import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { useState, useEffect } from 'react';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthStore {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false
  };
  
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  getState() {
    return { ...this.state };
  }

  login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.state.isLoading = true;
    this.notify();

    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          this.state = {
            user,
            isAuthenticated: true,
            isLoading: false
          };
          this.notify();
          resolve({ success: true });
        } else {
          this.state.isLoading = false;
          this.notify();
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 1000);
    });
  }

  logout() {
    this.state = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    };
    this.notify();
  }

  // Demo method to switch user roles
  switchRole(role: UserRole) {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      this.state.user = user;
      this.notify();
    }
  }

  hasRole(roles: UserRole[]): boolean {
    return this.state.user ? roles.includes(this.state.user.role) : false;
  }
}

export const authStore = new AuthStore();

export const useAuthStore = () => {
  const [state, setState] = useState(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setState(authStore.getState());
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    login: authStore.login.bind(authStore),
    logout: authStore.logout.bind(authStore),
    switchRole: authStore.switchRole.bind(authStore),
    hasRole: authStore.hasRole.bind(authStore)
  };
};