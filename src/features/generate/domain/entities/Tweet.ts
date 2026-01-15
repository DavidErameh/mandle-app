export interface TweetProps {
  id: string;
  content: string;
  platform: 'twitter' | 'threads';
  createdAt: Date;
  variant: number;
  pattern?: string;
  inspiredBy?: string;
  violations: string[];
}

export class Tweet {
  id: string;
  content: string;
  platform: 'twitter' | 'threads';
  createdAt: Date;
  variant: number;
  pattern?: string;
  inspiredBy?: string;
  violations: string[];

  constructor(data: Partial<TweetProps>) {
    this.id = data.id || crypto.randomUUID();
    this.content = data.content || '';
    this.platform = data.platform || 'twitter';
    this.createdAt = data.createdAt || new Date();
    this.variant = data.variant || 1;
    this.pattern = data.pattern;
    this.inspiredBy = data.inspiredBy;
    this.violations = data.violations || [];
  }

  get hasViolations(): boolean {
    return this.violations.length > 0;
  }

  get characterCount(): number {
    return this.content.length;
  }

  get withinLimit(): boolean {
    return this.characterCount <= 280;
  }

  get formattedDate(): string {
    return this.createdAt.toLocaleDateString();
  }
}
