import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'mandle_is_onboarded_v1';

export const OnboardingService = {
  async isOnboarded(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (e) {
      console.error('Failed to check onboarding status', e);
      return false;
    }
  },

  async completeOnboarding(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      console.error('Failed to save onboarding status', e);
    }
  },

  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (e) {
      console.error('Failed to reset onboarding status', e);
    }
  }
};
