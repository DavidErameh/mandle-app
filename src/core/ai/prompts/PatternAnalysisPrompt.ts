export class PatternAnalysisPromptBuilder {
  build(tweetContent: string): string {
    return `
DECONSTRUCT THIS TWEET INTO ITS WINNING DNA.

TWEET CONTENT:
"${tweetContent}"

ANALYZE AND EXTRACT THE FOLLOWING PATTERN DATA:
1. HUOK TYPE: (e.g., Question, Data-driven, Story-opener, Contrarian, Direct Value)
2. STRUCTURE: (e.g., List, Narrative, Comparison, Problem-Solution, How-to)
3. EMOTIONAL TRIGGER: (e.g., Curiosity, Urgency, Aspiration, Relatability, Fear of Missing Out)
4. CTA TYPE: (e.g., Follow, Reply, Click, Action, None)
5. INTENSITY: (low, medium, high) based on how "aggressive" or "viral-baity" the hook is.

FORMAT YOUR RESPONSE AS VALID JSON ONLY:
{
  "name": "Short descriptive name for this pattern (e.g., The Contrarian Data Hook)",
  "description": "One sentence describing why this works.",
  "hookType": "...",
  "structure": "...",
  "emotion": "...",
  "ctaType": "...",
  "intensity": "low|medium|high"
}
`.trim();
  }
}
