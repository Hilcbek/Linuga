import { Ionicons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { images } from '@/constants/images';
import { getLanguageById, languages } from '@/data/languages';
import { getLessonsByLanguage } from '@/data/lessons';
import { getUnitsByLanguage } from '@/data/units';
import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/theme';
import type { Lesson } from '@/types/learning';

const StyledImage = styled(Image);

type LessonTab = 'lessons' | 'practice';
type LessonStatus = 'completed' | 'in-progress' | 'upcoming';

function getLessonScene(lesson: Lesson): ImageSource {
  const normalizedLessonId = lesson.id.toLocaleLowerCase();

  if (normalizedLessonId.includes('cafe')) {
    return images.lessonScenes.cafe;
  }

  if (normalizedLessonId.includes('daily')) {
    return images.lessonScenes.dailyLife;
  }

  if (
    normalizedLessonId.includes('travel') ||
    normalizedLessonId.includes('direction')
  ) {
    return images.lessonScenes.travel;
  }

  if (normalizedLessonId.includes('shopping')) {
    return images.lessonScenes.shopping;
  }

  if (
    normalizedLessonId.includes('family') ||
    normalizedLessonId.includes('friend')
  ) {
    return images.lessonScenes.family;
  }

  return images.lessonScenes.greetings;
}

function getInitialLesson(lessons: Lesson[]) {
  return (
    lessons.find((lesson) => lesson.id.toLocaleLowerCase().includes('cafe')) ??
    lessons[0]
  );
}

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  totalLessons: number;
}

function LessonCard({
  lesson,
  status,
  totalLessons,
}: LessonCardProps) {
  const isInProgress = status === 'in-progress';

  return (
    <Link
      asChild
      href={{
        pathname: '/audio-lesson',
        params: { lessonId: lesson.id },
      }}
      push
    >
      <TouchableOpacity
        accessibilityHint={
          status === 'upcoming'
            ? 'Opens this locked audio lesson'
            : 'Opens the audio lesson'
        }
        accessibilityLabel={`Lesson ${lesson.order}, ${lesson.title}, ${status.replace('-', ' ')}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isInProgress }}
        activeOpacity={0.8}
        className="min-h-[88px] flex-row items-center rounded-[18px] bg-white px-5 py-3.5"
        style={[styles.lessonCard, isInProgress && styles.selectedLessonCard]}
      >
        <View className="min-w-0 flex-1">
          <Text
            className={
              isInProgress
                ? 'font-inter-medium text-[13px] leading-[18px] text-lingua-deep-purple'
                : 'font-inter-medium text-[13px] leading-[18px] text-[#7D86A1]'
            }
          >
            Lesson {lesson.order}
          </Text>

          <Text
            className="mt-1 font-inter-medium text-[16px] leading-[22px] text-text-primary"
            numberOfLines={1}
          >
            {lesson.title}
          </Text>

          {isInProgress ? (
            <Text className="mt-1 font-inter-medium text-[13px] leading-[18px] text-lingua-deep-purple">
              In progress
            </Text>
          ) : status === 'upcoming' ? (
            <Text
              className="mt-1 font-inter-regular text-[12px] leading-[17px] text-[#7D86A1]"
              style={styles.tabularNumbers}
            >
              0 / {totalLessons} lessons
            </Text>
          ) : null}
        </View>

        {status === 'completed' ? (
          <View className="size-7 items-center justify-center rounded-full bg-[#20C620]">
            <Ionicons color={colors.neutral.background} name="checkmark" size={20} />
          </View>
        ) : isInProgress ? (
          <StyledImage
            accessibilityLabel={`${lesson.title} lesson image`}
            className="size-12 rounded-[14px]"
            contentFit="cover"
            source={getLessonScene(lesson)}
          />
        ) : (
          <Ionicons color="#65708F" name="lock-closed-outline" size={25} />
        )}
      </TouchableOpacity>
    </Link>
  );
}

export function LessonsScreen() {
  const router = useRouter();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const languageId = selectedLanguageId ?? 'spanish';
  const selectedLanguage = getLanguageById(languageId) ?? languages[0];
  const languageLessons = useMemo(
    () => getLessonsByLanguage(languageId),
    [languageId],
  );
  const languageUnits = useMemo(
    () => getUnitsByLanguage(languageId),
    [languageId],
  );
  const initialLesson = getInitialLesson(languageLessons);
  const [activeTab, setActiveTab] = useState<LessonTab>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState(
    initialLesson?.id ?? '',
  );
  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedLessonId(getInitialLesson(languageLessons)?.id ?? '');
    setActiveTab('lessons');
  }, [languageLessons]);

  const selectedLesson =
    languageLessons.find((lesson) => lesson.id === selectedLessonId) ??
    initialLesson;
  const currentUnit =
    languageUnits.find((unit) => unit.id === selectedLesson?.unitId) ??
    languageUnits[0];
  const isBookmarked = selectedLesson
    ? bookmarkedLessonIds.includes(selectedLesson.id)
    : false;

  if (!selectedLanguage || !selectedLesson || !currentUnit) {
    return null;
  }

  const handleBack = () => {
    router.replace('/(tabs)');
  };

  const toggleBookmark = () => {
    setBookmarkedLessonIds((lessonIds) =>
      lessonIds.includes(selectedLesson.id)
        ? lessonIds.filter((lessonId) => lessonId !== selectedLesson.id)
        : [...lessonIds, selectedLesson.id],
    );
  };

  const openLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    router.push({
      pathname: '/audio-lesson',
      params: { lessonId },
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar backgroundColor={colors.neutral.background} style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="h-[92px] flex-row items-center px-5">
          <TouchableOpacity
            accessibilityLabel="Go to Home"
            accessibilityRole="button"
            activeOpacity={0.7}
            className="size-11 items-center justify-center"
            onPress={handleBack}
          >
            <Ionicons color="#121A35" name="chevron-back" size={32} />
          </TouchableOpacity>

          <View className="min-w-0 flex-1 gap-1 px-2">
            <Text
              className="font-inter-semibold text-[21px] leading-7 text-text-primary"
              numberOfLines={1}
            >
              {currentUnit.title}
            </Text>
            <Text
              className="font-inter-regular text-[14px] leading-5 text-[#737D9B]"
              style={styles.tabularNumbers}
            >
              Unit {currentUnit.order} • {selectedLesson.order} / {languageLessons.length}{' '}
              lessons
            </Text>
          </View>

          <TouchableOpacity
            accessibilityLabel={
              isBookmarked ? 'Remove lesson bookmark' : 'Bookmark lesson'
            }
            accessibilityRole="button"
            accessibilityState={{ selected: isBookmarked }}
            activeOpacity={0.72}
            className="size-11 items-center justify-center"
            onPress={toggleBookmark}
          >
            <Ionicons
              color={isBookmarked ? '#FF9C17' : '#5B3BF6'}
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={30}
            />
          </TouchableOpacity>
        </View>

        <View className="relative h-[236px] overflow-hidden bg-[#DFF1FF]">
          <StyledImage
            accessibilityLabel={`${selectedLesson.title} setting`}
            className="absolute inset-0 size-full"
            contentFit="cover"
            source={getLessonScene(selectedLesson)}
            transition={180}
          />
          <View className="absolute inset-0 bg-[#EAF6FF]/45" />
          <View className="absolute inset-x-0 bottom-0 h-20 bg-white/20" />

          <StyledImage
            accessibilityLabel="Lingua fox teacher"
            className="absolute -bottom-10 left-1/2 size-[238px] -translate-x-1/2"
            contentFit="contain"
            source={images.mascotWelcome}
          />

          <View className="absolute -bottom-7 left-1/2 h-14 w-[190px] -translate-x-1/2 rounded-[50%] border-[6px] border-[#8C552D] bg-[#C98650]" />
          <Text className="absolute bottom-3 left-[63%] text-[26px]">☕</Text>
        </View>

        <View className="mx-4 -mt-0.5 h-[60px] flex-row overflow-hidden rounded-b-[20px] bg-white" style={styles.tabBar}>
          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'lessons' }}
            activeOpacity={0.78}
            className="flex-1 items-center justify-center"
            onPress={() => setActiveTab('lessons')}
          >
            <Text
              className={
                activeTab === 'lessons'
                  ? 'font-inter-semibold text-[16px] text-lingua-deep-purple'
                  : 'font-inter-medium text-[16px] text-[#66708F]'
              }
            >
              Lessons
            </Text>
            {activeTab === 'lessons' ? (
              <View className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-lingua-deep-purple" />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'practice' }}
            activeOpacity={0.78}
            className="flex-1 items-center justify-center"
            onPress={() => setActiveTab('practice')}
          >
            <Text
              className={
                activeTab === 'practice'
                  ? 'font-inter-semibold text-[16px] text-lingua-deep-purple'
                  : 'font-inter-medium text-[16px] text-[#66708F]'
              }
            >
              Practice
            </Text>
            {activeTab === 'practice' ? (
              <View className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-lingua-deep-purple" />
            ) : null}
          </TouchableOpacity>
        </View>

        {activeTab === 'lessons' ? (
          <View className="gap-2.5 px-5 pb-4 pt-5">
            {languageLessons.map((lesson) => {
              const status: LessonStatus =
                lesson.id === selectedLesson.id
                  ? 'in-progress'
                  : lesson.order < selectedLesson.order
                    ? 'completed'
                    : 'upcoming';

              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  status={status}
                  totalLessons={languageLessons.length}
                />
              );
            })}
          </View>
        ) : (
          <View className="gap-3 px-5 pb-4 pt-5">
            {selectedLesson.activities.map((activity, index) => (
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.8}
                className="min-h-[82px] flex-row items-center rounded-[18px] bg-white px-4 py-3"
                key={activity.id}
                onPress={() => openLesson(selectedLesson.id)}
                style={styles.lessonCard}
              >
                <View className="size-11 items-center justify-center rounded-[13px] bg-[#F0EDFF]">
                  <Ionicons
                    color={colors.brand.deepPurple}
                    name={index % 2 === 0 ? 'volume-high' : 'mic'}
                    size={23}
                  />
                </View>
                <View className="min-w-0 flex-1 gap-1 pl-4">
                  <Text className="font-inter-semibold text-[15px] leading-5 text-text-primary">
                    {activity.instruction}
                  </Text>
                  <Text
                    className="font-inter-regular text-[13px] leading-[18px] text-[#737D9B]"
                    numberOfLines={1}
                  >
                    {activity.prompt}
                  </Text>
                </View>
                <Ionicons color="#737D9B" name="chevron-forward" size={22} />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    paddingBottom: 12,
  },
  lessonCard: {
    borderWidth: 1,
    borderColor: '#EEF0F5',
    borderCurve: 'continuous',
    boxShadow: '0 2px 5px rgba(31, 38, 66, 0.035)',
  },
  selectedLessonCard: {
    borderWidth: 2,
    borderColor: '#8A6CFF',
    backgroundColor: '#FCFBFF',
  },
  tabBar: {
    borderCurve: 'continuous',
    boxShadow: '0 8px 20px rgba(37, 43, 72, 0.09)',
  },
  tabularNumbers: {
    fontVariant: ['tabular-nums'],
  },
});
