import { VersionRepository } from '../../data/repositories/VersionRepository';
import { Version } from '../entities/Version';

interface SaveVersionParams {
  draftId: string;
  content: string;
  author: 'creator' | 'assistant';
  changeType: 'generated' | 'edited' | 'polished';
}

export class SaveVersionUseCase {
  constructor(private versionRepo: VersionRepository) {}

  async execute(params: SaveVersionParams): Promise<Version> {
    const latest = await this.versionRepo.getLatestForDraft(params.draftId);
    
    // Don't save if content is identical to latest version
    if (latest && latest.content === params.content) {
      return latest;
    }

    const version = new Version({
      ...params,
      parentVersion: latest?.id
    });

    await this.versionRepo.save(version);
    return version;
  }
}
