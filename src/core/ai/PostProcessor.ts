import { BrandProfile } from '@/types/entities';
import { GuardrailValidator } from '../brand/GuardrailValidator';
import { ValidationError } from '@/shared/utils/errors';

export class PostProcessor {
  constructor(
    private guardrailValidator: GuardrailValidator
  ) {}

  async process(
    tweets: string[], 
    brandProfile: BrandProfile,
    platform: 'twitter' | 'threads' = 'twitter'
  ): Promise<Array<{ content: string, pattern?: string, violations: string[] }>> {
    const processed: Array<{ content: string, pattern?: string, violations: string[] }> = [];

    for (const tweet of tweets) {
      // 1. Extract pattern metadata if present
      let pattern: string | undefined;
      const patternMatch = tweet.match(/\[Pattern:\s*(.*?)\]/i);
      if (patternMatch) {
        pattern = patternMatch[1].trim();
      }

      // 2. Trim and clean (removing the pattern tag from the text)
      let cleaned = tweet.replace(/\[Pattern:\s*.*?\]/i, '').trim().replace(/\s+/g, ' ');
      
      // 3. Format polishing
      cleaned = this.polish(cleaned);
      
      // 4. Validate guardrails
      let violations = this.guardrailValidator.validate(
        cleaned, 
        brandProfile.guardrails,
        platform
      );
      
      // 5. Attempt auto-correction for length if vital
      if (violations.some((v: string) => v.includes('Too long'))) {
        const max = platform === 'threads' ? 500 : brandProfile.guardrails.characterRange[1];
        cleaned = this.adjustLength(cleaned, max);
        // Refresh violations list after correction
        violations = this.guardrailValidator.validate(cleaned, brandProfile.guardrails, platform);
      }
      
      // We push even with violations, unless it's still way too long
      if (!violations.some((v: string) => v.includes('Too long'))) {
        processed.push({ content: cleaned, pattern, violations });
      }
    }

    // If we filtered out too many tweets, we might throw an error or return what we have
    if (processed.length === 0 && tweets.length > 0) {
      throw new ValidationError('All generated tweets violated guardrails.');
    }

    return processed.slice(0, 3);
  }

  private adjustLength(tweet: string, max: number): string {
    if (tweet.length > max) {
      // Trim to last complete sentence under limit
      // Regex splits by sentence endings (.?!)
      const sentences = tweet.match(/[^.!?]+[.!?]+/g) || [];
      let result = '';
      for (const sentence of sentences) {
        if ((result + sentence).length <= max) {
          result += sentence;
        } else {
          break;
        }
      }
      return result || tweet.slice(0, max - 3) + '...';
    }
    return tweet;
  }

  private polish(tweet: string): string {
    // Fix common punctuation spacing issues
    // "Hello , world" -> "Hello, world"
    // "Hello.World" -> "Hello. World"
    return tweet
      .replace(/\s+([.,!?])/g, '$1')
      .replace(/([.,!?])([A-Z])/g, '$1 $2')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
