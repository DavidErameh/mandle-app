import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  isOnline: boolean;
  currentPillar: string;
  generationCount: number;
  setOnline: (status: boolean) => void;
  setCurrentPillar: (pillar: string) => void;
  incrementGenerationCount: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnline: true,
      currentPillar: "",
      generationCount: 0,
      setOnline: (status) => set({ isOnline: status }),
      setCurrentPillar: (pillar) => set({ currentPillar: pillar }),
      incrementGenerationCount: () =>
        set((state) => ({ generationCount: state.generationCount + 1 })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
