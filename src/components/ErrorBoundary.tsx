import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log the error
    logError(error, 'ErrorBoundary');
    
    // Clear potentially corrupted data
    try {
      // Only clear specific keys that might be corrupted
      const keysToCheck = ['user_data', 'booking_data', 'temp_data'];
      keysToCheck.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            JSON.parse(data);
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      // If localStorage is completely broken, clear it
      try {
        localStorage.clear();
      } catch {
        // Ignore if localStorage is not available
      }
    }
  }

  handleReload = () => {
    // Reset error state first
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    // Small delay to ensure state is reset
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">The application encountered an unexpected error. Your data has been cleared for safety.</p>
            
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-left text-sm">
                <p className="font-medium text-red-800 mb-1">Error Details:</p>
                <p className="text-red-700">{this.state.error.message}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Application
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const GlobalErrorBoundary = ErrorBoundary;