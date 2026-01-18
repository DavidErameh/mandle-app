import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';
import { SQLiteService } from './sqlite';
import { LoggerService } from '@/core/utils/LoggerService';

export class SyncService {
  private static db = SQLiteService.getDB();
  private static isProcessing = false;

  /**
   * Checks if sync is possible (active user session + internet)
   */
  static async canSync(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      const isOnline = !!state.isConnected && state.isInternetReachable !== false;
      
      if (!isOnline) return false;

      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      LoggerService.warn('SyncService', `Sync check failed: ${error}`);
      return false;
    }
  }

  /**
   * Silently push changes to Supabase.
   * If offline or fails, it will be queued for later.
   */
  static async pushToCloud<T>(
    tableName: string,
    data: T | T[],
    operation: 'insert' | 'upsert' = 'upsert'
  ): Promise<void> {
    const ready = await this.canSync();

    // Validate table name to prevent SQL injection
    if (!this.isValidTableName(tableName)) {
      LoggerService.error('SyncService', `Invalid table name: ${tableName}`);
      return;
    }

    if (!ready) {
      await this.queueAction(tableName, data, operation);
      return;
    }

    try {
      const query = supabase.from(tableName);

      let error;
      if (operation === 'upsert') {
        ({ error } = await query.upsert(data));
      } else {
        ({ error } = await query.insert(data));
      }

      if (error) throw error;

      LoggerService.info('SyncService', `Successfully synced ${tableName} to cloud`);
    } catch (error) {
      LoggerService.error('SyncService', `Sync failed for ${tableName}, queuing...`, error);
      await this.queueAction(tableName, data, operation);
    }
  }

  /**
   * Add a failed action to the local sync queue
   */
  private static async queueAction<T>(tableName: string, data: T, operation: string) {
    try {
      // Validate inputs to prevent issues
      if (!tableName || !data || !operation) {
        LoggerService.error('SyncService', 'Invalid parameters for queueAction', { tableName, data, operation });
        return;
      }

      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);

      // Validate table name before queuing
      if (!this.isValidTableName(tableName)) {
        LoggerService.error('SyncService', `Invalid table name for queue: ${tableName}`);
        return;
      }

      await this.db.runAsync(
        'INSERT INTO sync_queue (id, table_name, data, operation) VALUES (?, ?, ?, ?)',
        [id, tableName, JSON.stringify(data), operation]
      );
      LoggerService.info('SyncService', `Action queued for ${tableName}`, { id, operation });
    } catch (e) {
      LoggerService.error('SyncService', 'Failed to queue sync action', e);
    }
  }

  /**
   * Process the sync queue. Should be called periodically or when connection returns.
   */
  static async processQueue() {
    if (this.isProcessing) return;

    const ready = await this.canSync();
    if (!ready) return;

    this.isProcessing = true;
    LoggerService.info('SyncService', 'Starting sync queue processing');

    try {
      // Constants for sync queue processing
      const MAX_SYNC_ATTEMPTS = 5;
      const MAX_PENDING_ITEMS = 10;

      const pending: any[] = await this.db.getAllAsync(
        `SELECT * FROM sync_queue WHERE attempts < ${MAX_SYNC_ATTEMPTS} AND (next_retry IS NULL OR next_retry < CURRENT_TIMESTAMP) ORDER BY created_at ASC LIMIT ${MAX_PENDING_ITEMS}`
      );

      for (const item of pending) {
        try {
          const data = JSON.parse(item.data);

          // Validate table name before using it in the query
          if (!this.isValidTableName(item.table_name)) {
            LoggerService.error('SyncService', `Invalid table name in queue: ${item.table_name}`);
            continue;
          }

          const query = supabase.from(item.table_name);

          let error;
          if (item.operation === 'upsert') {
            ({ error } = await query.upsert(data));
          } else {
            ({ error } = await query.insert(data));
          }

          if (error) throw error;

          // Success - remove from queue
          await this.db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
          LoggerService.info('SyncService', `Queue item ${item.id} synced successfully`);
        } catch (error) {
          // Failure - update attempts and backoff
          const attempts = item.attempts + 1;
          const BACKOFF_BASE = 2;
          const backoffMinutes = Math.pow(BACKOFF_BASE, attempts); // 2, 4, 8, 16, 32 minutes

          // Use parameterized query to prevent SQL injection
          await this.db.runAsync(
            'UPDATE sync_queue SET attempts = ?, last_attempt = CURRENT_TIMESTAMP, next_retry = datetime(CURRENT_TIMESTAMP, "+" || ? || " minutes") WHERE id = ?',
            [attempts, backoffMinutes, item.id]
          );
          LoggerService.warn('SyncService', `Queue item ${item.id} failed (attempt ${attempts}). Next retry in ${backoffMinutes}m`);
        }
      }
    } catch (e) {
      LoggerService.error('SyncService', 'Error processing sync queue', e);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Validates table name to prevent SQL injection
   */
  private static isValidTableName(tableName: string): boolean {
    // Whitelist of allowed table names
    const allowedTables = [
      'tweets',
      'notes',
      'content_pillars',
      'brand_profiles',
      'comments',
      'versions',
      'sync_queue',
      'performance_logs',
      'patterns',
      'drafts'
    ];

    return allowedTables.includes(tableName);
  }
}
