import { IInspirationRepository } from '../interfaces/IInspirationRepository';
import { Inspiration } from '../entities/Inspiration';

export class GetInspirationUseCase {
  constructor(private inspirationRepo: IInspirationRepository) {}

  async execute(): Promise<Inspiration[]> {
    return await this.inspirationRepo.getConnectedAccounts();
  }
}
