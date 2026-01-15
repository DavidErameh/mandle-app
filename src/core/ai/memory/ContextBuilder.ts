import { ContentPillar, BrandProfile, Note } from '@/types/entities';
import { ContentPillarRepository } from '@/features/generate/data/repositories/ContentPillarRepository';
import { BrandProfileRepository } from '@/features/settings/data/repositories/BrandProfileRepository';
import { PerformanceRepository } from '@/features/analytics/data/repositories/PerformanceRepository';
import { NoteRepository } from '@/features/notes/data/repositories/NoteRepository';
import { ConnectedAccountRepository } from '@/features/inspiration/data/repositories/ConnectedAccountRepository';
import { PatternRepository } from '@/features/analytics/data/repositories/PatternRepository';
import { PatternExtractor, ViralPattern } from '../PatternExtractor';

export interface GenerationContext {
  pillar: ContentPillar;
  brandProfile: BrandProfile;
  pastSuccesses: any[];
  readyNotes: Note[];
  viralPatterns: ViralPattern[];
}

export class ContextBuilder {
  constructor(
    private pillarRepo: ContentPillarRepository,
    private brandRepo: BrandProfileRepository,
    private performanceRepo: PerformanceRepository,
    private noteRepo: NoteRepository,
    private accountRepo: ConnectedAccountRepository,
    private patternRepo: PatternRepository
  ) {}

  async build(): Promise<GenerationContext> {
    const pillar = await this.getActivePillar();
    
    // Parallel fetch for speed
    const [brand, performance, notes, accounts, viralInspirations] = await Promise.all([
      this.getBrandProfile(),
      this.getSimilarPerformers(pillar.tags || []),
      this.getReadyNotes(),
      this.getConnectedAccounts(),
      this.getViralInspirations(),
    ]);

    return {
      pillar,
      brandProfile: brand,
      pastSuccesses: performance,
      readyNotes: notes.slice(0, 2),
      viralPatterns: viralInspirations.slice(0, 5),
    };
  }

  async getPoolSize(): Promise<number> {
    const [notesCount, viralCount] = await Promise.all([
      this.noteRepo.getReadyCount(),
      this.accountRepo.getViralCount()
    ]);
    return notesCount + viralCount;
  }

  private async getActivePillar(): Promise<ContentPillar> {
    return await this.pillarRepo.getNextInRotation();
  }

  private async getBrandProfile(): Promise<BrandProfile> {
    return await this.brandRepo.getProfile();
  }

  private async getSimilarPerformers(tags: string[]): Promise<any[]> {
    return await this.performanceRepo.getSimilarPerformers(tags);
  }

  private async getReadyNotes(): Promise<Note[]> {
    return await this.noteRepo.getByState('ready', 2);
  }

  private async getConnectedAccounts(): Promise<any[]> {
    return await this.accountRepo.getAll();
  }

  private async getViralInspirations(): Promise<ViralPattern[]> {
    // 1. Get manually extracted patterns from our repository
    const storedPatterns = await this.patternRepo.getTopPatterns(3);
    
    // 2. Get automated inspirations from connected accounts
    const rawInspirations = await this.accountRepo.getRecentViralInspirations(3);
    const extractor = new PatternExtractor();
    
    // Map to patterns, using Name as unique key
    const patternMap = new Map<string, ViralPattern>();
    
    // Add stored patterns first (higher priority/quality)
    storedPatterns.forEach(p => patternMap.set(p.name, p));
    
    // Supplement with automated ones
    rawInspirations.forEach(inspiration => {
      const pattern = extractor.extract(inspiration.content);
      if (!patternMap.has(pattern.name)) {
        patternMap.set(pattern.name, pattern);
      }
    });

    return Array.from(patternMap.values());
  }
}
