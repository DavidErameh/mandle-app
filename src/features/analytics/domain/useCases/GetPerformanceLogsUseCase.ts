import { PerformanceLog } from '../entities/PerformanceLog';
import { PerformanceRepository } from '../../data/repositories/PerformanceRepository';

export class GetPerformanceLogsUseCase {
  constructor(private performanceRepo: PerformanceRepository) {}

  async execute(params?: { minScore?: number }): Promise<PerformanceLog[]> {
    if (params?.minScore !== undefined) {
      return await this.performanceRepo.getHighPerformers(params.minScore);
    }
    return await this.performanceRepo.getAll();
  }
}
