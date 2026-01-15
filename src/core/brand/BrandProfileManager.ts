import { BrandProfileRepository } from '@/features/settings/data/repositories/BrandProfileRepository';
import { VoiceAnalyzer } from '../ai/VoiceAnalyzer';
import { BrandProfile } from '@/types/entities';

export class BrandProfileManager {
  private repository = new BrandProfileRepository();
  private analyzer = new VoiceAnalyzer();

  async getActiveProfile(): Promise<BrandProfile> {
    return await this.repository.getProfile();
  }

  async updateProfile(profile: Partial<BrandProfile>): Promise<void> {
    // If examples changed, re-analyze
    if (profile.voiceExamples) {
      profile.voiceAnalysis = await this.analyzer.analyze(profile.voiceExamples);
    }
    
    await this.repository.saveProfile(profile);
  }
}
