import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorMonitoring } from '../../services/errorMonitoring';
import { ErrorFeedback } from '../common/ErrorFeedback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  showFeedback: boolean;
}

export class ProductionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      showFeedback: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = errorMonitoring.captureError(
      error,
      this.props.context || 'ErrorBoundary',
      'high',
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    );

    this.setState({ errorId });
    this.clearCorruptedData();
  }

  private clearCorruptedData() {
    try {
      const keysToCheck = ['user_data', 'booking_data', 'temp_data', 'form_data'];
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
    } catch {
      try {
        localStorage.clear();
      } catch {
        // Ignore if localStorage is not available
      }
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
    setTimeout(() => window.location.reload(), 100);
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorId: undefined,
      showFeedback: false 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-6">
                The application encountered an unexpected error. We've been notified and are working on a fix.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reload Page
                </button>
                
                {this.state.errorId && (
                  <button
                    onClick={() => this.setState({ showFeedback: true })}
                    className="w-full text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Report Issue
                  </button>
                )}
              </div>
              
              {this.state.errorId && (
                <p className="text-xs text-gray-500 mt-4">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>
          </div>
          
          {this.state.showFeedback && this.state.errorId && (
            <ErrorFeedback
              errorId={this.state.errorId}
              onClose={() => this.setState({ showFeedback: false })}
            />
          )}
        </>
      );
    }

    return this.props.children;
  }
}