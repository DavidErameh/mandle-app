import { SaveVersionUseCase } from '@/features/collaboration/domain/useCases/SaveVersionUseCase';
import { VersionRepository } from '@/features/collaboration/data/repositories/VersionRepository';

// Create a shared instance of SaveVersionUseCase for use in other contexts
// This is necessary because GenerateContext depends on this use case
export const saveVersionUseCase = new SaveVersionUseCase(new VersionRepository());