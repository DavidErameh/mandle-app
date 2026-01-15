import { generateWithGemini } from './providers/gemini';
import { generateWithGroq } from './providers/groq';
import { AIGenerationError } from '@/shared/utils/errors';
import { LoggerService } from '@/core/utils/LoggerService';

const TIMEOUT_GEMINI = 8000; // 8 seconds timeout for Gemini API
const TIMEOUT_GROQ = 5000;   // 5 seconds timeout for Groq API

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
      // Try Gemini first
      LoggerService.info('AIOrchestrator', 'Calling Gemini (primary)...');
      return await this.withTimeout(generateWithGemini(prompt), TIMEOUT_GEMINI, 'Gemini');
    } catch (geminiError) {
      LoggerService.warn('AIOrchestrator', `Gemini failed or timed out: ${geminiError}`);

      try {
        // Fallback to Groq
        LoggerService.info('AIOrchestrator', 'Calling Groq (fallback)...');
        return await this.withTimeout(generateWithGroq(prompt), TIMEOUT_GROQ, 'Groq');
      } catch (groqError) {
        LoggerService.error('AIOrchestrator', 'Both providers failed', groqError);
        throw new AIGenerationError('AI generation unavailable. Check your connection.', 'All');
      }
    }
  }

  private parseTweets(response: string, targetCount: number = 3): string[] {
    // Parse format: TWEET_1: [content]\nTWEET_2: [content]...
    // Refined regex to be more robust
    const tweets: string[] = [];
    const lines = response.split('\n');
    
    let currentTweet = '';
    let capture = false;

    // Simple parser for reliability over complex regex
    for (const line of lines) {
      if (line.match(/^TWEET_\d+:/i)) {
        if (currentTweet) tweets.push(currentTweet.trim());
        currentTweet = line.replace(/^TWEET_\d+:\s*/i, '');
        capture = true;
      } else if (capture) {
        currentTweet += '\n' + line;
      }
    }
    if (currentTweet) tweets.push(currentTweet.trim());

    if (tweets.length === 0) {
      // Fallback: if no tags found, assume the whole text is one tweet or try to split by double newline
      return response.split(/\n\n+/).filter(t => t.length > 20).slice(0, targetCount);
    }
    
    return tweets.slice(0, targetCount);
  }
}
