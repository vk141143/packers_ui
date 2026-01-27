import React, { useState, useEffect, useCallback } from 'react';
import { Shield, AlertTriangle, Clock, Wifi, WifiOff } from 'lucide-react';
import { ErrorBoundary, useSafeAsync } from './ErrorBoundary';

interface SafetyConfig {
  timeout?: number;
  retryAttempts?: number;
  requireNetwork?: boolean;
  criticalOperation?: boolean;
  fallbackComponent?: React.ReactNode;
}

interface RuntimeSafetyProps {
  children: React.ReactNode;
  config?: SafetyConfig;
  onError?: (error: Error) => void;
}

// Network status hook
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Timeout wrapper for operations
const useOperationTimeout = (timeout: number = 30000) => {
  const [isTimedOut, setIsTimedOut] = useState(false);

  const executeWithTimeout = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setIsTimedOut(false);
    
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          setIsTimedOut(true);
          reject(new Error(`Operation timed out after ${timeout}ms`));
        }, timeout);
      })
    ]);
  }, [timeout]);

  return { executeWithTimeout, isTimedOut };
};

// Main runtime safety wrapper
export const RuntimeSafety: React.FC<RuntimeSafetyProps> = ({
  children,
  config = {},
  onError
}) => {
  const {
    timeout = 30000,
    retryAttempts = 3,
    requireNetwork = false,
    criticalOperation = false,
    fallbackComponent
  } = config;

  const isOnline = useNetworkStatus();
  const { executeWithTimeout, isTimedOut } = useOperationTimeout(timeout);
  const { executeAsync } = useSafeAsync();
  
  const [operationState, setOperationState] = useState<{
    isLoading: boolean;
    error: Error | null;
    retryCount: number;
  }>({
    isLoading: false,
    error: null,
    retryCount: 0
  });

  // Network requirement check
  if (requireNetwork && !isOnline) {
    return (
      <div className="flex items-center justify-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-center">
          <WifiOff className="mx-auto text-yellow-600 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Network Required
          </h3>
          <p className="text-yellow-700">
            This operation requires an internet connection. Please check your network and try again.
          </p>
        </div>
      </div>
    );
  }

  // Timeout indicator
  if (isTimedOut) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <Clock className="mx-auto text-red-600 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Operation Timed Out
          </h3>
          <p className="text-red-700 mb-4">
            The operation took too long to complete. This might be due to network issues or server problems.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Critical operation wrapper
  if (criticalOperation) {
    return (
      <ErrorBoundary
        onError={onError}
        fallback={
          fallbackComponent || (
            <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-center">
                <Shield className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Critical Operation Failed
                </h3>
                <p className="text-red-700 mb-4">
                  A critical system operation has failed. Please contact support immediately.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          )
        }
      >
        {children}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

// Safe operation executor component
interface SafeOperationProps {
  operation: () => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  children: (execute: () => void, state: {
    isLoading: boolean;
    error: Error | null;
    result: any;
  }) => React.ReactNode;
}

export const SafeOperation: React.FC<SafeOperationProps> = ({
  operation,
  onSuccess,
  onError,
  loadingComponent,
  errorComponent,
  children
}) => {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: Error | null;
    result: any;
  }>({
    isLoading: false,
    error: null,
    result: null
  });

  const { executeAsync } = useSafeAsync();

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const result = await executeAsync(operation, (error) => {
      setState(prev => ({ ...prev, error, isLoading: false }));
      onError?.(error);
    });

    if (result !== null) {
      setState(prev => ({ ...prev, result, isLoading: false }));
      onSuccess?.(result);
    }
  }, [operation, executeAsync, onSuccess, onError]);

  if (state.isLoading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  if (state.error && errorComponent) {
    return <>{errorComponent}</>;
  }

  return <>{children(execute, state)}</>;
};

// Memory leak prevention hook
export const useMemoryLeakPrevention = () => {
  const timeoutsRef = React.useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = React.useRef<Set<NodeJS.Timeout>>(new Set());
  const abortControllersRef = React.useRef<Set<AbortController>>(new Set());

  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      callback();
      timeoutsRef.current.delete(timeoutId);
    }, delay);
    
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  const safeSetInterval = useCallback((callback: () => void, delay: number) => {
    const intervalId = setInterval(callback, delay);
    intervalsRef.current.add(intervalId);
    return intervalId;
  }, []);

  const createAbortController = useCallback(() => {
    const controller = new AbortController();
    abortControllersRef.current.add(controller);
    return controller;
  }, []);

  const cleanup = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current.clear();

    // Clear all intervals
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current.clear();

    // Abort all controllers
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    safeSetTimeout,
    safeSetInterval,
    createAbortController,
    cleanup
  };
};

// Performance monitoring component
export const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure' && entry.duration > 1000) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};