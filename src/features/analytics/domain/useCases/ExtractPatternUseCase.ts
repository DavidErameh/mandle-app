import { AIOrchestrator } from '@/core/ai/orchestrator';
import { PatternAnalysisPromptBuilder } from '@/core/ai/prompts/PatternAnalysisPrompt';
import { PatternRepository } from '../../data/repositories/PatternRepository';
import { ViralPattern } from '../entities/ViralPattern';

export class ExtractPatternUseCase {
  constructor(
    private aiOrchestrator: AIOrchestrator,
    private promptBuilder: PatternAnalysisPromptBuilder,
    private patternRepo: PatternRepository
  ) {}

  async execute(tweetContent: string, sourceTweetId?: string): Promise<ViralPattern> {
    const prompt = this.promptBuilder.build(tweetContent);
    const response = await this.aiOrchestrator.generate(prompt);
    
    // The orchestrator typically returns string[], we want the first (and only) JSON response
    const rawJson = response[0];
    
    try {
      const data = JSON.parse(this.cleanJson(rawJson));
      const pattern = new ViralPattern({
        ...data,
        sourceTweetId
      });
      
      await this.patternRepo.save(pattern);
      return pattern;
    } catch (error) {
      console.error('Failed to parse AI pattern response:', error);
      throw new Error('AI could not extract a valid pattern from this content.');
    }
  }

  private cleanJson(text: string): string {
    // Remove markdown code blocks if present
    return text.replace(/```json|```/g, '').trim();
  }
}
