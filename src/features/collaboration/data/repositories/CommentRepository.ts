import { SQLiteService } from '@/core/database/sqlite';
import { Comment } from '../../domain/entities/Comment';
import { DatabaseError } from '@/shared/utils/errors';

export class CommentRepository {
  async save(comment: Comment): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(
        `INSERT INTO draft_comments (id, draft_id, content, author, resolved, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          comment.id,
          comment.draftId,
          comment.content,
          comment.author,
          comment.resolved ? 1 : 0,
          comment.createdAt.toISOString()
        ]
      );
    } catch (error) {
      console.error('SQLite error saving comment:', error);
      throw new DatabaseError('Failed to save comment locally');
    }
  }

  async getByDraftId(draftId: string): Promise<Comment[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(
        `SELECT * FROM draft_comments WHERE draft_id = ? ORDER BY created_at ASC`,
        [draftId]
      );

      return rows.map(row => new Comment({
        id: row.id,
        draftId: row.draft_id,
        content: row.content,
        author: row.author as 'creator' | 'assistant',
        resolved: row.resolved === 1,
        createdAt: new Date(row.created_at)
      }));
    } catch (error) {
      console.error('SQLite error fetching comments:', error);
      throw new DatabaseError('Failed to fetch comments');
    }
  }

  async updateResolved(commentId: string, resolved: boolean): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(
        `UPDATE draft_comments SET resolved = ? WHERE id = ?`,
        [resolved ? 1 : 0, commentId]
      );
    } catch (error) {
      console.error('SQLite error updating comment resolution:', error);
      throw new DatabaseError('Failed to update comment');
    }
  }

  async delete(commentId: string): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(
        `DELETE FROM draft_comments WHERE id = ?`,
        [commentId]
      );
    } catch (error) {
      console.error('SQLite error deleting comment:', error);
      throw new DatabaseError('Failed to delete comment');
    }
  }
}
