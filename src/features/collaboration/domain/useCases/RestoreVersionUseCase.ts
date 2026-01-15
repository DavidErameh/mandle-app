import { VersionRepository } from '../../data/repositories/VersionRepository';
import { TweetRepository } from '@/features/generate/data/repositories/TweetRepository';
import { Version } from '../entities/Version';

export class RestoreVersionUseCase {
  constructor(
    private versionRepo: VersionRepository,
    private tweetRepo: TweetRepository
  ) {}

  async execute(version: Version): Promise<void> {
    // 1. Update the actual draft content
    await this.tweetRepo.updateContent(version.draftId, version.content);
    
    // 2. record the restoration as a new version node
    const restoreRecord = new Version({
      draftId: version.draftId,
      content: version.content,
      author: 'creator',
      changeType: 'polished',
      parentVersion: version.id
    });
    
    await this.versionRepo.save(restoreRecord);
  }
}
