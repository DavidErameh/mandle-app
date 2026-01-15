export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Tweet extends BaseEntity {
  content: string;
  platform: 'twitter' | 'threads';
  variant: number;
}

export interface Note extends BaseEntity {
  content: string;
  tags: string[];
  state: 'draft' | 'ready' | 'generated' | 'posted' | 'archived';
  pillarId?: string;
}

export interface ContentPillar extends BaseEntity {
  name: string;
  description: string;
  examples: string[];
  tags?: string[];
  active: boolean;
  lastUsed?: Date;
  usageCount: number;
}

export interface VoiceAnalysis {
  sentenceLength: string;
  hookTypes: string[];
  vocabulary: string;
  emojiUsage: string;
  tone: string;
}

export interface BrandProfile extends BaseEntity {
  systemPrompt: string;
  guardrails: {
    allowedTopics: string[];
    avoidTopics: string[];
    tone: string;
    maxHashtags: number;
    characterRange: [number, number];
  };
  voiceExamples: string[];
  voiceAnalysis?: VoiceAnalysis;
}
