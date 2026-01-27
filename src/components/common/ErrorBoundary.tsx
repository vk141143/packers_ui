import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug, Shield } from 'lucide-react';

type ErrorType = 'validation' | 'runtime' | 'network' | 'permission' | 'unknown';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorType: ErrorType;
  retryCount: number;
}

interface ValidationError extends Error {
  field?: string;
  code?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorType: 'unknown',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorType = ErrorBoundary.categorizeError(error);
    return { 
      hasError: true, 
      error,
      errorType
    };
  }

  static categorizeError(error: Error): ErrorType {
    if (error.name === 'ValidationError' || error.message.includes('validation')) {
      return 'validation';
    }
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'network';
    }
    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return 'permission';
    }
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return 'runtime';
    }
    return 'unknown';
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    console.error('Error boundary caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      type: this.state.errorType
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // In production, send to error reporting service
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Error reporting logic
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      type: this.state.errorType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Send to monitoring service (e.g., Sentry, LogRocket)
    console.log('Error report:', errorReport);
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      window.location.reload();
    }
  };

  private getErrorIcon = () => {
    switch (this.state.errorType) {
      case 'validation': return <Shield className="text-yellow-500" size={48} />;
      case 'network': return <RefreshCw className="text-blue-500" size={48} />;
      case 'permission': return <Shield className="text-red-500" size={48} />;
      default: return <Bug className="text-red-500" size={48} />;
    }
  };

  private getErrorMessage = () => {
    switch (this.state.errorType) {
      case 'validation':
        return {
          title: 'Form Validation Error',
          message: 'Please check your input and try again.',
          action: 'Fix Input'
        };
      case 'network':
        return {
          title: 'Connection Error',
          message: 'Unable to connect to our servers. Please check your internet connection.',
          action: 'Retry'
        };
      case 'permission':
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
          action: 'Go Back'
        };
      default:
        return {
          title: 'Something went wrong',
          message: 'An unexpected error occurred. Our team has been notified.',
          action: this.state.retryCount < this.maxRetries ? 'Try Again' : 'Refresh Page'
        };
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorDetails = this.getErrorMessage();
      const canRetry = this.state.errorType !== 'permission';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              {this.getErrorIcon()}
              <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                {errorDetails.title}
              </h2>
              <p className="text-gray-600">
                {errorDetails.message}
              </p>
            </div>

            {this.state.errorType === 'validation' && this.state.error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-yellow-800 font-medium">Validation Issue</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      {this.state.error.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {this.props.showDetails && this.state.error && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                  <div><strong>Error:</strong> {this.state.error.message}</div>
                  {this.state.error.stack && (
                    <div className="mt-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  {errorDetails.action}
                  {this.state.retryCount > 0 && ` (${this.state.retryCount}/${this.maxRetries})`}
                </button>
              )}
              
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>

            {this.state.retryCount >= this.maxRetries && (
              <p className="text-center text-sm text-gray-500 mt-4">
                If the problem persists, please contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Form validation error boundary
export class FormErrorBoundary extends ErrorBoundary {
  static createValidationError(field: string, message: string): ValidationError {
    const error = new Error(message) as ValidationError;
    error.name = 'ValidationError';
    error.field = field;
    return error;
  }
}

// Hook for safe async operations
export const useSafeAsync = () => {
  const executeAsync = async <T>(
    asyncFn: () => Promise<T>,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
      console.error('Safe async operation failed:', err);
      return null;
    }
  };

  return { executeAsync };
};

// Validation utilities
export const validateRequired = (value: any, fieldName: string) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    throw FormErrorBoundary.createValidationError(fieldName, `${fieldName} is required`);
  }
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw FormErrorBoundary.createValidationError('email', 'Please enter a valid email address');
  }
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    throw FormErrorBoundary.createValidationError('phone', 'Please enter a valid phone number');
  }
};