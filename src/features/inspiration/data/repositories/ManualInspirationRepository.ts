import { SQLiteService } from '@/core/database/sqlite';
import { DatabaseError } from '@/shared/utils/errors';
import { DetailedAnalysis } from '@/core/ai/PatternExtractor';

export interface ManualInspiration {
  id: string;
  url: string;
  content: string;
  analysis: DetailedAnalysis;
  variations: string[];
  createdAt: string;
}

export class ManualInspirationRepository {
  async getAll(): Promise<ManualInspiration[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<{
        id: string,
        url: string,
        content: string,
        analysis: string,
        variations: string,
        created_at: string
      }>(`SELECT * FROM manual_inspirations ORDER BY created_at DESC`);

      return rows.map(r => ({
        id: r.id,
        url: r.url,
        content: r.content,
        analysis: JSON.parse(r.analysis || '{}'),
        variations: JSON.parse(r.variations || '[]'),
        createdAt: r.created_at
      }));
    } catch (e) {
      console.error('Failed to fetch manual inspirations:', e);
      return [];
    }
  }

  async save(inspiration: ManualInspiration): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO manual_inspirations (id, url, content, analysis, variations, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          inspiration.id,
          inspiration.url,
          inspiration.content,
          JSON.stringify(inspiration.analysis),
          JSON.stringify(inspiration.variations),
          inspiration.createdAt || new Date().toISOString()
        ]
      );
    } catch (e) {
      throw new DatabaseError('Failed to save manual inspiration');
    }
  }

  async delete(id: string): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(`DELETE FROM manual_inspirations WHERE id = ?`, [id]);
    } catch (e) {
      throw new DatabaseError('Failed to delete manual inspiration');
    }
  }
}
