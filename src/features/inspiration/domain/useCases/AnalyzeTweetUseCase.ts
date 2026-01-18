import { AIOrchestrator } from '@/core/ai/orchestrator';

/**
 * Analyzes a shared tweet to extract its structural patterns
 * Used when user shares a tweet from Twitter to Mandle
 */

export interface TweetAnalysis {
  hookType: 'question' | 'statement' | 'stat' | 'story' | 'unknown';
  structure: 'list' | 'narrative' | 'tutorial' | 'hot-take' | 'thread' | 'unknown';
  emotion: 'curiosity' | 'urgency' | 'aspiration' | 'relatability' | 'humor' | 'unknown';
  ctaType: 'follow' | 'retweet' | 'reply' | 'click' | 'none';
  summary: string;
}

export class AnalyzeTweetUseCase {
  private ai = new AIOrchestrator();

  async execute(tweetContent: string): Promise<TweetAnalysis> {
    const prompt = this.buildAnalysisPrompt(tweetContent);
    const response = await this.ai.complete(prompt);
    return this.parseAnalysis(response);
  }

  private buildAnalysisPrompt(content: string): string {
    return `Analyze this tweet and identify its structural elements. Be concise.

TWEET:
"${content}"

Respond in EXACTLY this format (one line each):
HOOK_TYPE: [question|statement|stat|story]
STRUCTURE: [list|narrative|tutorial|hot-take|thread]
EMOTION: [curiosity|urgency|aspiration|relatability|humor]
CTA_TYPE: [follow|retweet|reply|click|none]
SUMMARY: [One sentence describing what makes this tweet effective]`;
  }

  private parseAnalysis(response: string): TweetAnalysis {
    const lines = response.split('\n').filter(l => l.trim());
    
    const getValue = (prefix: string): string => {
      const line = lines.find(l => l.toUpperCase().startsWith(prefix.toUpperCase()));
      return line ? line.split(':').slice(1).join(':').trim().toLowerCase() : 'unknown';
    };

    return {
      hookType: this.parseHookType(getValue('HOOK_TYPE')),
      structure: this.parseStructure(getValue('STRUCTURE')),
      emotion: this.parseEmotion(getValue('EMOTION')),
      ctaType: this.parseCTA(getValue('CTA_TYPE')),
      summary: getValue('SUMMARY') || 'Effective tweet structure',
    };
  }

  private parseHookType(value: string): TweetAnalysis['hookType'] {
    const valid = ['question', 'statement', 'stat', 'story'];
    return valid.includes(value) ? value as TweetAnalysis['hookType'] : 'unknown';
  }

  private parseStructure(value: string): TweetAnalysis['structure'] {
    const valid = ['list', 'narrative', 'tutorial', 'hot-take', 'thread'];
    return valid.includes(value) ? value as TweetAnalysis['structure'] : 'unknown';
  }

  private parseEmotion(value: string): TweetAnalysis['emotion'] {
    const valid = ['curiosity', 'urgency', 'aspiration', 'relatability', 'humor'];
    return valid.includes(value) ? value as TweetAnalysis['emotion'] : 'unknown';
  }

  private parseCTA(value: string): TweetAnalysis['ctaType'] {
    const valid = ['follow', 'retweet', 'reply', 'click', 'none'];
    return valid.includes(value) ? value as TweetAnalysis['ctaType'] : 'none';
  }
}
