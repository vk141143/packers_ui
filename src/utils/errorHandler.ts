// Enhanced error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
};

export const logError = (error: unknown, context?: string) => {
  const appError = handleError(error);
  
  if (import.meta.env.DEV) {
    console.error(`[${context || 'APP'}] Error:`, {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      stack: appError.stack
    });
  }
  
  // In production, you would send this to your monitoring service
  if (import.meta.env.PROD) {
    // Example: sendToMonitoringService(appError, context);
  }
};

export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
};

export const safeSync = <T>(
  fn: () => T,
  fallback?: T,
  context?: string
): T | undefined => {
  try {
    return fn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
};