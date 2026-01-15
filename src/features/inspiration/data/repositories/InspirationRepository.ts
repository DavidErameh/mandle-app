import { IInspirationRepository } from '../../domain/interfaces/IInspirationRepository';
import { Inspiration, InspirationTweet } from '../../domain/entities/Inspiration';
import { SQLiteService } from '@/core/database/sqlite';
import { PatternExtractor } from '@/core/ai/PatternExtractor';

export class InspirationRepository implements IInspirationRepository {
  private patternExtractor = new PatternExtractor();

  async getConnectedAccounts(): Promise<Inspiration[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<{
        id: string, 
        account_name: string, 
        platform: string, 
        avatar_url: string, 
        viral_score: number, 
        patterns: string,
        last_fetched: string
      }>(`SELECT * FROM connected_accounts`);

      return rows.map(r => new Inspiration({
        id: r.id,
        accountName: r.account_name,
        platform: r.platform as any,
        avatarUrl: r.avatar_url,
        viralScore: r.viral_score,
        patterns: JSON.parse(r.patterns || '[]'),
        lastActive: new Date(r.last_fetched || Date.now())
      }));
    } catch (e) {
      console.error('Failed to get accounts:', e);
      return [];
    }
  }

  async getViralPatterns(limit: number = 5): Promise<string[]> {
    const accounts = await this.getConnectedAccounts();
    return accounts.flatMap(acc => acc.patterns.map(p => p.description)).slice(0, limit);
  }

  async connectAccount(platform: string, handle: string): Promise<Inspiration> {
    const db = SQLiteService.getDB();
    const id = crypto.randomUUID();
    
    // Simulate finding a real account (mocking avatar/score)
    const mockInspiration = new Inspiration({
      id,
      accountName: handle,
      platform: platform as any,
      viralScore: 8.0 + Math.random(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`,
      patterns: []
    });

    try {
      await db.runAsync(
        `INSERT INTO connected_accounts (id, account_name, platform, avatar_url, viral_score, patterns, last_fetched) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, handle, platform, mockInspiration.avatarUrl || '', mockInspiration.viralScore, '[]', new Date().toISOString()]
      );

      // Trigger initial "Scrape"
      await this.mockScrape(id, handle, platform);

      return mockInspiration;
    } catch (e) {
      console.error('Failed to connect account:', e);
      throw e;
    }
  }

  async disconnectAccount(id: string): Promise<void> {
    const db = SQLiteService.getDB();
    try {
      await db.runAsync(`DELETE FROM connected_accounts WHERE id = ?`, [id]);
      await db.runAsync(`DELETE FROM viral_inspirations WHERE account_id = ?`, [id]);
    } catch (e) {
      console.error('Failed to disconnect account:', e);
    }
  }

  async getTopTweets(accountId: string): Promise<InspirationTweet[]> {
    const db = SQLiteService.getDB();
    try {
      const rows = await db.getAllAsync<{content: string, engagement_count: number, created_at: string}>(
        `SELECT content, engagement_count, created_at FROM viral_inspirations WHERE account_id = ? ORDER BY engagement_count DESC LIMIT 10`,
        [accountId]
      );
      
      return rows.map(r => ({
        content: r.content,
        engagement: r.engagement_count,
        date: new Date(r.created_at),
        patterns: [this.patternExtractor.extract(r.content).name]
      }));
    } catch (e) {
      return [];
    }
  }

  private async mockScrape(accountId: string, handle: string, platform: string) {
    const db = SQLiteService.getDB();
    const mockTweets = [
      `Just realized that 90% of code is thinking, 10% is typing. The key is in the silence.`,
      `How to build a SaaS in 2024:\n1. Solve your own problem\n2. Ship fast\n3. Iterate based on feedback\n4. Scale logic, not headcount.`,
      `Success isn't about the goal, it's about the system that makes the goal inevitable. #systems #growth`,
      `Stop looking for "hacks" and start looking for "leverage". One creates a burst, the other creates a tailwind.`
    ];

    const extractedPatterns = mockTweets.map(t => this.patternExtractor.extract(t));
    const uniquePatterns = Array.from(new Set(extractedPatterns.map(p => JSON.stringify({id: p.name, description: p.description}))))
      .map(s => JSON.parse(s));

    try {
      // Save mock tweets
      for (const tweet of mockTweets) {
        await db.runAsync(
          `INSERT INTO viral_inspirations (id, account_id, content, engagement_count, platform, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), accountId, tweet, Math.floor(Math.random() * 5000) + 500, platform, new Date().toISOString()]
        );
      }

      // Update account patterns
      await db.runAsync(
        `UPDATE connected_accounts SET patterns = ? WHERE id = ?`,
        [JSON.stringify(uniquePatterns), accountId]
      );
    } catch (e) {
      console.error('Mock scrape failed:', e);
    }
  }
}
