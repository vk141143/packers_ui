export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleApiError = (error: any): never => {
  if (error instanceof AppError) {
    throw error;
  }

  if (error.response) {
    throw new AppError(
      error.response.data?.message || 'API request failed',
      error.response.status
    );
  }

  if (error.request) {
    throw new AppError('Network error. Please check your connection.', 503);
  }

  throw new AppError(error.message || 'An unexpected error occurred', 500);
};

export const logError = (error: Error, context?: string) => {
  if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
    console.error(`[${context || 'Error'}]:`, error);
  }
};
