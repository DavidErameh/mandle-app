import { IInspirationRepository } from '../interfaces/IInspirationRepository';
import { Inspiration } from '../entities/Inspiration';

export class ConnectAccountUseCase {
  constructor(private inspirationRepo: IInspirationRepository) {}

  async execute(platform: string, handle: string): Promise<Inspiration> {
    const existing = await this.inspirationRepo.getConnectedAccounts();
    if (existing.length >= 4) {
      throw new Error('Maximum of 4 connected accounts reached.');
    }

    if (!handle.startsWith('@')) {
       handle = '@' + handle;
    }
    return await this.inspirationRepo.connectAccount(platform, handle);
  }
}
