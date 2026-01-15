import { SQLiteService } from '@/core/database/sqlite';
import { Version } from '../../domain/entities/Version';
import { DatabaseError } from '@/shared/utils/errors';

export class VersionRepository {
  async save(version: Version): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(
        `INSERT INTO versions (id, draft_id, content, author, timestamp, change_type, parent_version) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          version.id,
          version.draftId,
          version.content,
          version.author,
          version.timestamp.toISOString(),
          version.changeType,
          version.parentVersion || null
        ]
      );
    } catch (error) {
      console.error('SQLite error saving version:', error);
      throw new DatabaseError('Failed to save version locally');
    }
  }

  async getByDraftId(draftId: string): Promise<Version[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM versions WHERE draft_id = ? ORDER BY timestamp DESC',
        [draftId]
      );
      return rows.map(row => this.mapRowToVersion(row));
    } catch (error) {
      console.error('SQLite error fetching versions:', error);
      throw new DatabaseError('Failed to fetch versions');
    }
  }

  async getLatestForDraft(draftId: string): Promise<Version | null> {
    const db = SQLiteService.getDB();
    try {
      const row = await db.getFirstAsync<any>(
        'SELECT * FROM versions WHERE draft_id = ? ORDER BY timestamp DESC LIMIT 1',
        [draftId]
      );
      return row ? this.mapRowToVersion(row) : null;
    } catch (error) {
      console.error('SQLite error fetching latest version:', error);
      throw new DatabaseError('Failed to fetch latest version');
    }
  }

  private mapRowToVersion(row: any): Version {
    return new Version({
      id: row.id,
      draftId: row.draft_id,
      content: row.content,
      author: row.author as any,
      timestamp: new Date(row.timestamp),
      changeType: row.change_type as any,
      parentVersion: row.parent_version
    });
  }
}
