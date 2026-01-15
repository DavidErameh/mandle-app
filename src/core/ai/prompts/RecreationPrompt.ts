import { BrandProfile } from '@/types/entities';
import { DetailedAnalysis } from '../PatternExtractor';

export class RecreationPrompt {
  static build(content: string, analysis: DetailedAnalysis, profile: BrandProfile): string {
    const voiceExamples = (profile.voiceExamples || []).slice(0, 3).join('\n\n');
    
    return `
You are a master social media content creator. Your task is to take a viral tweet and RECREATE it perfectly in the USER'S VOICE while keeping the EXACT SAME viral structure.

ORIGINAL TWEET TO ADAPT:
"""
${content}
"""

VIRAL STRUCTURE ANALYSIS (STAY TRUE TO THIS):
- Hook Type: ${analysis.hookType}
- Overall Structure: ${analysis.structure}
- Emotional Driver: ${analysis.emotion}
- CTA Type: ${analysis.ctaType}

USER'S BRAND VOICE:
${profile.systemPrompt}

USER'S STYLE ANALYSIS:
- Tone: ${profile.voiceAnalysis?.tone || 'Conversational'}
- Language: ${profile.voiceAnalysis?.vocabulary || 'Standard'}
- Formatting Style: ${profile.voiceAnalysis?.sentenceLength || 'Varied'}

USER'S WRITING EXAMPLES:
${voiceExamples}

GOAL:
Generate 3 variations of the original idea, adapted to the user's domain and voice.
Each variation MUST use the exact same ${analysis.hookType} style and ${analysis.structure} structure.
DO NOT use the original words. Adapt the VALUE to the user's expertise.

OUTPUT FORMAT:
Return exactly 3 variations, separated by "---".
Example:
Variation 1
---
Variation 2
---
Variation 3
`;
  }
}
