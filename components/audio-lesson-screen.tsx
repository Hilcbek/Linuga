import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
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
import { getLanguageById } from '@/data/languages';
import { getLessonById } from '@/data/lessons';
import { colors } from '@/theme';

const StyledImage = styled(Image);

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface AudioControlProps {
  active?: boolean;
  destructive?: boolean;
  icon: IoniconName;
  label: string;
  onPress: () => void;
}

function AudioControl({
  active = false,
  destructive = false,
  icon,
  label,
  onPress,
}: AudioControlProps) {
  const backgroundColor = destructive
    ? '#FF4148'
    : active
      ? colors.brand.deepPurple
      : colors.neutral.background;
  const iconColor =
    destructive || active ? colors.neutral.background : '#111A3A';

  return (
    <TouchableOpacity
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      activeOpacity={0.78}
      className="items-center gap-2"
      onPress={onPress}
    >
      <View
        className="size-[58px] items-center justify-center rounded-full"
        style={[styles.controlButton, { backgroundColor }]}
      >
        <Ionicons color={iconColor} name={icon} size={27} />
      </View>
      <Text className="font-inter-medium text-[12px] leading-4 text-white">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface FeedbackItemProps {
  colorClassName: string;
  label: string;
  value: string;
}

function FeedbackItem({
  colorClassName,
  label,
  value,
}: FeedbackItemProps) {
  return (
    <View className="min-w-0 flex-1 items-center gap-2 px-2">
      <Text className="text-center font-inter-medium text-[13px] leading-[18px] text-text-primary">
        {label}
      </Text>
      <Text
        className={`text-center font-inter-medium text-[13px] leading-[18px] ${colorClassName}`}
      >
        {value}
      </Text>
    </View>
  );
}

export function AudioLessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = useMemo(
    () => getLessonById(Array.isArray(lessonId) ? lessonId[0] : lessonId),
    [lessonId],
  );
  const language = lesson ? getLanguageById(lesson.languageId) : undefined;
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [areSubtitlesVisible, setAreSubtitlesVisible] = useState(true);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  if (!lesson || !language) {
    return <Redirect href="/learn" />;
  }

  const currentPhrase = lesson.phrases[phraseIndex] ?? lesson.phrases[0];
  const sessionContext =
    currentPhrase?.translation ??
    lesson.goal.outcomes[0] ??
    lesson.description;

  const handleTeacherPlayback = () => {
    setIsTeacherSpeaking((isSpeaking) => !isSpeaking);

    if (lesson.phrases.length > 1) {
      setPhraseIndex((currentIndex) => (currentIndex + 1) % lesson.phrases.length);
    }
  };

  const handleEndLesson = () => {
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar backgroundColor={colors.neutral.background} style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="h-[102px] flex-row items-center px-4">
          <TouchableOpacity
            accessibilityLabel="Back to lessons"
            accessibilityRole="button"
            activeOpacity={0.7}
            className="size-12 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons color="#111A36" name="chevron-back" size={33} />
          </TouchableOpacity>

          <View className="min-w-0 flex-1 gap-1 pl-1">
            <Text className="font-inter-semibold text-[22px] leading-7 text-text-primary">
              AI Teacher
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="size-3 rounded-full bg-[#16C516]" />
              <Text
                className="min-w-0 flex-1 font-inter-regular text-[13px] leading-[18px] text-[#65708E]"
                numberOfLines={1}
              >
                Online • {language.name} • {lesson.title}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="size-11 items-center justify-center rounded-full border border-[#E6E8EF] bg-white">
              <Ionicons color="#111A36" name="headset-outline" size={23} />
            </View>
            <View className="size-11 items-center justify-center rounded-full border border-[#E6E8EF] bg-white">
              <Text
                className="font-inter-medium text-[17px] text-text-primary"
                style={styles.tabularNumbers}
              >
                {lesson.durationMinutes}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-3 h-[598px] overflow-hidden rounded-[25px] bg-[#C7C1BE]">
          <StyledImage
            accessibilityLabel="AI teacher lesson room"
            className="absolute inset-x-0 top-0 h-[430px] w-full"
            contentFit="cover"
            source={images.audioLessonRoom}
          />
          <View className="absolute inset-0 bg-[#3D332C]/20" />
          <View className="absolute inset-x-0 bottom-0 h-[250px] bg-[#B8B1B1]/75" />

          <View className="absolute left-4 top-4 max-w-[61%] rounded-full bg-black/35 px-4 py-2">
            <Text
              className="font-inter-medium text-[12px] leading-[17px] text-white"
              numberOfLines={1}
            >
              Goal: {lesson.goal.summary}
            </Text>
          </View>

          <StyledImage
            accessibilityLabel="Lingua AI teacher"
            className="absolute -left-5 top-[63px] size-[350px]"
            contentFit="contain"
            source={images.mascotAuth}
          />

          <View className="absolute right-4 top-5 h-[132px] w-[106px] overflow-hidden rounded-[22px] border-[3px] border-white bg-[#E8E1D9]">
            <StyledImage
              accessibilityLabel="Learner preview"
              className="size-full"
              contentFit="cover"
              source={images.audioLessonLearner}
            />
          </View>

          <View className="absolute bottom-[199px] left-[82px] right-[72px] min-h-[104px] justify-center rounded-[20px] bg-white px-5 py-4" style={styles.speechBubble}>
            {areSubtitlesVisible ? (
              <>
                <Text
                  className="pr-9 font-inter-medium text-[17px] leading-6 text-text-primary"
                  numberOfLines={2}
                  selectable
                >
                  {currentPhrase?.text ?? lesson.teacherOpeningLine}
                </Text>
                <Text
                  className="mt-1 pr-8 font-inter-regular text-[13px] leading-[18px] text-[#65708E]"
                  numberOfLines={2}
                  selectable
                >
                  {sessionContext} 👏
                </Text>
              </>
            ) : (
              <Text className="pr-8 font-inter-medium text-[16px] leading-6 text-text-primary">
                Listen closely to your AI teacher…
              </Text>
            )}

            <TouchableOpacity
              accessibilityLabel={
                isTeacherSpeaking ? 'Pause teacher' : 'Play teacher response'
              }
              accessibilityRole="button"
              activeOpacity={0.72}
              className="absolute right-3 top-1/2 size-10 -translate-y-1/2 items-center justify-center"
              onPress={handleTeacherPlayback}
            >
              <Ionicons
                color={colors.brand.deepPurple}
                name={isTeacherSpeaking ? 'pause' : 'volume-high'}
                size={27}
              />
            </TouchableOpacity>
            <View style={styles.speechBubbleTail} />
          </View>

          <View className="absolute inset-x-0 bottom-[102px] flex-row items-start justify-around px-3">
            <AudioControl
              active={isTeacherSpeaking}
              icon={isTeacherSpeaking ? 'pause' : 'volume-high'}
              label="Audio"
              onPress={handleTeacherPlayback}
            />
            <AudioControl
              active={isMicEnabled}
              icon={isMicEnabled ? 'mic' : 'mic-off'}
              label={isMicEnabled ? 'Mic' : 'Muted'}
              onPress={() => setIsMicEnabled((isEnabled) => !isEnabled)}
            />
            <AudioControl
              active={areSubtitlesVisible}
              icon="language"
              label="Subtitles"
              onPress={() => setAreSubtitlesVisible((isVisible) => !isVisible)}
            />
            <AudioControl
              destructive
              icon="call"
              label="End Lesson"
              onPress={handleEndLesson}
            />
          </View>

          <View className="absolute inset-x-5 bottom-4 h-[78px] flex-row items-center rounded-[22px] bg-white px-2">
            <FeedbackItem
              colorClassName="text-[#16C516]"
              label="Speaking"
              value="Excellent"
            />
            <View className="h-12 w-px bg-[#E4E7EF]" />
            <FeedbackItem
              colorClassName="text-[#2685FF]"
              label="Pronunciation"
              value="Great"
            />
            <View className="h-12 w-px bg-[#E4E7EF]" />
            <FeedbackItem
              colorClassName="text-lingua-deep-purple"
              label="Grammar"
              value="Good"
            />
          </View>
        </View>

        <View className="mx-4 gap-3 rounded-[22px] border border-[#EEF0F5] bg-white p-5">
          <View className="flex-row items-center gap-3">
            <StyledImage
              accessibilityLabel={`${language.name} flag`}
              className="size-9 rounded-full"
              contentFit="cover"
              source={{ uri: language.flagEmoji }}
            />
            <View className="min-w-0 flex-1">
              <Text className="font-inter-semibold text-[16px] leading-5 text-text-primary">
                {lesson.title}
              </Text>
              <Text className="font-inter-regular text-[12px] leading-[17px] text-[#65708E]">
                {language.name} • {lesson.level} • {lesson.xpReward} XP
              </Text>
            </View>
          </View>

          <View className="gap-1">
            <Text className="font-inter-semibold text-[13px] leading-[18px] text-text-primary">
              AI teacher context
            </Text>
            <Text
              className="font-inter-regular text-[13px] leading-5 text-[#65708E]"
              selectable
            >
              {lesson.teacherOpeningLine}
            </Text>
          </View>

          <View className="gap-1">
            <Text className="font-inter-semibold text-[13px] leading-[18px] text-text-primary">
              Lesson goal
            </Text>
            <Text
              className="font-inter-regular text-[13px] leading-5 text-[#65708E]"
              selectable
            >
              {lesson.goal.summary}
            </Text>
          </View>
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
    gap: 14,
    paddingBottom: 18,
  },
  controlButton: {
    borderCurve: 'circular',
    boxShadow: '0 4px 10px rgba(20, 27, 55, 0.12)',
  },
  speechBubble: {
    borderCurve: 'continuous',
    boxShadow: '0 5px 14px rgba(20, 27, 55, 0.18)',
  },
  speechBubbleTail: {
    position: 'absolute',
    right: 22,
    bottom: -14,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 0,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.neutral.background,
  },
  tabularNumbers: {
    fontVariant: ['tabular-nums'],
  },
});
