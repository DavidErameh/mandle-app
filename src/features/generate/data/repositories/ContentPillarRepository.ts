import { supabase } from '@/core/database/supabase';
import { SQLiteService } from '@/core/database/sqlite';
import { SyncService } from '@/core/database/sync';
import { ContentPillar } from '../../domain/entities/ContentPillar';
import { DatabaseError } from '@/shared/utils/errors';

export class ContentPillarRepository {
  async getNextInRotation(): Promise<ContentPillar> {
    const db = SQLiteService.getDB();
    
    try {
      // 1. Try SQLite (Offline First)
      const localRow = await db.getFirstAsync<{id: string, name: string, description: string, examples: string, active: number, last_used: string}>(
        `SELECT * FROM content_pillars WHERE active = 1 ORDER BY last_used ASC LIMIT 1`
      );

      if (localRow) {
        return new ContentPillar({
          id: localRow.id,
          name: localRow.name,
          description: localRow.description,
          examples: JSON.parse(localRow.examples || '[]'),
          active: !!localRow.active,
          lastUsed: localRow.last_used ? new Date(localRow.last_used) : undefined,
        });
      }

      // 2. Fallback to Supabase (Cold Start / Online)
      const { data, error } = await supabase
        .from('content_pillars')
        .select('*')
        .eq('active', true)
        .order('last_used', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
           return this.getDefaultPillar();
        }
        return this.getDefaultPillar();
      }

      // 3. Cache result to SQLite
      await db.runAsync(
        `INSERT OR REPLACE INTO content_pillars (id, name, description, examples, active, last_used, usage_count) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.id, data.name, data.description, JSON.stringify(data.examples), data.active ? 1 : 0, data.last_used, data.usage_count]
      );

      return new ContentPillar({
        id: data.id,
        name: data.name,
        description: data.description,
        examples: data.examples || [],
        active: data.active,
        lastUsed: data.last_used ? new Date(data.last_used) : undefined,
      });

    } catch (err) {
      return this.getDefaultPillar();
    }
  }

  async getAll(): Promise<ContentPillar[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<any>(`SELECT * FROM content_pillars WHERE active = 1 ORDER BY name ASC`);
      return rows.map(r => new ContentPillar({
        id: r.id,
        name: r.name,
        description: r.description,
        examples: JSON.parse(r.examples || '[]'),
        active: !!r.active,
        lastUsed: r.last_used ? new Date(r.last_used) : undefined
      }));
    } catch (e) {
      console.error('Error fetching pillars:', e);
      return [];
    }
  }

  private getDefaultPillar(): ContentPillar {
    return new ContentPillar({
      name: 'General',
      description: 'General brand update',
      active: true,
      examples: []
    });
  }

  async updateUsage(id: string): Promise<void> {
    const db = SQLiteService.getDB();
    const now = new Date().toISOString();
    
    await db.runAsync(
      `UPDATE content_pillars SET last_used = ?, usage_count = usage_count + 1 WHERE id = ?`,
      [now, id]
    );

    // 2. Sync Remote (Silent Background)
    SyncService.pushToCloud('content_pillars', { id, last_used: now });
  }

  async saveAll(pillars: Partial<ContentPillar>[]): Promise<void> {
    const db = SQLiteService.getDB();
    
    for (const pillar of pillars) {
       const id = pillar.id || Math.random().toString(36).substring(2, 9);
       const now = new Date().toISOString();
       
       await db.runAsync(
         `INSERT OR REPLACE INTO content_pillars (id, name, description, examples, active, last_used, usage_count) VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [id, pillar.name || '', pillar.description || '', JSON.stringify(pillar.examples || []), 1, now, 0]
       );
       
       // 2. Sync Supabase (Silent Background)
       SyncService.pushToCloud('content_pillars', {
         id: id,
         name: pillar.name,
         description: pillar.description,
         examples: pillar.examples || [],
         active: true,
         last_used: now,
         usage_count: 0
       });
    }
  }
}
