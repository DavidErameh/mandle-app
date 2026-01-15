import { SQLiteService } from '@/core/database/sqlite';

type LogLevel = 'info' | 'warn' | 'error' | 'fatal';

export class LoggerService {
  private static db = SQLiteService.getDB();
  private static readonly MAX_LOG_LENGTH = 10000; // Limit log message length

  static async log(level: LogLevel, module: string, message: string, stackTrace?: string, additionalData?: Record<string, any>) {
    // Truncate long messages to prevent database bloat
    let processedMessage = message;
    if (processedMessage.length > this.MAX_LOG_LENGTH) {
      processedMessage = processedMessage.substring(0, this.MAX_LOG_LENGTH) + '... [TRUNCATED]';
    }

    // 1. Console log for development
    if (__DEV__) {
      const color = level === 'error' || level === 'fatal' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[32m';
      console.log(`${color}[${level.toUpperCase()}] [${module}] ${processedMessage}\x1b[0m`);
      if (stackTrace) console.log(stackTrace);
      if (additionalData) console.log('Additional Data:', additionalData);
    }

    // 2. Persist to SQLite
    try {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const dataString = additionalData ? JSON.stringify(additionalData) : null;

      await this.db.runAsync(
        'INSERT INTO app_logs (id, level, module, message, stack_trace, data) VALUES (?, ?, ?, ?, ?, ?)',
        [id, level, module, processedMessage, stackTrace || null, dataString]
      );
    } catch (e) {
      // Fallback to console if DB logging fails
      console.error('Failed to persist log to SQLite:', e);
      console.error(`[${level.toUpperCase()}] [${module}] ${processedMessage}`);
    }
  }

  static info(module: string, message: string, additionalData?: Record<string, any>) {
    this.log('info', module, message, undefined, additionalData);
  }

  static warn(module: string, message: string, additionalData?: Record<string, any>) {
    this.log('warn', module, message, undefined, additionalData);
  }

  static error(module: string, message: string, error?: any, additionalData?: Record<string, any>) {
    const stack = error instanceof Error ? error.stack : (error ? JSON.stringify(error) : undefined);
    this.log('error', module, message, stack, additionalData);
  }

  static fatal(module: string, message: string, error?: any, additionalData?: Record<string, any>) {
    const stack = error instanceof Error ? error.stack : (error ? JSON.stringify(error) : undefined);
    this.log('fatal', module, message, stack, additionalData);
  }

  /**
   * Retrieve logs from the database
   */
  static async getLogs(limit: number = 100, level?: LogLevel) {
    try {
      let query = 'SELECT * FROM app_logs ORDER BY timestamp DESC LIMIT ?';
      let params: (string | number)[] = [limit];

      if (level) {
        query = 'SELECT * FROM app_logs WHERE level = ? ORDER BY timestamp DESC LIMIT ?';
        params = [level, limit];
      }

      const logs = await this.db.getAllAsync(query, params) as any[];
      return logs;
    } catch (e) {
      console.error('Failed to retrieve logs from SQLite:', e);
      return [];
    }
  }

  /**
   * Clear old logs to prevent database bloat
   */
  static async cleanupLogs(maxAgeDays: number = 30) {
    try {
      const cutoffDate = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000).toISOString();
      await this.db.runAsync(
        'DELETE FROM app_logs WHERE timestamp < ?',
        [cutoffDate]
      );
      console.log(`Cleaned up logs older than ${maxAgeDays} days`);
    } catch (e) {
      console.error('Failed to cleanup logs:', e);
    }
  }
}
