import { Tweet } from '@/features/generate/domain/entities/Tweet';
import { ITweetRepository } from '@/features/generate/domain/interfaces/ITweetRepository';
import { BrandProfile } from '@/types/entities';
import { AIOrchestrator } from '@/core/ai/orchestrator';
import { ContextBuilder } from '@/core/ai/memory/ContextBuilder';
import { ThreadPromptBuilder } from '@/core/ai/prompts/ThreadPromptBuilder';
import { PostProcessor } from '@/core/ai/PostProcessor';

export class ExpandToThreadUseCase {
  constructor(
    private tweetRepo: ITweetRepository,
    private aiOrchestrator: AIOrchestrator,
    private contextBuilder: ContextBuilder,
    private promptBuilder: ThreadPromptBuilder,
    private postProcessor: PostProcessor
  ) {}

  async execute(noteContent: string, brandProfile: BrandProfile, platform: 'twitter' | 'threads' = 'twitter'): Promise<Tweet[]> {
    // 1. Build base context (pillars, patterns, etc.)
    const context = await this.contextBuilder.build();
    
    // 2. Build thread-specific prompt using the noteContent as input
    const prompt = this.promptBuilder.build(context, noteContent, platform);
    const fullPrompt = `${prompt}\n\n${this.promptBuilder.getInstructions(platform)}`;
    
    // 3. Generate via AI
    const generatedTexts = await this.aiOrchestrator.generate(fullPrompt);
    
    // 4. Post-process (Validate & Polish)
    // We relax the "character count" check slightly in post-processor if needed, 
    // but the system prompt already asks for 240-280.
    const processedResults = await this.postProcessor.process(generatedTexts, brandProfile, platform);
    
    // 5. Create tweet entities
    const tweets = processedResults.map((result, index) => new Tweet({ 
      content: result.content,
      variant: index + 1,
      platform: platform,
      pattern: result.pattern,
      violations: result.violations
      // We could add a 'threadGroup' ID here in the future
    }));
    
    // 6. Save as drafts (optional, but good for persistence)
    await this.tweetRepo.saveDrafts(tweets);
    
    return tweets;
  }
}
