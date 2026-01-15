import { VoiceAnalysis } from '@/types/entities';
import { AIOrchestrator } from './orchestrator';
import { VoiceAnalysisPromptBuilder } from './prompts/VoiceAnalysisPrompt';

export class VoiceAnalyzer {
  constructor(
    private aiOrchestrator: AIOrchestrator = new AIOrchestrator(),
    private promptBuilder: VoiceAnalysisPromptBuilder = new VoiceAnalysisPromptBuilder()
  ) {}

  async analyze(examples: string[]): Promise<VoiceAnalysis> {
    if (examples.length === 0) {
      return this.getEmptyAnalysis();
    }

    try {
      const prompt = this.promptBuilder.build(examples);
      const response = await this.aiOrchestrator.complete(prompt);
      
      // Clean potential markdown code blocks
      const jsonStr = response.replace(/```json\n?|```/g, '').trim();
      const analysis: VoiceAnalysis = JSON.parse(jsonStr);

      return {
        sentenceLength: analysis.sentenceLength || 'Moderate',
        hookTypes: analysis.hookTypes || [],
        vocabulary: analysis.vocabulary || '',
        emojiUsage: analysis.emojiUsage || 'None',
        tone: analysis.tone || 'Neutral',
      };
    } catch (error) {
      console.error('AI Voice Analysis failed, falling back to heuristics:', error);
      return this.fallbackAnalyze(examples);
    }
  }

  private fallbackAnalyze(examples: string[]): VoiceAnalysis {
    return {
      sentenceLength: this.detectSentenceLength(examples),
      hookTypes: this.detectHookTypes(examples),
      vocabulary: this.detectVocabulary(examples),
      emojiUsage: this.detectEmojiUsage(examples),
      tone: this.detectTone(examples),
    };
  }

  private detectSentenceLength(examples: string[]): string {
    const totalSentences = examples.reduce((acc, ex) => acc + (ex.match(/[.!?]/g) || [1]).length, 0);
    const avgLen = examples.join(' ').length / totalSentences;

    if (avgLen < 40) return 'Short and punchy';
    if (avgLen < 80) return 'Moderate, balanced flow';
    return 'Long, descriptive sentences';
  }

  private detectHookTypes(examples: string[]): string[] {
    const hooks = new Set<string>();
    examples.forEach(ex => {
      const lower = ex.toLowerCase();
      if (lower.includes('?')) hooks.add('Question-based');
      if (lower.startsWith('i ') || lower.startsWith('my ')) hooks.add('Personal narrative');
      if (lower.match(/\d+%/)) hooks.add('Data/Stat driven');
      if (lower.startsWith('what ') || lower.startsWith('how ')) hooks.add('Educational');
      if (lower.match(/^(don't|stop|never)/)) hooks.add('Contrarian/Warning');
    });
    return Array.from(hooks).slice(0, 3);
  }

  private detectVocabulary(examples: string[]): string {
    const techWords = ['ai', 'code', 'build', 'system', 'startup', 'product', 'logic'];
    const humanWords = ['feel', 'think', 'believe', 'journey', 'life', 'people'];
    
    const text = examples.join(' ').toLowerCase();
    const techCount = techWords.filter(w => text.includes(w)).length;
    const humanCount = humanWords.filter(w => text.includes(w)).length;

    if (techCount > humanCount) return 'Technical and precise';
    if (humanCount > techCount) return 'Empathetic and human-centric';
    return 'General / Balanced';
  }

  private detectEmojiUsage(examples: string[]): string {
    const emojiMatch = examples.join('').match(/[\u{1F300}-\u{1F9FF}]/gu);
    const count = emojiMatch ? emojiMatch.length : 0;
    const density = count / examples.length;

    if (density === 0) return 'None';
    if (density < 0.5) return 'Sparse (accent only)';
    if (density < 1.5) return 'Moderate (1-2 per post)';
    return 'Heavy (expressive)';
  }

  private detectTone(examples: string[]): string {
    const content = examples.join(' ').toLowerCase();
    if (content.match(/!(.*?)!(.*?)!/)) return 'Energetic / High Tempo';
    if (content.includes('actually') || content.includes('however')) return 'Analytical / Intellectual';
    if (content.includes('cool') || content.includes('awesome') || content.includes('guy')) return 'Casual / Relatable';
    return 'Professional / Direct';
  }

  private getEmptyAnalysis(): VoiceAnalysis {
    return {
      sentenceLength: 'Indeterminate',
      hookTypes: [],
      vocabulary: 'Indeterminate',
      emojiUsage: 'None',
      tone: 'Neutral',
    };
  }
}
