import AsyncStorage from '@react-native-async-storage/async-storage';
import { useClerk } from '@clerk/expo';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { styled } from 'nativewind';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getLanguageById } from '@/data/languages';
import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/theme';

const StyledImage = styled(Image);

export default function Index() {
  const { signOut } = useClerk();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const clearSelectedLanguage = useLanguageStore((state) => state.clearSelectedLanguage);
  const selectedLanguage = selectedLanguageId ? getLanguageById(selectedLanguageId) : undefined;

  const handleLogout = async () => {
    await signOut();
  };

  const handleClearAsyncStorage = async () => {
    await AsyncStorage.clear();
    clearSelectedLanguage();
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="type--h1 text-center">Lingua</Text>
      <Text className="type--body-medium mt-2 text-center text-text-secondary">
        Your AI-powered language learning app.
      </Text>

      {selectedLanguage ? (
        <View className="mt-7 w-full max-w-[340px] flex-row items-center gap-4 rounded-[22px] border border-border bg-surface p-4">
          <StyledImage
            accessibilityLabel={`${selectedLanguage.name} flag`}
            className="size-14 rounded-full"
            contentFit="cover"
            source={{ uri: selectedLanguage.flagEmoji }}
          />

          <View className="min-w-0 flex-1">
            <Text className="font-inter-regular text-sm text-text-secondary">
              You&apos;re learning
            </Text>
            <Text className="font-inter-semibold text-xl leading-7 text-text-primary">
              {selectedLanguage.name}
            </Text>
            <Text className="font-inter-regular text-sm text-text-secondary">
              {selectedLanguage.nativeName}
            </Text>
          </View>
        </View>
      ) : null}

      <Link href="/language-selection" asChild>
        <TouchableOpacity activeOpacity={0.86} style={styles.primaryButton}>
          <Text className="font-inter-semibold text-base text-background">Change language</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity activeOpacity={0.86} onPress={() => void handleLogout()} style={styles.button}>
        <Text className="font-inter-semibold text-base text-lingua-deep-purple">Log out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.86}
        onPress={() => void handleClearAsyncStorage()}
        style={styles.button}
      >
        <Text className="font-inter-semibold text-base text-lingua-deep-purple">
          Clear AsyncStorage
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    minHeight: 52,
    marginTop: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.brand.deepPurple,
  },
  button: {
    minHeight: 52,
    marginTop: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.brand.deepPurple,
    backgroundColor: colors.neutral.background,
  },
});
