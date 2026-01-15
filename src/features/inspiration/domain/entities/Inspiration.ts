export interface InspirationPattern {
  id: string;
  description: string;
  effectiveness: number; // 1-10
}

export interface InspirationTweet {
  content: string;
  engagement: number;
  date: Date;
  patterns: string[];
}

export class Inspiration {
  id: string;
  accountName: string;
  platform: 'twitter' | 'threads';
  viralScore: number;
  patterns: InspirationPattern[];
  topTweets: InspirationTweet[];
  lastActive: Date;
  avatarUrl?: string;

  constructor(data: Partial<Inspiration>) {
    this.id = data.id || crypto.randomUUID();
    this.accountName = data.accountName || '';
    this.platform = data.platform || 'twitter';
    this.viralScore = data.viralScore || 0;
    this.patterns = data.patterns || [];
    this.topTweets = data.topTweets || [];
    this.lastActive = data.lastActive ? new Date(data.lastActive) : new Date();
    this.avatarUrl = data.avatarUrl;
  }
}
