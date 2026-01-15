import { Tweet } from '../entities/Tweet';
import { ITweetRepository } from '../interfaces/ITweetRepository';
import { BrandProfile } from '@/types/entities';
import { AIOrchestrator } from '@/core/ai/orchestrator';
import { PolishPromptBuilder, PolishStyle } from '@/core/ai/prompts/PolishPrompt';
import { PostProcessor } from '@/core/ai/PostProcessor';
import { SaveVersionUseCase } from '@/features/collaboration/domain/useCases/SaveVersionUseCase';

export interface PolishRequest {
  tweet: Tweet;
  style: PolishStyle;
  brandProfile: BrandProfile;
  platform?: 'twitter' | 'threads';
}

export interface PolishResult {
  original: string;
  polished: string;
  style: PolishStyle;
  characterCount: number;
  violations: string[];
}

export class PolishTweetUseCase {
  constructor(
    private aiOrchestrator: AIOrchestrator,
    private polishPromptBuilder: PolishPromptBuilder,
    private postProcessor: PostProcessor,
    private tweetRepo?: ITweetRepository,
    private saveVersionUseCase?: SaveVersionUseCase
  ) {}

  async execute(request: PolishRequest): Promise<PolishResult> {
    const { tweet, style, brandProfile, platform = 'twitter' } = request;
    
    // 1. Build polish prompt
    const prompt = this.polishPromptBuilder.build(
      tweet.content,
      style,
      brandProfile,
      platform
    );
    
    // 2. Generate via AI (single completion, not full generate)
    const polishedText = await this.aiOrchestrator.complete(prompt);
    
    // 3. Clean up response (AI sometimes adds quotes or extra formatting)
    let cleaned = polishedText
      .trim()
      .replace(/^["']/, '')
      .replace(/["']$/, '')
      .replace(/\n+/g, ' ')
      .trim();
    
    // 4. Post-process for guardrails
    const processed = await this.postProcessor.process(
      [cleaned],
      brandProfile,
      platform
    );
    
    const result = processed[0] || { content: cleaned, violations: [] };
    
    // 5. Save new version if connected
    if (this.saveVersionUseCase) {
      await this.saveVersionUseCase.execute({
        draftId: tweet.id,
        content: result.content,
        author: 'assistant',
        changeType: 'polished'
      });
    }
    
    // 6. Update tweet in repository if connected
    if (this.tweetRepo) {
      // The repo would need an update method, which we'll handle via versioning
    }
    
    return {
      original: tweet.content,
      polished: result.content,
      style,
      characterCount: result.content.length,
      violations: result.violations
    };
  }
}
