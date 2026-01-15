import { GenerationContext } from '../memory/ContextBuilder';
import { BrandProfile } from '@/types/entities';
import { SystemPromptBuilder } from './SystemPromptBuilder';

export class ThreadPromptBuilder {
  constructor(private systemPromptBuilder: SystemPromptBuilder) {}

  build(context: GenerationContext, noteContent: string, platform: 'twitter' | 'threads' = 'twitter'): string {
    return `
${this.systemPromptBuilder.build(context.brandProfile)}

${this.buildGuardrailsSection(context.brandProfile.guardrails, platform)}

${this.buildVoiceSection(context.brandProfile)}

${this.buildThreadStructureSection()}

${this.buildContextSection(context)}

Expand the following note into a COHERENT 5-7 tweet thread:
"${noteContent}"
    `.trim();
  }

  private buildGuardrailsSection(guardrails: BrandProfile['guardrails'], platform: 'twitter' | 'threads'): string {
    let [min, max] = guardrails.characterRange;
    if (platform === 'threads' && max <= 280) max = 500;

    return `
GUARDRAILS (NEVER VIOLATE):
- Allowed topics: ${guardrails.allowedTopics.join(', ')}
- Avoid topics: ${guardrails.avoidTopics.join(', ')}
- Tone: ${guardrails.tone}
- Max hashtags: ${platform === 'threads' ? 0 : guardrails.maxHashtags}
- Character range: ${min}-${max}
    `.trim();
  }

  private buildVoiceSection(profile: BrandProfile): string {
    let section = '';
    
    if (profile.voiceAnalysis) {
      const a = profile.voiceAnalysis;
      section += `
STYLE ANALYSIS (Follow these patterns strictly):
- Tone: ${a.tone}
- Sentence Structure: ${a.sentenceLength}
- Vocabulary: ${a.vocabulary}
- Emoji Usage: ${a.emojiUsage}
- Common Hook patterns: ${a.hookTypes.join(', ')}
      `.trim() + '\n\n';
    }

    section += `VOICE EXAMPLES (Match this style exactly):\n`;
    section += profile.voiceExamples.slice(0, 5).map((ex, i) => `${i + 1}. "${ex}"`).join('\n');
    
    return section.trim();
  }

  private buildThreadStructureSection(): string {
    return `
THREAD STRUCTURE:
- TWEET 1: THE HOOK. Must create a curiosity gap or promise high value.
- TWEETS 2-5: THE MEAT. Each tweet should deliver a specific sub-point or bit of value. Must be standalone but connected.
- TWEET 6: THE CONCLUSION/CTA. Summarize or provide a clear next step.
- TWEET 7 (Optional): THE ENGAGEMENT. Ask a specific question to spark replies.

FORMATTING:
- Number each tweet (e.g., 1/6, 2/6 or 1/, 2/...)
- Use line breaks for readability.
- No more than 2 emojis per tweet.
    `.trim();
  }

  private buildContextSection(context: GenerationContext): string {
    let contextStr = '';

    if (context.pastSuccesses.length > 0) {
      contextStr += `\nPAST SUCCESSES (Study the pacing and structure):\n`;
      contextStr += context.pastSuccesses
        .map((log: any) => `- "${log.content}"`)
        .join('\n');
    }

    if (context.viralPatterns.length > 0) {
      contextStr += `\n\nNICHE PATTERNS:\n`;
      contextStr += context.viralPatterns.join(', ');
    }

    return contextStr;
  }

  getInstructions(platform: 'twitter' | 'threads' = 'twitter'): string {
    const isThreads = platform === 'threads';
    return `
INSTRUCTIONS:
1. Generate a thread of 5-7 tweets for ${platform.toUpperCase()}.
2. Ensure logical flow between tweets.
3. Every tweet must be between ${isThreads ? '100-500' : '240-280'} characters.
4. Follow the provided Thread Structure strictly.
${isThreads ? '5. AVOID hashtags entirely.' : '5. Use minimal relevant hashtags if needed.'}

Format:
TWEET_1: [content]
TWEET_2: [content]
...and so on up to TWEET_7.
    `.trim();
  }
}
