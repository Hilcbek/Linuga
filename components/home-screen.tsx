import { Ionicons } from '@expo/vector-icons';
import { useClerk, useUser } from '@clerk/expo';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
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
import { getUnitById } from '@/data/units';
import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/theme';
import type { LanguageId } from '@/types/learning';

const StyledImage = styled(Image);

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const greetings: Record<LanguageId, string> = {
  chinese: '你好',
  french: 'Bonjour',
  german: 'Hallo',
  japanese: 'こんにちは',
  korean: '안녕하세요',
  spanish: 'Hola',
};

interface PlanItemProps {
  completed?: boolean;
  icon: IoniconName;
  iconBackgroundClassName: string;
  onPress: () => void;
  subtitle: string;
  title: string;
}

function PlanItem({
  completed = false,
  icon,
  iconBackgroundClassName,
  onPress,
  subtitle,
  title,
}: PlanItemProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.76}
      className="min-h-[58px] flex-row items-center"
      onPress={onPress}
    >
      <View
        className={`size-11 items-center justify-center rounded-[13px] ${iconBackgroundClassName}`}
      >
        <Ionicons color={colors.neutral.background} name={icon} size={24} />
      </View>

      <View className="min-w-0 flex-1 gap-0.5 px-4">
        <Text
          className="font-inter-semibold text-[15px] leading-5 text-text-primary"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          className="font-inter-regular text-[13px] leading-[18px] text-[#77809D]"
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>

      <View
        className={
          completed
            ? 'size-7 items-center justify-center rounded-full bg-lingua-deep-purple'
            : 'size-7 rounded-full border-2 border-[#8B94AE]'
        }
      >
        {completed ? (
          <Ionicons color={colors.neutral.background} name="checkmark" size={18} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isLoaded, user } = useUser();
  const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const languageId = selectedLanguageId ?? 'spanish';
  const selectedLanguage = getLanguageById(languageId) ?? languages[0];
  const languageLessons = getLessonsByLanguage(languageId);
  const currentLesson =
    languageLessons.find((lesson) => lesson.title.toLocaleLowerCase().includes('café')) ??
    languageLessons[0];

  if (!isLoaded || !selectedLanguage || !currentLesson) {
    return null;
  }

  const currentUnit = getUnitById(currentLesson.unitId);
  const conversationLesson =
    languageLessons.find((lesson) => lesson.title === 'Daily Life') ??
    languageLessons.find((lesson) =>
      lesson.activities.some((activity) => activity.type === 'conversation'),
    ) ??
    currentLesson;
  const conversationActivity = conversationLesson.activities.find(
    (activity) => activity.type === 'conversation',
  );
  const conversationSubtitle =
    conversationLesson.title === 'Daily Life'
      ? 'Talk about your day'
      : (conversationActivity?.instruction ?? conversationLesson.description);
  const displayName =
    user?.firstName ?? user?.fullName?.split(' ')[0] ?? user?.username ?? 'Learner';
  const dailyGoalXp = 20;
  const earnedXp = Math.min(currentLesson.xpReward, dailyGoalXp);
  const progressWidth = `${Math.round((earnedXp / dailyGoalXp) * 100)}%` as const;
  const unitLabel = currentUnit
    ? `${currentUnit.level} · Unit ${currentUnit.order}`
    : currentLesson.level;

  const openLogoutDialog = () => {
    setLogoutError(null);
    setIsLogoutDialogVisible(true);
  };

  const closeLogoutDialog = () => {
    if (isSigningOut) {
      return;
    }

    setIsLogoutDialogVisible(false);
    setLogoutError(null);
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    setLogoutError(null);

    try {
      await signOut();
    } catch {
      setLogoutError('We could not log you out. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar backgroundColor={colors.neutral.background} style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="h-13 flex-row items-center">
          <StyledImage
            accessibilityLabel={`${selectedLanguage.name} flag`}
            className="size-10 rounded-full"
            contentFit="cover"
            source={{ uri: selectedLanguage.flagEmoji }}
          />

          <Text
            className="min-w-0 flex-1 pl-3 font-inter-semibold text-[17px] leading-6 text-text-primary"
            numberOfLines={1}
          >
            {greetings[languageId]}, {displayName}! 👋
          </Text>

          <View className="flex-row items-center gap-1.5">
            <StyledImage
              accessibilityLabel="Learning streak"
              className="size-7"
              contentFit="contain"
              source={images.streakFire}
            />
            <Text className="font-inter-medium text-base text-[#303956]">12</Text>
          </View>

          <View
            accessibilityLabel="Notifications"
            className="ml-3 size-9 items-center justify-center"
          >
            <Ionicons color="#1B2340" name="notifications-outline" size={25} />
          </View>

          <TouchableOpacity
            accessibilityLabel="Log out"
            accessibilityRole="button"
            activeOpacity={0.72}
            className="ml-1 size-9 items-center justify-center rounded-full bg-[#FFF0F1]"
            onPress={openLogoutDialog}
          >
            <Ionicons color="#E34752" name="log-out-outline" size={22} />
          </TouchableOpacity>
        </View>

        <View className="h-[118px] flex-row overflow-hidden rounded-[20px] bg-[#FFF8EE] px-5 py-4">
          <View className="min-w-0 flex-1">
            <Text className="font-inter-medium text-[15px] leading-5 text-[#34405E]">
              Daily goal
            </Text>

            <View className="mt-1 flex-row items-end gap-2">
              <Text
                className="font-inter-semibold text-[28px] leading-9 text-text-primary"
                style={styles.tabularNumbers}
              >
                {earnedXp}
              </Text>
              <Text
                className="pb-1 font-inter-medium text-[15px] leading-5 text-[#7C86A3]"
                style={styles.tabularNumbers}
              >
                / {dailyGoalXp} XP
              </Text>
            </View>

            <View className="mt-3 h-2 overflow-hidden rounded-full bg-[#FFE1BF]">
              <View
                className="h-full rounded-full bg-[#FF7112]"
                style={{ width: progressWidth }}
              />
            </View>
          </View>

          <StyledImage
            accessibilityLabel="Daily goal treasure"
            className="ml-2 size-[110px] self-center"
            contentFit="contain"
            source={images.treasure}
          />
        </View>

        <View className="relative h-[164px] overflow-hidden rounded-[20px]" style={styles.heroCard}>
          <View className="absolute -right-8 -top-12 size-36 rounded-full bg-white/5" />
          <View className="absolute right-24 top-13 size-9 rounded-full bg-white/5" />
          <View className="absolute bottom-[-46px] left-20 size-28 rounded-full bg-[#2834BA]/35" />
          <View className="absolute bottom-[-40px] left-[-22px] size-24 rounded-full bg-[#2731B9]/40" />

          <StyledImage
            accessibilityLabel={`${selectedLanguage.name} learning destination`}
            className="absolute -bottom-1 -right-2 size-[176px]"
            contentFit="contain"
            source={images.palace}
          />

          <View className="h-full w-[55%] px-5 py-4">
            <Text className="font-inter-medium text-[15px] leading-5 text-white/90">
              Continue learning
            </Text>
            <Text
              className="mt-2 font-inter-semibold text-[23px] leading-7 text-white"
              numberOfLines={1}
            >
              {selectedLanguage.name}
            </Text>
            <Text className="mt-0.5 font-inter-medium text-[16px] leading-6 text-white/90">
              {unitLabel}
            </Text>

            <TouchableOpacity
              accessibilityLabel={`Continue ${selectedLanguage.name} learning`}
              activeOpacity={0.84}
              className="mt-3 h-10 self-start items-center justify-center rounded-[13px] bg-white px-4"
              onPress={() => router.push('/learn')}
            >
              <Text className="font-inter-semibold text-[15px] text-lingua-deep-purple">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-inter-semibold text-[18px] leading-6 text-text-primary">
              Today&apos;s plan
            </Text>
            <TouchableOpacity
              accessibilityLabel="View today's full plan"
              activeOpacity={0.72}
              onPress={() => router.push('/learn')}
            >
              <Text className="font-inter-semibold text-[15px] leading-5 text-lingua-deep-purple">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-2.5">
            <PlanItem
              completed
              icon="book"
              iconBackgroundClassName="bg-[#6C4EF5]"
              onPress={() => router.push('/learn')}
              subtitle={currentLesson.title}
              title="Lesson"
            />
            <PlanItem
              icon="headset"
              iconBackgroundClassName="bg-[#6C4EF5]"
              onPress={() => router.push('/chat')}
              subtitle={conversationSubtitle}
              title="AI Conversation"
            />
            <PlanItem
              icon="chatbox-ellipses"
              iconBackgroundClassName="bg-[#FF5B67]"
              onPress={() => router.push('/learn')}
              subtitle={`${currentLesson.vocabulary.length} words`}
              title="New words"
            />
          </View>
        </View>

        <TouchableOpacity
          accessibilityLabel="Start an AI video call"
          activeOpacity={0.82}
          className="h-[106px] flex-row items-center overflow-hidden rounded-[20px] bg-[#F3F9E9] px-5"
          onPress={() => router.push('/ai-teacher')}
        >
          <View className="min-w-0 flex-1">
            <Text className="font-inter-medium text-[13px] leading-[18px] text-[#65708E]">
              Next up
            </Text>
            <Text className="mt-1 font-inter-semibold text-[18px] leading-6 text-text-primary">
              AI Video Call
            </Text>
            <Text className="mt-1 font-inter-regular text-[13px] leading-[18px] text-[#65708E]">
              Practice speaking
            </Text>
          </View>

          <View className="ml-3 flex-row items-center">
            <StyledImage
              accessibilityLabel="AI teacher"
              className="size-[82px] rounded-full border-[7px] border-white/65"
              contentFit="cover"
              source={images.aiTeacherPortrait}
            />
            <View className="-ml-2 size-12 items-center justify-center rounded-full bg-[#49C70B]">
              <Ionicons color={colors.neutral.background} name="videocam" size={25} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={closeLogoutDialog}
        statusBarTranslucent
        transparent
        visible={isLogoutDialogVisible}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            accessibilityLabel="Close logout confirmation"
            activeOpacity={1}
            disabled={isSigningOut}
            onPress={closeLogoutDialog}
            style={styles.modalBackdrop}
          />

          <View
            accessibilityViewIsModal
            className="w-full max-w-[340px] items-center rounded-[28px] bg-white px-6 pb-6 pt-7"
            style={styles.dialogCard}
          >
            <View className="size-16 items-center justify-center rounded-full bg-[#FFF0F1]">
              <Ionicons color="#E34752" name="log-out-outline" size={31} />
            </View>

            <Text className="mt-5 text-center font-inter-semibold text-[22px] leading-7 text-text-primary">
              Log out?
            </Text>
            <Text className="mt-2 text-center font-inter-regular text-[14px] leading-[21px] text-text-secondary">
              Are you sure you want to log out of your Lingua account?
            </Text>

            {logoutError ? (
              <Text
                className="mt-3 text-center font-inter-medium text-[13px] leading-[18px] text-error"
                selectable
              >
                {logoutError}
              </Text>
            ) : null}

            <View className="mt-6 w-full flex-row gap-3">
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.78}
                className="h-12 flex-1 items-center justify-center rounded-[15px] border border-[#E3E6EE] bg-white"
                disabled={isSigningOut}
                onPress={closeLogoutDialog}
              >
                <Text className="font-inter-semibold text-[15px] text-[#535D78]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.82}
                className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-[15px] bg-[#E94B55]"
                disabled={isSigningOut}
                onPress={() => void handleLogout()}
              >
                {isSigningOut ? (
                  <ActivityIndicator color={colors.neutral.background} size="small" />
                ) : (
                  <>
                    <Ionicons
                      color={colors.neutral.background}
                      name="log-out-outline"
                      size={19}
                    />
                    <Text className="font-inter-semibold text-[15px] text-white">
                      Log out
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  scrollContent: {
    gap: 20,
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 20,
  },
  heroCard: {
    backgroundColor: colors.brand.deepPurple,
    borderCurve: 'continuous',
    experimental_backgroundImage:
      'linear-gradient(112deg, #4D35F5 0%, #6447F8 54%, #845FF7 100%)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(13, 19, 43, 0.52)',
  },
  dialogCard: {
    borderCurve: 'continuous',
    boxShadow: '0 18px 45px rgba(13, 19, 43, 0.22)',
  },
  tabularNumbers: {
    fontVariant: ['tabular-nums'],
  },
});
