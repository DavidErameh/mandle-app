import { SQLiteService } from '@/core/database/sqlite';
import { DatabaseError } from '@/shared/utils/errors';
import { ViralPattern, ViralPatternIntensity } from '../../domain/entities/ViralPattern';

export class PatternRepository {
  async save(pattern: ViralPattern): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(
        `INSERT INTO viral_patterns (
          id, name, description, hook_type, structure, emotion, 
          cta_type, intensity, source_tweet_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pattern.id,
          pattern.name,
          pattern.description,
          pattern.hookType,
          pattern.structure,
          pattern.emotion,
          pattern.ctaType,
          pattern.intensity,
          pattern.sourceTweetId || null,
          pattern.createdAt.toISOString()
        ]
      );
    } catch (error) {
      console.error('SQLite error saving viral pattern:', error);
      throw new DatabaseError('Failed to save viral pattern');
    }
  }

  async getAll(): Promise<ViralPattern[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM viral_patterns ORDER BY created_at DESC'
      );
      return rows.map(row => this.mapRowToPattern(row));
    } catch (error) {
      console.error('SQLite error fetching viral patterns:', error);
      throw new DatabaseError('Failed to fetch viral patterns');
    }
  }

  async getTopPatterns(limit: number = 5): Promise<ViralPattern[]> {
    const db = SQLiteService.getDB();
    try {
      // For now, we just return the most recent ones as "top"
      // In a real app, we might join with performance data to see which pattern is used in high earners the most
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM viral_patterns ORDER BY created_at DESC LIMIT ?',
        [limit]
      );
      return rows.map(row => this.mapRowToPattern(row));
    } catch (error) {
      console.error('SQLite error fetching top patterns:', error);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync('DELETE FROM viral_patterns WHERE id = ?', [id]);
    } catch (error) {
      console.error('SQLite error deleting viral pattern:', error);
      throw new DatabaseError('Failed to delete viral pattern');
    }
  }

  private mapRowToPattern(row: any): ViralPattern {
    return new ViralPattern({
      id: row.id,
      name: row.name,
      description: row.description,
      hookType: row.hook_type,
      structure: row.structure,
      emotion: row.emotion,
      ctaType: row.cta_type,
      intensity: row.intensity as ViralPatternIntensity,
      sourceTweetId: row.source_tweet_id,
      createdAt: new Date(row.created_at)
    });
  }
}
