import { Tweet } from '../entities/Tweet';

export interface ITweetRepository {
  saveDrafts(tweets: Tweet[]): Promise<void>;
  getDrafts(limit?: number): Promise<Tweet[]>;
}
