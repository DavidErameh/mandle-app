import { ManualInspirationRepository, ManualInspiration } from '../../data/repositories/ManualInspirationRepository';
import { PatternExtractor } from '@/core/ai/PatternExtractor';
import { AIOrchestrator } from '@/core/ai/orchestrator';
import { BrandProfileRepository } from '@/features/settings/data/repositories/BrandProfileRepository';
import { RecreationPrompt } from '@/core/ai/prompts/RecreationPrompt';

export class AnalyzeAndRecreateUseCase {
  constructor(
    private manualRepo: ManualInspirationRepository,
    private patternExtractor: PatternExtractor,
    private aiOrchestrator: AIOrchestrator,
    private brandRepo: BrandProfileRepository
  ) {}

  async execute(url: string): Promise<ManualInspiration> {
    // 1. Mock Scrape (In real app, call a server-side scraping service)
    const originalContent = await this.mockScrape(url);
    
    // 2. Analyze
    const analysis = this.patternExtractor.analyzeContent(originalContent);
    
    // 3. Get Brand Voice
    const profile = await this.brandRepo.getProfile();
    if (!profile) throw new Error('Complete onboarding first to set your brand voice.');

    // 4. Generate Variations
    const prompt = RecreationPrompt.build(originalContent, analysis, profile);
    const response = await this.aiOrchestrator.generate(prompt);
    
    const variations = response.slice(0, 3);

    // 5. Save
    const inspiration: ManualInspiration = {
      id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      url,
      content: originalContent,
      analysis,
      variations,
      createdAt: new Date().toISOString()
    };

    await this.manualRepo.save(inspiration);

    return inspiration;
  }

  private async mockScrape(url: string): Promise<string> {
    const mocks = [
      "The 3-2-1 rule for scaling your startup:\n\n3 Focus areas\n2 Key hires\n1 North star metric\n\nMost people do 10 focus areas, 0 hires, and have no metric.\n\nSimplicity is the ultimate scale hack.",
      "How I built a $100k/mo business with 0 employees:\n\n1. Use AI for everything\n2. Automate my lead gen\n3. High-ticket only\n\nIt took me 4 years to learn this. You can start today.\n\nReply 'GROW' to get my blueprint.",
      "Stop trading time for money.\n\nBuild assets that work while you sleep.\n- Content\n- Code\n- Courses\n\nThe goal isn't to work 80 hours. The goal is to work 4 and make 10x more.\n\nFollow for more freedom tips."
    ];
    
    return new Promise(resolve => setTimeout(() => resolve(mocks[Math.floor(Math.random() * mocks.length)]), 800));
  }
}
