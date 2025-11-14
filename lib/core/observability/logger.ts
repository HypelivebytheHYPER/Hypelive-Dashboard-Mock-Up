/**
 * Logger Utility
 * Centralized logging with structured data support
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Structured log data type
 * Use specific types when possible instead of Record<string, unknown>
 */
export type LogData = Record<string, unknown>;

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  level_name: string;
  message: string;
  data?: LogData;
  error?: Error;
  context?: string;
  user_id?: string;
  session_id?: string;
  request_id?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enable_console: boolean;
  enable_file: boolean;
  enable_remote: boolean;
  context?: string;
  service_name: string;
  environment: 'development' | 'staging' | 'production';
}

class Logger {
  private config: LoggerConfig;
  private static instance: Logger;

  private constructor(config: LoggerConfig) {
    this.config = config;
  }

  public static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      if (!config) {
        config = {
          level: LogLevel.INFO,
          enable_console: true,
          enable_file: false,
          enable_remote: false,
          service_name: 'hypelive-dashboard',
          environment: 'development'
        };
      }
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  /**
   * Log debug message
   * @param message - Debug message
   * @param data - Optional structured data
   * @param context - Optional context identifier
   */
  public debug(message: string, data?: LogData, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, undefined, context);
  }

  /**
   * Log info message
   * @param message - Info message
   * @param data - Optional structured data
   * @param context - Optional context identifier
   */
  public info(message: string, data?: LogData, context?: string): void {
    this.log(LogLevel.INFO, message, data, undefined, context);
  }

  /**
   * Log warning message
   * @param message - Warning message
   * @param data - Optional structured data
   * @param error - Optional error object
   * @param context - Optional context identifier
   */
  public warn(message: string, data?: LogData, error?: Error, context?: string): void {
    this.log(LogLevel.WARN, message, data, error, context);
  }

  /**
   * Log error message
   * @param message - Error message
   * @param data - Optional structured data
   * @param error - Optional error object
   * @param context - Optional context identifier
   */
  public error(message: string, data?: LogData, error?: Error, context?: string): void {
    this.log(LogLevel.ERROR, message, data, error, context);
  }

  /**
   * Core logging method
   * @param level - Log level
   * @param message - Log message
   * @param data - Optional structured data
   * @param error - Optional error object
   * @param context - Optional context identifier
   */
  private log(
    level: LogLevel,
    message: string,
    data?: LogData,
    error?: Error,
    context?: string
  ): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      level_name: LogLevel[level],
      message,
      data,
      error,
      context: context || this.config.context,
      user_id: this.getCurrentUserId(),
      session_id: this.getSessionId(),
      request_id: this.getRequestId()
    };

    // Console logging
    if (this.config.enable_console) {
      this.logToConsole(entry);
    }

    // File logging
    if (this.config.enable_file) {
      this.logToFile(entry);
    }

    // Remote logging
    if (this.config.enable_remote) {
      this.logToRemote(entry);
    }
  }

  /**
   * Log to console with structured formatting
   */
  private logToConsole(entry: LogEntry): void {
    const color = this.getColorForLevel(entry.level);
    const reset = '\x1b[0m';
    
    const baseMessage = `${color}[${entry.level_name}]${reset} [${entry.timestamp}] ${entry.message}`;
    
    if (entry.context) {
      console.log(`${baseMessage} [${entry.context}]`);
    } else {
      console.log(baseMessage);
    }

    if (entry.data && Object.keys(entry.data).length > 0) {
      console.log('  Data:', JSON.stringify(entry.data, null, 2));
    }

    if (entry.error) {
      console.log('  Error:', entry.error.message);
      if (entry.error.stack) {
        console.log('  Stack:', entry.error.stack);
      }
    }

    if (entry.user_id || entry.session_id || entry.request_id) {
      const identifiers = [];
      if (entry.user_id) identifiers.push(`User: ${entry.user_id}`);
      if (entry.session_id) identifiers.push(`Session: ${entry.session_id}`);
      if (entry.request_id) identifiers.push(`Request: ${entry.request_id}`);
      console.log(`  ${identifiers.join(', ')}`);
    }
  }

  /**
   * Log to file (placeholder for file logging implementation)
   */
  private logToFile(entry: LogEntry): void {
    // File logging implementation would go here
    // This could use a library like winston or pino for better file handling
    try {
      const logLine = JSON.stringify(entry) + '\n';
      // In a real implementation, this would write to a log file
      // For now, we'll just indicate that file logging is enabled
      if (this.config.environment === 'development') {
        console.log('[FILE LOG]', logLine);
      }
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Log to remote service (placeholder for remote logging implementation)
   */
  private async logToRemote(entry: LogEntry): Promise<void> {
    // Remote logging implementation would go here
    // This could send logs to services like LogRocket, Sentry, or custom logging service
    try {
      // In a real implementation, this would send to a remote logging service
      if (this.config.environment === 'development') {
        console.log('[REMOTE LOG]', JSON.stringify(entry));
      }
    } catch (error) {
      console.error('Failed to send to remote logging service:', error);
    }
  }

  /**
   * Get color code for log level
   */
  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '\x1b[36m'; // Cyan
      case LogLevel.INFO:
        return '\x1b[32m'; // Green
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      default:
        return '\x1b[0m'; // Reset
    }
  }

  /**
   * Get current user ID from auth context
   */
  private getCurrentUserId(): string | undefined {
    // This would typically come from your auth system
    // For now, return undefined or a mock value
    if (typeof window !== 'undefined') {
      // Client-side: get from localStorage, sessionStorage, or auth context
      return localStorage.getItem('user_id') || undefined;
    }
    // Server-side: get from request context or session
    return process.env.CURRENT_USER_ID || undefined;
  }

  /**
   * Get session ID
   */
  private getSessionId(): string | undefined {
    if (typeof window !== 'undefined') {
      // Client-side: get from sessionStorage or generate new one
      let sessionId = sessionStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('session_id', sessionId);
      }
      return sessionId;
    }
    // Server-side: get from request context
    return process.env.SESSION_ID || undefined;
  }

  /**
   * Get request ID
   */
  private getRequestId(): string | undefined {
    if (typeof window !== 'undefined') {
      // Client-side: generate request ID for each log entry
      return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    // Server-side: get from request context
    return process.env.REQUEST_ID || undefined;
  }

  /**
   * Update logger configuration
   */
  public updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  public getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Create a child logger with additional context
   */
  public child(context: string): Logger {
    const childConfig = {
      ...this.config,
      context: this.config.context ? `${this.config.context}.${context}` : context
    };
    return new Logger(childConfig);
  }

  /**
   * Log performance metrics
   * @param operation - Operation name
   * @param duration - Duration in milliseconds
   * @param metadata - Additional performance metadata
   */
  public logPerformance(operation: string, duration: number, metadata?: LogData): void {
    this.info(`Performance: ${operation} completed`, {
      operation,
      duration_ms: duration,
      duration_human: `${duration}ms`,
      ...metadata
    }, 'performance');
  }

  /**
   * Log API calls
   * @param method - HTTP method
   * @param url - API endpoint URL
   * @param status - HTTP status code
   * @param duration - Request duration in milliseconds
   * @param metadata - Additional API call metadata
   */
  public logApiCall(method: string, url: string, status: number, duration: number, metadata?: LogData): void {
    const logLevel = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(logLevel, `API ${method} ${url} ${status}`, {
      method,
      url,
      status,
      duration_ms: duration,
      ...metadata
    }, undefined, 'api');
  }

  /**
   * Log database queries
   * @param query - SQL query string
   * @param duration - Query duration in milliseconds
   * @param metadata - Additional query metadata
   */
  public logDatabaseQuery(query: string, duration: number, metadata?: LogData): void {
    const logLevel = duration > 1000 ? LogLevel.WARN : LogLevel.DEBUG;
    this.log(logLevel, `Database query executed`, {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration_ms: duration,
      ...metadata
    }, undefined, 'database');
  }

  /**
   * Log security events
   * @param event - Security event description
   * @param userId - Optional user ID associated with the event
   * @param metadata - Additional security event metadata
   */
  public logSecurityEvent(event: string, userId?: string, metadata?: LogData): void {
    this.warn(`Security event: ${event}`, {
      event,
      user_id: userId,
      ...metadata
    }, undefined, 'security');
  }

  /**
   * Log business events
   * @param event - Business event description
   * @param metadata - Additional business event metadata
   */
  public logBusinessEvent(event: string, metadata?: LogData): void {
    this.info(`Business event: ${event}`, metadata, 'business');
  }
}

// Create default logger instance
const logger = Logger.getInstance({
  level: LogLevel.INFO,
  enable_console: true,
  enable_file: false,
  enable_remote: false,
  service_name: 'hypelive-dashboard',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
});

export { logger, Logger, LogLevel };
export type { LogEntry, LoggerConfig };