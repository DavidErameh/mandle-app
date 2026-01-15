import { SQLiteService } from '@/core/database/sqlite';
import { SyncService } from '@/core/database/sync';
import { DatabaseError } from '@/shared/utils/errors';

export interface ConnectedAccount {
  id: string;
  accountName: string;
  platform: string;
  avatarUrl?: string;
  viralScore: number;
  patterns: { id: string, description: string }[];
}

export class ConnectedAccountRepository {
  async getAll(): Promise<ConnectedAccount[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<{
        id: string, 
        account_name: string, 
        platform: string,
        avatar_url: string,
        viral_score: number,
        patterns: string
      }>(
        `SELECT * FROM connected_accounts`
      );
      
      return rows.map(r => ({
        id: r.id,
        accountName: r.account_name,
        platform: r.platform || 'twitter',
        avatarUrl: r.avatar_url,
        viralScore: r.viral_score || 0,
        patterns: JSON.parse(r.patterns || '[]')
      }));
    } catch (error) {
      console.error('SQLite error fetching accounts:', error);
      return [];
    }
  }

  async saveAccount(account: Partial<ConnectedAccount>): Promise<void> {
    const db = SQLiteService.getDB();
    const id = account.id || crypto.randomUUID();
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO connected_accounts (id, account_name, platform, avatar_url, viral_score, patterns) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id, 
          account.accountName || '', 
          account.platform || 'twitter', 
          account.avatarUrl || '', 
          account.viralScore || 0, 
          JSON.stringify(account.patterns || [])
        ]
      );

      // 2. Sync Supabase (Silent Background)
      SyncService.pushToCloud('connected_accounts', {
        id: id,
        account_name: account.accountName || '',
        platform: account.platform || 'twitter',
        avatar_url: account.avatarUrl || '',
        viral_score: account.viralScore || 0,
        patterns: account.patterns || []
      });
    } catch (e) {
      throw new DatabaseError('Failed to save account');
    }
  }

  async deleteAccount(id: string): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(`DELETE FROM connected_accounts WHERE id = ?`, [id]);
      await db.runAsync(`DELETE FROM viral_inspirations WHERE account_id = ?`, [id]);
    } catch (e) {
      throw new DatabaseError('Failed to delete account');
    }
  }

  async getTweetsByAccountId(accountId: string, limit: number = 10): Promise<any[]> {
    const db = SQLiteService.getDB();
    try {
      return await db.getAllAsync<any>(
        `SELECT * FROM viral_inspirations WHERE account_id = ? ORDER BY engagement_count DESC LIMIT ?`,
        [accountId, limit]
      );
    } catch (e) {
      return [];
    }
  }

  async getViralCount(): Promise<number> {
    const db = SQLiteService.getDB();
    try {
      // Viral tweets from last 48 hours as per PRD
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM viral_inspirations WHERE created_at > ?`,
        [fortyEightHoursAgo]
      );
      return result?.count || 0;
    } catch (e) {
      return 0;
    }
  }

  async saveViralInspiration(inspiration: { id?: string, account_id: string, content: string, engagement_count?: number, platform?: string }): Promise<void> {
    const db = SQLiteService.getDB();
    const id = inspiration.id || crypto.randomUUID();
    try {
      await db.runAsync(
        `INSERT INTO viral_inspirations (id, account_id, content, engagement_count, platform, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, inspiration.account_id, inspiration.content, inspiration.engagement_count || 0, inspiration.platform || 'twitter', new Date().toISOString()]
      );

      // 2. Sync Supabase (Silent Background)
      SyncService.pushToCloud('viral_inspirations', {
        id: id,
        account_id: inspiration.account_id,
        content: inspiration.content,
        engagement_count: inspiration.engagement_count || 0,
        platform: inspiration.platform || 'twitter',
        created_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Failed to save viral inspiration:', e);
    }
  }

  async getRecentViralInspirations(limit: number = 5): Promise<any[]> {
    const db = SQLiteService.getDB();
    try {
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      return await db.getAllAsync<any>(
        `SELECT * FROM viral_inspirations WHERE created_at > ? ORDER BY engagement_count DESC LIMIT ?`,
        [fortyEightHoursAgo, limit]
      );
    } catch (e) {
      return [];
    }
  }
}
