import { Inspiration, InspirationTweet } from '../entities/Inspiration';

export interface IInspirationRepository {
  getConnectedAccounts(): Promise<Inspiration[]>;
  getViralPatterns(limit?: number): Promise<string[]>;
  connectAccount(platform: string, handle: string): Promise<Inspiration>;
  disconnectAccount(id: string): Promise<void>;
  getTopTweets(accountId: string): Promise<InspirationTweet[]>;
}
