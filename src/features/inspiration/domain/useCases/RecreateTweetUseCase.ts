import { AIOrchestrator } from '@/core/ai/orchestrator';
import { ContextBuilder } from '@/core/ai/memory/ContextBuilder';
import { GenerationPromptBuilder } from '@/core/ai/prompts/GenerationPrompt';
import { ServiceContainer } from '@/core/di/GenerateContext';

/**
 * Generates variations of a shared tweet in the user's voice
 * Takes the original tweet and creates 3 versions matching user's brand
 */
export class RecreateTweetUseCase {
  private ai = new AIOrchestrator();

  async execute(originalTweet: string): Promise<string[]> {
    const prompt = this.buildRecreationPrompt(originalTweet);
    return await this.ai.generate(prompt, 3);
  }

  private buildRecreationPrompt(originalContent: string): string {
    return `You are recreating a viral tweet in a different voice. The goal is to capture the ESSENCE and STRUCTURE that made the original effective, but write it as a completely new tweet.

ORIGINAL TWEET (for inspiration, DO NOT copy):
"${originalContent}"

INSTRUCTIONS:
1. Identify what makes this tweet effective (hook, structure, emotion)
2. Create 3 COMPLETELY DIFFERENT variations on the same theme/concept
3. Each variation should feel original, not a paraphrase
4. Match the energy and length of the original
5. Use conversational, engaging tone

FORMAT:
TWEET_1: [Your first variation - different angle]
TWEET_2: [Your second variation - different hook]  
TWEET_3: [Your third variation - different emotion]

Generate 3 variations now:`;
  }
}
