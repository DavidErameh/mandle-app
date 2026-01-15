import { IInspirationRepository } from '../interfaces/IInspirationRepository';
import { InspirationTweet } from '../entities/Inspiration';

export class GetTopTweetsUseCase {
  constructor(private inspirationRepo: IInspirationRepository) {}

  async execute(accountId: string): Promise<InspirationTweet[]> {
    return await this.inspirationRepo.getTopTweets(accountId);
  }
}
