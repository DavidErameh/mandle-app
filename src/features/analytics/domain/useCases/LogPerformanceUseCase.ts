import { PerformanceLog, PerformanceLogProps } from '../entities/PerformanceLog';
import { PerformanceRepository } from '../../data/repositories/PerformanceRepository';

export class LogPerformanceUseCase {
  constructor(private performanceRepo: PerformanceRepository) {}

  async execute(props: PerformanceLogProps): Promise<PerformanceLog> {
    const log = new PerformanceLog(props);
    await this.performanceRepo.save(log);
    return log;
  }
}
