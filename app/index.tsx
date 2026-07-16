import { Redirect } from 'expo-router';

import {
  useLanguageStore,
  useLanguageStoreHydration,
} from '@/store/language-store';

export default function Index() {
  const hasHydrated = useLanguageStoreHydration();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);

  if (!hasHydrated) {
    return null;
  }

  return (
    <Redirect href={selectedLanguageId ? '/(tabs)' : '/language-selection'} />
  );
}
