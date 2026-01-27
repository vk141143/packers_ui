import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { GlobalErrorBoundary } from './components/ErrorBoundary'
import App from './App.tsx'
import './index.css'
import { logError } from './utils/errorHandler'

// Enhanced QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

// Global error handlers
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'error') {
    logError(event.error, 'QueryClient');
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === 'error') {
    logError(event.error, 'QueryClient-Mutation');
  }
});
window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason, 'UnhandledPromiseRejection');
  event.preventDefault();
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  logError(event.error, 'UncaughtError');
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
