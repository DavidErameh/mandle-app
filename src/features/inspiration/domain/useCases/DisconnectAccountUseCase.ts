import { IInspirationRepository } from '../interfaces/IInspirationRepository';

export class DisconnectAccountUseCase {
  constructor(private inspirationRepo: IInspirationRepository) {}

  async execute(id: string): Promise<void> {
    await this.inspirationRepo.disconnectAccount(id);
  }
}
