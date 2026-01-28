import { environment } from '../config/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  context: string;
  data?: any;
  userId?: string;
  sessionId: string;
}

class LoggingService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupConsoleOverrides();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupConsoleOverrides() {
    if (environment.isDevelopment) return;

    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };

    console.log = (...args) => {
      this.log('info', args.join(' '), 'console');
      originalConsole.log(...args);
    };

    console.warn = (...args) => {
      this.log('warn', args.join(' '), 'console');
      originalConsole.warn(...args);
    };

    console.error = (...args) => {
      this.log('error', args.join(' '), 'console');
      originalConsole.error(...args);
    };

    console.debug = (...args) => {
      this.log('debug', args.join(' '), 'console');
      originalConsole.debug(...args);
    };
  }

  log(level: LogLevel, message: string, context: string, data?: any) {
    const entry: LogEntry = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      level,
      message,
      context,
      data,
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId
    };

    this.addLogEntry(entry);

    if (environment.isDevelopment) {
      this.logToConsole(entry);
    }

    if (level === 'error' || level === 'critical') {
      this.sendLogToServer(entry);
    }
  }

  debug(message: string, context: string, data?: any) {
    this.log('debug', message, context, data);
  }

  info(message: string, context: string, data?: any) {
    this.log('info', message, context, data);
  }

  warn(message: string, context: string, data?: any) {
    this.log('warn', message, context, data);
  }

  error(message: string, context: string, data?: any) {
    this.log('error', message, context, data);
  }

  critical(message: string, context: string, data?: any) {
    this.log('critical', message, context, data);
  }

  private addLogEntry(entry: LogEntry) {
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  private logToConsole(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.context}]`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(prefix, entry.message, entry.data || '');
        break;
      case 'info':
        console.info(prefix, entry.message, entry.data || '');
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case 'error':
      case 'critical':
        console.error(prefix, entry.message, entry.data || '');
        break;
    }
  }

  private async sendLogToServer(entry: LogEntry) {
    const loggingConfig = environment.getLoggingConfig();
    if (!loggingConfig.enabled) return;

    try {
      await fetch(loggingConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggingConfig.apiKey}`
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Fallback to console if server logging fails
      console.error('Failed to send log to server:', error);
    }
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string | undefined {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData).id : undefined;
    } catch {
      return undefined;
    }
  }

  getLogs(level?: LogLevel, context?: string, limit = 100): LogEntry[] {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (context) {
      filteredLogs = filteredLogs.filter(log => log.context === context);
    }

    return filteredLogs.slice(-limit);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
  }

  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<LogLevel, number>,
      byContext: {} as Record<string, number>,
      sessionId: this.sessionId
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byContext[log.context] = (stats.byContext[log.context] || 0) + 1;
    });

    return stats;
  }
}

export const logger = new LoggingService();