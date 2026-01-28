import { environment } from '../config/environment';

export interface ErrorReport {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  code?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: string;
  userId?: string;
  userAgent: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface UserFeedback {
  errorId: string;
  feedback: string;
  email?: string;
  timestamp: number;
}

class ErrorMonitoringService {
  private errorQueue: ErrorReport[] = [];
  private isOnline = navigator.onLine;
  private maxQueueSize = 50;

  constructor() {
    this.setupEventListeners();
    this.startPeriodicFlush();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, 'unhandledRejection', 'high');
    });

    window.addEventListener('error', (event) => {
      this.captureError(event.error, 'globalError', 'high');
    });
  }

  captureError(
    error: Error | string | unknown,
    context: string,
    severity: ErrorReport['severity'] = 'medium',
    metadata?: Record<string, any>
  ): string {
    const errorId = this.generateErrorId();
    const errorObj = this.normalizeError(error);
    
    const report: ErrorReport = {
      id: errorId,
      timestamp: Date.now(),
      message: errorObj.message,
      stack: errorObj.stack,
      code: errorObj.code,
      severity,
      context,
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      metadata: {
        ...metadata,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString(),
      }
    };

    this.addToQueue(report);
    
    if (environment.isDevelopment) {
      console.error(`[ErrorMonitoring] ${context}:`, report);
    }

    return errorId;
  }

  private normalizeError(error: unknown): { message: string; stack?: string; code?: string } {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      };
    }
    
    if (typeof error === 'string') {
      return { message: error };
    }
    
    return { message: 'Unknown error occurred' };
  }

  private addToQueue(report: ErrorReport) {
    this.errorQueue.push(report);
    
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    if (this.isOnline && report.severity === 'critical') {
      this.sendErrorReport(report);
    }
  }

  private async sendErrorReport(report: ErrorReport): Promise<boolean> {
    if (!environment.errorReporting.enabled) return false;

    try {
      const response = await fetch(environment.errorReporting.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${environment.errorReporting.apiKey}`
        },
        body: JSON.stringify(report)
      });

      return response.ok;
    } catch (error) {
      console.warn('Failed to send error report:', error);
      return false;
    }
  }

  private async flushErrorQueue() {
    if (!this.isOnline || this.errorQueue.length === 0) return;

    const batch = this.errorQueue.splice(0, 10);
    
    try {
      await Promise.all(batch.map(report => this.sendErrorReport(report)));
    } catch (error) {
      this.errorQueue.unshift(...batch);
    }
  }

  private startPeriodicFlush() {
    setInterval(() => {
      if (this.isOnline) {
        this.flushErrorQueue();
      }
    }, 30000);
  }

  async submitUserFeedback(errorId: string, feedback: string, email?: string): Promise<boolean> {
    const userFeedback: UserFeedback = {
      errorId,
      feedback,
      email,
      timestamp: Date.now()
    };

    try {
      const response = await fetch(`${environment.errorReporting.endpoint}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${environment.errorReporting.apiKey}`
        },
        body: JSON.stringify(userFeedback)
      });

      return response.ok;
    } catch (error) {
      console.warn('Failed to submit user feedback:', error);
      return false;
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string | undefined {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData).id : undefined;
    } catch {
      return undefined;
    }
  }

  getErrorStats() {
    return {
      queueSize: this.errorQueue.length,
      isOnline: this.isOnline,
      recentErrors: this.errorQueue.slice(-5)
    };
  }
}

export const errorMonitoring = new ErrorMonitoringService();