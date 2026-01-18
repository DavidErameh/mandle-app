import { supabase } from '@/core/database/supabase';
import { SQLiteService } from '@/core/database/sqlite';
import { BrandProfile } from '@/types/entities';
import { DatabaseError } from '@/shared/utils/errors';

export class BrandProfileRepository {
  async getProfile(): Promise<BrandProfile> {
    const db = SQLiteService.getDB();
    
    try {
      // 1. Try SQLite
      const localRow = await db.getFirstAsync<{id: string, system_prompt: string, guardrails: string, voice_examples: string, voice_analysis: string, created_at: string}>(
        `SELECT * FROM brand_profile LIMIT 1`
      );

      if (localRow) {
        return {
          id: localRow.id,
          systemPrompt: localRow.system_prompt,
          guardrails: JSON.parse(localRow.guardrails || '{}'),
          voiceExamples: JSON.parse(localRow.voice_examples || '[]'),
          voiceAnalysis: localRow.voice_analysis ? JSON.parse(localRow.voice_analysis) : undefined,
          createdAt: new Date(localRow.created_at)
        };
      }

      // 2. Fallback to Supabase
      const { data, error } = await supabase
        .from('brand_profile')
        .select('*')
        .single();

      if (error) {
         if (error.code === 'PGRST116') {
            return this.getDefaultProfile();
         }
         console.error('Supabase error fetching brand profile:', error);
         return this.getDefaultProfile();
      }

      // 3. Cache
      await db.runAsync(
          `INSERT OR REPLACE INTO brand_profile (id, system_prompt, guardrails, voice_examples, voice_analysis, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
          [data.id, data.system_prompt, JSON.stringify(data.guardrails), JSON.stringify(data.voice_examples), JSON.stringify(data.voice_analysis || {}), data.created_at]
      );

      return {
        id: data.id,
        systemPrompt: data.system_prompt,
        guardrails: data.guardrails,
        voiceExamples: data.voice_examples || [],
        voiceAnalysis: data.voice_analysis,
        createdAt: new Date(data.created_at)
      };

    } catch (err) {
      console.error('BrandRepo Error:', err);
      return this.getDefaultProfile();
    }
  }

  private getDefaultProfile(): BrandProfile {
    return {
      id: 'default',
      systemPrompt: 'You are an expert ghostwriter.',
      guardrails: {
        allowedTopics: ['Tech', 'Business'],
        avoidTopics: ['Politics'],
        tone: 'Professional',
        maxHashtags: 2,
        characterRange: [50, 280]
      },
      voiceExamples: [],
      createdAt: new Date()
    };
  }

  async saveProfile(profile: Partial<BrandProfile>): Promise<void> {
    const db = SQLiteService.getDB();
    const now = new Date().toISOString();
    // Use provided id, or generate a proper UUID (Supabase requires UUID format)
    const id = profile.id || crypto.randomUUID();

    try {
      // 1. Save Local
      await db.runAsync(
          `INSERT OR REPLACE INTO brand_profile (id, system_prompt, guardrails, voice_examples, voice_analysis, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
          [id, profile.systemPrompt || '', JSON.stringify(profile.guardrails || {}), JSON.stringify(profile.voiceExamples || []), JSON.stringify(profile.voiceAnalysis || {}), now]
      );

      // 2. Sync Remote (omit created_at as Supabase table may not have it)
      const { error } = await supabase.from('brand_profile').upsert({
         id: id,
         user_id: (await supabase.auth.getUser()).data.user?.id,
         system_prompt: profile.systemPrompt,
         guardrails: profile.guardrails,
         voice_examples: profile.voiceExamples,
         voice_analysis: profile.voiceAnalysis,
         updated_at: now
      });

      if (error) console.error('Supabase Profile Save Error:', error);

    } catch (e) {
      console.error('Failed to save brand profile:', e);
      throw e;
    }
  }
}
