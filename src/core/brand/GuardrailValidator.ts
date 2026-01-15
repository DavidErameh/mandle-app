import { BrandProfile } from '@/types/entities';
import { ValidationError } from '@/shared/utils/errors';

export class GuardrailValidator {
  validate(content: string, guardrails: BrandProfile['guardrails'], platform: 'twitter' | 'threads' = 'twitter'): string[] {
    const violations: string[] = [];

    // 1. Check prohibited topics (Simple keyword match for now)
    for (const topic of guardrails.avoidTopics) {
      if (content.toLowerCase().includes(topic.toLowerCase())) {
        violations.push(`Contains prohibited topic: ${topic}`);
      }
    }

    // 2. Check character length
    let [min, max] = guardrails.characterRange;
    
    // Platform Overrides
    if (platform === 'threads' && max <= 280) {
      max = 500; // Threads default if profile is still set to Twitter default
    }

    if (content.length < min) {
      violations.push(`Too short (${content.length} chars). Min: ${min}`);
    }
    if (content.length > max) {
      violations.push(`Too long (${content.length} chars). Max: ${max}`);
    }

    // 3. Check hashtags
    const hashtags = (content.match(/#[a-z0-9_]+/gi) || []).length;
    const maxHashtags = platform === 'threads' ? 0 : guardrails.maxHashtags;
    
    if (hashtags > maxHashtags) {
      violations.push(`Too many hashtags (${hashtags}). Max for ${platform}: ${maxHashtags}`);
    }

    return violations;
  }
}
