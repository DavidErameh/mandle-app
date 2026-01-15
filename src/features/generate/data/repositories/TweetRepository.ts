import { supabase } from '@/core/database/supabase';
import { SQLiteService } from '@/core/database/sqlite';
import { SyncService } from '@/core/database/sync';
import { Tweet } from '../../domain/entities/Tweet';
import { DatabaseError } from '@/shared/utils/errors';

import { ITweetRepository } from '../../domain/interfaces/ITweetRepository';

export class TweetRepository implements ITweetRepository {
  async saveDrafts(tweets: Tweet[]): Promise<void> {
    const db = SQLiteService.getDB();
    
    // 1. Save Local (SQLite)
    for (const tweet of tweets) {
      await db.runAsync(
        `INSERT OR REPLACE INTO generated_tweets (id, content, variant, created_at, status) VALUES (?, ?, ?, ?, ?)`,
        [tweet.id, tweet.content, tweet.variant || 0, tweet.createdAt.toISOString(), 'draft']
      );
    }

    // 2. Sync Supabase (Silent Background)
    SyncService.pushToCloud('drafts', tweets.map(tweet => ({
      id: tweet.id,
      content: tweet.content,
      platform: tweet.platform,
      created_at: tweet.createdAt.toISOString(),
      variant: tweet.variant
    })));
  }

  async getDrafts(limit: number = 10): Promise<Tweet[]> {
    const db = SQLiteService.getDB();
    try {
      // Try local first
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM generated_tweets ORDER BY created_at DESC LIMIT ?',
        [limit]
      );
      
      if (rows.length > 0) {
        return rows.map(row => new Tweet({
          id: row.id,
          content: row.content,
          createdAt: new Date(row.created_at),
          variant: row.variant
        }));
      }

      // Fallback to Supabase if local empty (Sync logic)
      const { data, error } = await supabase
        .from('drafts')
        .select()
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((row: any) => new Tweet({
        id: row.id,
        content: row.content,
        platform: row.platform as 'twitter' | 'threads',
        createdAt: new Date(row.created_at),
        variant: row.variant
      }));
    } catch (e) {
      console.error('Error fetching drafts:', e);
      return [];
    }
  }

  async updateContent(id: string, content: string): Promise<void> {
    const db = SQLiteService.getDB();
    const now = new Date().toISOString();
    
    // 1. Update Local
    await db.runAsync(
      'UPDATE generated_tweets SET content = ? WHERE id = ?',
      [content, id]
    );

    // 2. Sync Remote (Silent Background)
    SyncService.pushToCloud('drafts', { 
      id: id,
      content: content 
    });
  }
}
