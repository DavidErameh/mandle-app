import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tweet } from '@/features/generate/domain/entities/Tweet';

interface AppState {
  // Online status
  isOnline: boolean;
  setOnline: (status: boolean) => void;
  
  // Current generation context
  currentPillar: string | null;
  setCurrentPillar: (pillarId: string) => void;
  
  // Generation history (simplified cache)
  recentTweets: Tweet[];
  addTweet: (tweet: Tweet) => void;
  clearRecentTweets: () => void;
  
  // User preferences
  preferences: {
    hapticFeedback: boolean;
    autoSave: boolean;
    syncInterval: number;
  };
  updatePreferences: (prefs: Partial<AppState['preferences']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isOnline: true,
      currentPillar: null,
      recentTweets: [],
      preferences: {
        hapticFeedback: true,
        autoSave: true,
        syncInterval: 300000, // 5 minutes
      },

      // Actions
      setOnline: (status) => set({ isOnline: status }),
      
      setCurrentPillar: (pillarId) => set({ currentPillar: pillarId }),
      
      addTweet: (tweet) => set((state) => ({
        recentTweets: [tweet, ...state.recentTweets].slice(0, 10),
      })),
      
      clearRecentTweets: () => set({ recentTweets: [] }),
      
      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs },
      })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
