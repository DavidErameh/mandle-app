import { GenerationContext } from '../memory/ContextBuilder';
import { BrandProfile } from '@/types/entities';
import { SystemPromptBuilder } from './SystemPromptBuilder';

export class GenerationPromptBuilder {
  constructor(private systemPromptBuilder: SystemPromptBuilder) {}

  build(context: GenerationContext, platform: 'twitter' | 'threads' = 'twitter'): string {
    return `
${this.systemPromptBuilder.build(context.brandProfile)}

${this.buildGuardrailsSection(context.brandProfile.guardrails, platform)}

${this.buildVoiceSection(context.brandProfile)}

${this.buildContextSection(context)}

${this.buildInstructionsSection(platform)}

Generate 3 tweet variations about: ${this.getTopicFromContext(context)}
    `.trim();
  }

  private buildGuardrailsSection(guardrails: BrandProfile['guardrails'], platform: 'twitter' | 'threads'): string {
    if (!guardrails) {
      return `GUARDRAILS: Use best judgment for content creation.`;
    }
    let [min, max] = guardrails.characterRange || [50, 280];
    if (platform === 'threads' && max <= 280) max = 500;

    return `
GUARDRAILS (NEVER VIOLATE):
- Allowed topics: ${(guardrails.allowedTopics || []).join(', ') || 'General'}
- Avoid topics: ${(guardrails.avoidTopics || []).join(', ') || 'None specified'}
- Tone: ${guardrails.tone || 'Professional'}
- Max hashtags: ${platform === 'threads' ? 0 : (guardrails.maxHashtags || 2)}
- Character range: ${min}-${max}
    `.trim();
  }

  private buildVoiceSection(profile: BrandProfile): string {
    let section = '';
    
    if (profile.voiceAnalysis) {
      const a = profile.voiceAnalysis;
      section += `
STYLE ANALYSIS (Follow these patterns strictly):
- Tone: ${a.tone || 'Professional'}
- Sentence Structure: ${a.sentenceLength || 'Mixed'}
- Vocabulary: ${a.vocabulary || 'Accessible'}
- Emoji Usage: ${a.emojiUsage || 'Minimal'}
- Common Hook patterns: ${(a.hookTypes || []).join(', ') || 'Various'}
      `.trim() + '\n\n';
    }

    const examples = profile.voiceExamples || [];
    section += `VOICE EXAMPLES (Match this style exactly):\n`;
    section += examples.slice(0, 5).map((ex, i) => `${i + 1}. "${ex}"`).join('\n') || 'No examples provided.';
    
    return section.trim();
  }

  private buildContextSection(context: GenerationContext): string {
    let contextStr = '';

    if (context.pastSuccesses.length > 0) {
      contextStr += `\nPAST HIGH-PERFORMERS (Reference these as winning style DNA):\n`;
      contextStr += context.pastSuccesses
        .map((log: any) => `- "${log.content}" (Success Score: ${log.successScore}/10)`)
        .join('\n');
    }

    if (context.readyNotes.length > 0) {
      contextStr += `\n\nIDEAS TO EXPAND:\n`;
      contextStr += context.readyNotes
        .map(note => `- ${note.content}`)
        .join('\n');
    }

    if (context.viralPatterns.length > 0) {
      contextStr += `\n\nPROVEN VIRAL STRUCTURES (Mimic these):\n`;
      contextStr += context.viralPatterns
        .map(p => `- [${p.name}]: ${p.description}`)
        .join('\n');
    }

    return contextStr;
  }

  private buildInstructionsSection(platform: 'twitter' | 'threads'): string {
    const isThreads = platform === 'threads';
    return `
INSTRUCTIONS:
1. Generate exactly 3 variations for ${platform.toUpperCase()}
2. Each content must be ${isThreads ? 'up to 500' : '240-280'} characters
3. Different angles/hooks for each
4. Match the voice examples exactly
5. Follow all guardrails strictly
6. Use conversational, engaging tone
7. ${isThreads ? 'AVOID all hashtags.' : 'Use up to 2 relevant hashtags.'}
8. End with subtle CTA or engagement hook
9. IMPORTANT: For each variation, pick ONE "PROVEN VIRAL STRUCTURE" from the context above and follow its DNA strictly.
10. At the very end of EACH variation, add "[Pattern: Name]" so I know which one you used.

Format:
TWEET_1: [content] [Pattern: Pattern Name]
TWEET_2: [content] [Pattern: Pattern Name]
TWEET_3: [content] [Pattern: Pattern Name]
    `.trim();
  }

  private getTopicFromContext(context: GenerationContext): string {
    if (context.readyNotes.length > 0) {
      return context.readyNotes[0].content;
    }
    return context.pillar.description || context.pillar.name;
  }
}
