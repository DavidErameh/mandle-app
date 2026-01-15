import { VersionRepository } from '../../data/repositories/VersionRepository';
import { Version } from '../entities/Version';

export class GetVersionHistoryUseCase {
  constructor(private versionRepo: VersionRepository) {}

  async execute(draftId: string): Promise<Version[]> {
    return this.versionRepo.getByDraftId(draftId);
  }
}
