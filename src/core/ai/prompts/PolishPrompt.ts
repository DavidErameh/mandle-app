import { BrandProfile } from '@/types/entities';

export type PolishStyle = 
  | 'punchier'
  | 'simplify'
  | 'add-hook'
  | 'conversational'
  | 'professional'
  | 'emotional'
  | 'shorter';

export const POLISH_STYLE_DESCRIPTIONS: Record<PolishStyle, string> = {
  'punchier': 'Make it more impactful with stronger words and a memorable hook',
  'simplify': 'Remove complexity while keeping the core message',
  'add-hook': 'Add an attention-grabbing opening line',
  'conversational': 'Make it sound more natural and friendly',
  'professional': 'Make it sound more authoritative and polished',
  'emotional': 'Add emotional resonance to connect with readers',
  'shorter': 'Condense without losing the message or voice',
};

export class PolishPromptBuilder {
  build(
    originalContent: string, 
    style: PolishStyle, 
    brandProfile: BrandProfile,
    platform: 'twitter' | 'threads' = 'twitter'
  ): string {
    const maxLength = platform === 'twitter' ? 280 : 500;
    
    return `
You are a professional tweet editor. Your task is to rewrite the following content.

ORIGINAL TWEET:
"${originalContent}"

EDITING STYLE: ${style.toUpperCase()}
${POLISH_STYLE_DESCRIPTIONS[style]}

BRAND VOICE CONSTRAINTS:
- Tone: ${brandProfile.guardrails.tone}
- Allowed topics: ${brandProfile.guardrails.allowedTopics.join(', ')}
- Avoid: ${brandProfile.guardrails.avoidTopics.join(', ')}
- Platform: ${platform.toUpperCase()}
- Max length: ${maxLength} characters

VOICE EXAMPLES TO MATCH:
${brandProfile.voiceExamples.slice(0, 3).map((ex, i) => `${i + 1}. "${ex}"`).join('\n')}

INSTRUCTIONS:
1. Apply the "${style}" editing style to transform the tweet
2. Keep the core message and intent
3. Match the voice from the examples above
4. Stay under ${maxLength} characters
5. ${platform === 'threads' ? 'Do NOT use hashtags' : 'Use max 2 hashtags if relevant'}
6. Return ONLY the polished tweet, nothing else

POLISHED VERSION:
    `.trim();
  }
}
