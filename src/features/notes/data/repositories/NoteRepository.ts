import { SQLiteService } from '@/core/database/sqlite';
import { SyncService } from '@/core/database/sync';
import { Note } from '../../domain/entities/Note';
import { DatabaseError } from '@/shared/utils/errors';

export class NoteRepository {
  async save(note: Note): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO notes (id, content, tags, state, pillar_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          note.id, 
          note.content, 
          JSON.stringify(note.tags), 
          note.state, 
          note.pillarId || null,
          note.createdAt.toISOString(), 
          new Date().toISOString()
        ]
      );

      // 2. Sync Supabase (Silent Background)
      SyncService.pushToCloud('notes', {
        id: note.id,
        content: note.content,
        tags: note.tags,
        state: note.state,
        pillar_id: note.pillarId || null,
        created_at: note.createdAt.toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('SQLite error saving note:', error);
      throw new DatabaseError('Failed to save note locally');
    }
  }

  async getAll(): Promise<Note[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM notes ORDER BY created_at DESC`
      );
      
      return rows.map(r => this.mapRowToNote(r));
    } catch (e) {
      console.error('SQLite error fetching all notes:', e);
      return [];
    }
  }

  async getByState(state: string, limit: number = 20): Promise<Note[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM notes WHERE state = ? ORDER BY created_at DESC LIMIT ?`,
        [state, limit]
      );
      
      return rows.map(r => this.mapRowToNote(r));
    } catch (error) {
      console.error('SQLite error fetching notes by state:', error);
      return [];
    }
  }

  async getReadyCount(): Promise<number> {
    const db = SQLiteService.getDB();
    try {
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM notes WHERE state = 'ready'`
      );
      return result?.count || 0;
    } catch (e) {
      return 0;
    }
  }

  async delete(id: string): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(`DELETE FROM notes WHERE id = ?`, [id]);
    } catch (e) {
      throw new DatabaseError('Failed to delete note');
    }
  }

  async findById(id: string): Promise<Note | null> {
    const db = SQLiteService.getDB();
    try {
      const row = await db.getFirstAsync<any>(`SELECT * FROM notes WHERE id = ?`, [id]);
      return row ? this.mapRowToNote(row) : null;
    } catch (e) {
      return null;
    }
  }

  private mapRowToNote(row: any): Note {
    return new Note({
      id: row.id,
      content: row.content,
      tags: JSON.parse(row.tags || '[]'),
      state: row.state as any,
      pillarId: row.pillar_id,
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(row.created_at)
    });
  }
}
