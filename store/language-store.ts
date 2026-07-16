import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LanguageId } from '@/types/learning';

interface LanguageState {
  selectedLanguageId: LanguageId | null;
  hasHydrated: boolean;
  setSelectedLanguage: (languageId: LanguageId) => void;
  clearSelectedLanguage: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const LANGUAGE_STORAGE_KEY = 'lingua-language-storage';

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      hasHydrated: false,
      setSelectedLanguage: (selectedLanguageId) => set({ selectedLanguageId }),
      clearSelectedLanguage: () => set({ selectedLanguageId: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
      }),
      onRehydrateStorage: (state) => () => {
        state.setHasHydrated(true);
      },
    },
  ),
);
