export class ProductionError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ProductionError';
  }
}

export const handleApiError = (error: any, context: string): never => {
  if (error.name === 'ProductionError') {
    throw error;
  }

  // Network errors
  if (!navigator.onLine) {
    throw new ProductionError(
      'No internet connection. Please check your network and try again.',
      'NETWORK_ERROR'
    );
  }

  // HTTP errors
  if (error.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    throw new ProductionError(
      'Your session has expired. Please login again.',
      'AUTH_ERROR',
      401
    );
  }

  if (error.status === 403) {
    throw new ProductionError(
      'You do not have permission to perform this action.',
      'PERMISSION_ERROR',
      403
    );
  }

  if (error.status === 404) {
    throw new ProductionError(
      'The requested resource was not found.',
      'NOT_FOUND_ERROR',
      404
    );
  }

  if (error.status >= 500) {
    throw new ProductionError(
      'Server error. Please try again later or contact support.',
      'SERVER_ERROR',
      error.status
    );
  }

  // Generic error
  throw new ProductionError(
    `An error occurred in ${context}. Please try again.`,
    'GENERIC_ERROR'
  );
};

export const logError = (error: Error, context: string) => {
  // Only log in development
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
  
  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    // TODO: Integrate with monitoring service (e.g., Sentry)
    // sendToMonitoring(error, context);
  }
};