import { Tweet } from '../entities/Tweet';
import { ITweetRepository } from '../interfaces/ITweetRepository';
import { BrandProfile } from '@/types/entities';
import { AIOrchestrator } from '@/core/ai/orchestrator';
import { ContextBuilder } from '@/core/ai/memory/ContextBuilder';
import { GenerationPromptBuilder } from '@/core/ai/prompts/GenerationPrompt';
import { PostProcessor } from '@/core/ai/PostProcessor';
import { SaveVersionUseCase } from '@/features/collaboration/domain/useCases/SaveVersionUseCase';

export class GenerateTweetUseCase {
  constructor(
    private tweetRepo: ITweetRepository,
    private aiOrchestrator: AIOrchestrator,
    private contextBuilder: ContextBuilder,
    private promptBuilder: GenerationPromptBuilder,
    private postProcessor: PostProcessor,
    private saveVersionUseCase?: SaveVersionUseCase
  ) {}

  async execute(brandProfile: BrandProfile, platform: 'twitter' | 'threads' = 'twitter'): Promise<Tweet[]> {
    // ... existing steps ...
    // 1. Build context
    const context = await this.contextBuilder.build();
    
    // 2. Build prompt
    const prompt = this.promptBuilder.build(context, platform);
    
    // 3. Generate via AI
    const generatedTexts = await this.aiOrchestrator.generate(prompt);
    
    // 4. Post-process (Validate & Polish)
    const processedResults = await this.postProcessor.process(generatedTexts, brandProfile, platform);
    
    // 5. Create tweet entities
    const inspiration = context.pastSuccesses.length > 0 
      ? `Inspired by your "${context.pastSuccesses[0].content.slice(0, 30)}..." success`
      : undefined;

    const tweets = processedResults.map((result, index) => new Tweet({ 
      content: result.content,
      variant: index + 1,
      platform: platform,
      pattern: result.pattern,
      inspiredBy: inspiration,
      violations: result.violations
    }));
    
    // 6. Save to repository (Drafts)
    await this.tweetRepo.saveDrafts(tweets);

    // 7. Record Initial Versions
    if (this.saveVersionUseCase) {
      for (const tweet of tweets) {
        await this.saveVersionUseCase.execute({
          draftId: tweet.id,
          content: tweet.content,
          author: 'assistant',
          changeType: 'generated'
        });
      }
    }
    
    return tweets;
  }
}
