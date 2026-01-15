import { generateUUID } from '@/shared/utils/validation';

export interface PerformanceMetrics {
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  follows: number;
  clicks?: number;
}

export interface PerformanceLogProps {
  id?: string;
  draftId?: string;
  content: string;
  platform: 'twitter' | 'threads';
  metrics: PerformanceMetrics;
  tags?: string[];
  postedAt: Date;
  createdAt?: Date;
  successScore?: number;
}

export class PerformanceLog {
  id: string;
  draftId?: string;
  content: string;
  platform: 'twitter' | 'threads';
  metrics: PerformanceMetrics;
  tags: string[];
  postedAt: Date;
  createdAt: Date;
  successScore: number;

  constructor(props: PerformanceLogProps) {
    this.id = props.id || generateUUID();
    this.draftId = props.draftId;
    this.content = props.content;
    this.platform = props.platform;
    this.metrics = props.metrics;
    this.tags = props.tags || [];
    this.postedAt = props.postedAt;
    this.createdAt = props.createdAt || new Date();
    this.successScore = props.successScore ?? this.calculateScore();
  }

  private calculateScore(): number {
    const { impressions, likes, retweets, replies, follows } = this.metrics;
    
    if (impressions === 0) return 0;

    const engagementCount = likes + retweets + replies;
    const engagementRate = engagementCount / impressions;

    // Formula: (impressions/1000 * 0.3) + (ER * 10 * 0.4) + (follows * 0.3)
    const score = (
      (impressions / 1000) * 0.3 +
      (engagementRate * 10) * 0.4 +
      (follows) * 0.3
    );

    return Math.min(Math.max(score, 0), 10);
  }

  get engagementRate(): number {
    if (this.metrics.impressions === 0) return 0;
    return (this.metrics.likes + this.metrics.retweets + this.metrics.replies) / this.metrics.impressions;
  }
}
