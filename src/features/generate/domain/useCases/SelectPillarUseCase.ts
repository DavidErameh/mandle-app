import { ContentPillar } from '../entities/ContentPillar';
import { ContentPillarRepository } from '../../data/repositories/ContentPillarRepository';

export class SelectPillarUseCase {
  constructor(private pillarRepo: ContentPillarRepository) {}

  async execute(): Promise<ContentPillar> {
    return await this.pillarRepo.getNextInRotation();
  }
}
