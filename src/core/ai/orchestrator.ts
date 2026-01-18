import { generateWithGroq } from './providers/groq';
import { AIGenerationError } from '@/shared/utils/errors';
import { LoggerService } from '@/core/utils/LoggerService';

const TIMEOUT_GROQ = 15000;   // 15 seconds timeout for Groq API

export class AIOrchestrator {
  async generate(prompt: string, targetCount: number = 3): Promise<string[]> {
    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }

    if (prompt.length > 10000) { // Reasonable limit for prompts
      throw new Error('Prompt exceeds maximum length of 10000 characters');
    }

    if (targetCount <= 0 || targetCount > 10) { // Reasonable limits for target count
      throw new Error('Target count must be between 1 and 10');
    }

    const response = await this.complete(prompt);
    return this.parseTweets(response, targetCount);
  }

  private withTimeout<T>(promise: Promise<T>, ms: number, provider: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`${provider} timed out after ${ms}ms`)), ms)
      ),
    ]);
  }

  async complete(prompt: string): Promise<string> {
    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }

    if (prompt.length > 10000) { // Reasonable limit for prompts
      throw new Error('Prompt exceeds maximum length of 10000 characters');
    }

    try {
      // Use Groq (So Fast!)
      LoggerService.info('AIOrchestrator', 'Calling Groq...');
      return await this.withTimeout(generateWithGroq(prompt), TIMEOUT_GROQ, 'Groq');
    } catch (groqError) {
      LoggerService.error('AIOrchestrator', 'Groq generation failed', groqError);
      throw new AIGenerationError('AI generation unavailable. Check your connection or API key.', 'Groq');
    }
  }

  private parseTweets(response: string, targetCount: number = 3): string[] {
    // 1. Try to parse specific TWEET_X format (most reliable)
    // Handles: "TWEET_1:", "**TWEET_1:**", "Tweet 1:", "Tweet #1:"
    const specificRegex = /(?:\*\*|#|\s|^)(?:TWEET|Tweet)[_\s]*\d+[:.]\s*(?:\*\*)?/i;
    
    // Split by loosely matching the header
    const segments = response.split(specificRegex);
    
    // Filter out empty segments (usually the preamble before the first tweet)
    const tweets = segments
      .map(s => s.trim())
      .filter(s => s.length > 10); // Minimum tweet length check
      
    if (tweets.length >= targetCount) {
      return tweets.slice(0, targetCount);
    }

    // 2. Fallback: Double newline splitting (Paragraph mode)
    // Useful if AI ignores the tag instructions completely
    const paragraphs = response
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 20 && !p.match(/^(Here is|Sure|I have generated)/i)); // Filter preambles

    return paragraphs.slice(0, targetCount);
  }
}
