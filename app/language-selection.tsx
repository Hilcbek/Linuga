import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { images } from '@/constants/images';
import { languages } from '@/data/languages';
import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/theme';
import type { LanguageId } from '@/types/learning';

const StyledImage = styled(Image);

function formatLearnerCount(learnerCount: number) {
  return `${(learnerCount / 1_000_000).toFixed(1)}M learners`;
}

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const setSelectedLanguage = useLanguageStore((state) => state.setSelectedLanguage);
  const [query, setQuery] = useState('');
  const [draftLanguageId, setDraftLanguageId] = useState<LanguageId>(
    selectedLanguageId ?? 'spanish',
  );

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return languages;
    }

    return languages.filter((language) =>
      `${language.name} ${language.nativeName}`.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const handleBack = () => {
    if (!selectedLanguageId) {
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  const handleConfirm = () => {
    setSelectedLanguage(draftLanguageId);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={colors.neutral.background} />

      <View className="h-17 flex-row items-center justify-center px-6">
        <TouchableOpacity
          accessibilityLabel="Go back"
          activeOpacity={0.7}
          className="absolute left-5 size-12 items-center justify-center"
          onPress={handleBack}
        >
          <Ionicons color={colors.neutral.textPrimary} name="chevron-back" size={31} />
        </TouchableOpacity>

        <Text className="font-inter-semibold text-[22px] leading-7 text-text-primary">
          Choose a language
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-13.5 flex-row items-center gap-3 rounded-full border border-border bg-[#FBFBFD] px-5">
          <Ionicons color="#66708F" name="search-outline" size={25} />
          <TextInput
            accessibilityLabel="Search languages"
            autoCapitalize="none"
            autoCorrect={false}
            className="min-w-0 flex-1 font-inter-regular text-base text-text-primary"
            onChangeText={setQuery}
            placeholder="Search languages"
            placeholderTextColor="#66708F"
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />
          {query.length > 0 ? (
            <TouchableOpacity
              accessibilityLabel="Clear search"
              activeOpacity={0.7}
              onPress={() => setQuery('')}
            >
              <Ionicons color="#8A92AA" name="close-circle" size={21} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="gap-3 pt-6">
          <Text className="font-inter-semibold text-[18px] leading-6 text-text-primary">
            Popular
          </Text>

          <View className="gap-2">
            {filteredLanguages.map((language) => {
              const isSelected = language.id === draftLanguageId;

              return (
                <TouchableOpacity
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  activeOpacity={0.82}
                  className="h-20.5 flex-row items-center rounded-[22px] px-4"
                  key={language.id}
                  onPress={() => setDraftLanguageId(language.id)}
                  style={[styles.languageCard, isSelected && styles.selectedLanguageCard]}
                >
                  <StyledImage
                    accessibilityLabel={`${language.name} flag`}
                    className="size-10.5 rounded-full"
                    contentFit="cover"
                    source={{ uri: language.flagEmoji }}
                  />

                  <View className="min-w-0 flex-1 gap-0.5 px-4">
                    <Text className="font-inter-medium text-[17px] leading-6 text-text-primary">
                      {language.name}
                    </Text>
                    <Text className="font-inter-regular text-[14px] leading-5 text-[#66708F]">
                      {formatLearnerCount(language.learnerCount)}
                    </Text>
                  </View>

                  {isSelected ? (
                    <View className="size-9 items-center justify-center rounded-full bg-lingua-deep-purple">
                      <Ionicons color={colors.neutral.background} name="checkmark" size={25} />
                    </View>
                  ) : (
                    <Ionicons color="#66708F" name="chevron-forward" size={25} />
                  )}
                </TouchableOpacity>
              );
            })}

            {filteredLanguages.length === 0 ? (
              <View className="items-center gap-2 px-6 py-12">
                <Ionicons color="#8A92AA" name="search-outline" size={38} />
                <Text className="font-inter-medium text-base text-text-primary">
                  No languages found
                </Text>
                <Text className="text-center font-inter-regular text-sm leading-5 text-text-secondary">
                  Try searching with another language name.
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          accessibilityLabel="Confirm language selection"
          activeOpacity={0.86}
          className="h-[58px] flex-row items-center justify-center gap-2 rounded-[20px] bg-lingua-deep-purple"
          onPress={handleConfirm}
        >
          <Text className="font-inter-semibold text-[17px] leading-6 text-background">Continue</Text>
          <Ionicons color={colors.neutral.background} name="arrow-forward" size={22} />
        </TouchableOpacity>

        <View className="h-[220px] items-center justify-end overflow-hidden">
          <StyledImage
            accessibilityLabel="World landmarks around the globe"
            className="aspect-[1.46] w-full"
            contentFit="cover"
            contentPosition="bottom"
            source={images.earth}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  scrollContent: {
    flexGrow: 1,
    gap: 22,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  searchInput: {
    height: 52,
    paddingVertical: 0,
  },
  languageCard: {
    borderWidth: 1,
    borderColor: '#F0F1F5',
    backgroundColor: colors.neutral.background,
  },
  selectedLanguageCard: {
    borderWidth: 2,
    borderColor: '#7C5CFF',
    backgroundColor: '#F8F7FF',
  },
});
