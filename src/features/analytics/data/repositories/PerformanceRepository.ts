import { SQLiteService } from '@/core/database/sqlite';
import { SyncService } from '@/core/database/sync';
import { DatabaseError } from '@/shared/utils/errors';
import { PerformanceLog } from '../../domain/entities/PerformanceLog';

export class PerformanceRepository {
  async save(log: PerformanceLog): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(
        `INSERT INTO performance_logs (
          id, draft_id, content, platform, impressions, likes, retweets, 
          replies, follows, clicks, success_score, tags, posted_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          log.id,
          log.draftId || null,
          log.content,
          log.platform,
          log.metrics.impressions,
          log.metrics.likes,
          log.metrics.retweets,
          log.metrics.replies,
          log.metrics.follows,
          log.metrics.clicks || 0,
          log.successScore,
          JSON.stringify(log.tags),
          log.postedAt.toISOString(),
          log.createdAt.toISOString()
        ]
      );

      // 2. Sync Supabase (Silent Background)
      SyncService.pushToCloud('performance_logs', {
        id: log.id,
        draft_id: log.draftId,
        content: log.content,
        platform: log.platform,
        impressions: log.metrics.impressions,
        likes: log.metrics.likes,
        retweets: log.metrics.retweets,
        replies: log.metrics.replies,
        follows: log.metrics.follows,
        clicks: log.metrics.clicks,
        success_score: log.successScore,
        tags: log.tags,
        posted_at: log.postedAt.toISOString(),
        created_at: log.createdAt.toISOString()
      });
    } catch (error) {
      console.error('SQLite error saving performance log:', error);
      throw new DatabaseError('Failed to save performance log');
    }
  }

  async getAll(): Promise<PerformanceLog[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM performance_logs ORDER BY posted_at DESC'
      );
      return rows.map(row => this.mapRowToLog(row));
    } catch (error) {
      console.error('SQLite error fetching performance logs:', error);
      throw new DatabaseError('Failed to fetch performance logs');
    }
  }

  async getTopPerformers(limit: number = 3): Promise<PerformanceLog[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM performance_logs ORDER BY success_score DESC LIMIT ?',
        [limit]
      );
      return rows.map(row => this.mapRowToLog(row));
    } catch (error) {
      console.error('SQLite error fetching top performers:', error);
      return [];
    }
  }

  async getHighPerformers(minScore: number = 7): Promise<PerformanceLog[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM performance_logs WHERE success_score >= ? ORDER BY success_score DESC',
        [minScore]
      );
      return rows.map(row => this.mapRowToLog(row));
    } catch (error) {
      console.error('SQLite error fetching high performers:', error);
      throw new DatabaseError('Failed to fetch high performers');
    }
  }

  /**
   * Feature 15: Find past successes matching specific tags/topics
   */
  async getSimilarPerformers(tags: string[], limit: number = 3): Promise<PerformanceLog[]> {
    const db = SQLiteService.getDB();
    try {
      // Simple topic matching: find logs where tags intersect or content contains keywords
      // In a real app we'd use better SQL or embeddings, but for now we filter in JS or use LIKE
      // Let's use a simple approach: if tags provided, try to find matches
      if (!tags || tags.length === 0) return this.getTopPerformers(limit);

      const allHigh = await this.getHighPerformers(7);
      
      const scored = allHigh.map(log => {
        let matchScore = 0;
        tags.forEach(tag => {
          if (log.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase())) matchScore += 2;
          if (log.content.toLowerCase().includes(tag.toLowerCase())) matchScore += 1;
        });
        return { log, matchScore };
      });

      return scored
        .filter(s => s.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore || b.log.successScore - a.log.successScore)
        .slice(0, limit)
        .map(s => s.log);
    } catch (error) {
      console.error('SQLite error fetching similar performers:', error);
      return [];
    }
  }

  private mapRowToLog(row: any): PerformanceLog {
    return new PerformanceLog({
      id: row.id,
      draftId: row.draft_id,
      content: row.content,
      platform: row.platform as 'twitter' | 'threads',
      metrics: {
        impressions: row.impressions,
        likes: row.likes,
        retweets: row.retweets,
        replies: row.replies,
        follows: row.follows,
        clicks: row.clicks
      },
      tags: row.tags ? JSON.parse(row.tags) : [],
      postedAt: new Date(row.posted_at),
      createdAt: new Date(row.created_at),
      successScore: row.success_score
    });
  }
}
