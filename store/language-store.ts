import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LanguageId } from '@/types/learning';

interface LanguageState {
  selectedLanguageId: LanguageId | null;
  setSelectedLanguage: (languageId: LanguageId) => void;
  clearSelectedLanguage: () => void;
}

export const LANGUAGE_STORAGE_KEY = 'lingua-language-storage';

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguage: (selectedLanguageId) => set({ selectedLanguageId }),
      clearSelectedLanguage: () => set({ selectedLanguageId: null }),
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
      }),
    },
  ),
);

export function useLanguageStoreHydration() {
  const [hasHydrated, setHasHydrated] = useState(
    useLanguageStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribeHydrationStart = useLanguageStore.persist.onHydrate(() => {
      setHasHydrated(false);
    });
    const unsubscribeHydrationFinish =
      useLanguageStore.persist.onFinishHydration(() => {
        setHasHydrated(true);
      });

    setHasHydrated(useLanguageStore.persist.hasHydrated());

    return () => {
      unsubscribeHydrationStart();
      unsubscribeHydrationFinish();
    };
  }, []);

  return hasHydrated;
}
