export class VoiceAnalysisPromptBuilder {
  build(examples: string[]): string {
    return `
ANALYZE THE FOLLOWING TWEETS TO EXTRACT THE WRITER'S UNIQUE STYLE AND BRAND VOICE.

EXAMPLES:
${examples.map((ex, i) => `EXAMPLE ${i + 1}:\n"${ex}"`).join('\n\n')}

ACT AS A PROFESSIONAL LINGUISTIC ANALYST. IDENTIFY PATTERNS IN:
1. SENTENCE LENGTH: (Short/Punchy, Moderate, or Long/Descriptive)
2. HOOK TYPES: (e.g., Questions, Contrarian, Direct Value, Story-driven) - provide exactly 3.
3. VOCABULARY: (Key keywords or semantic clusters they use frequently)
4. EMOJI USAGE: (None, Sparse, Moderate, or Heavy)
5. TONE: (e.g., Authoritative, Relatable, Humorous, Academic, Energetic)

FORMAT YOUR RESPONSE AS VALID JSON ONLY:
{
  "sentenceLength": "...",
  "hookTypes": ["...", "...", "..."],
  "vocabulary": "...",
  "emojiUsage": "None|Sparse|Moderate|Heavy",
  "tone": "..."
}
`.trim();
  }
}
