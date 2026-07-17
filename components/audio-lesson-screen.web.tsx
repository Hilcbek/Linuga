import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';

export function AudioLessonScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar backgroundColor={colors.neutral.background} style="dark" />
      <View className="flex-1 items-center justify-center gap-5 px-8">
        <View className="size-20 items-center justify-center rounded-full bg-[#EEEAFB]">
          <Ionicons
            color={colors.brand.deepPurple}
            name="headset-outline"
            size={38}
          />
        </View>
        <View className="items-center gap-2">
          <Text className="text-center font-inter-semibold text-[22px] leading-7 text-text-primary">
            Open this lesson on mobile
          </Text>
          <Text className="text-center font-inter-regular text-[14px] leading-5 text-[#65708E]">
            Live Stream audio lessons use native microphone and WebRTC features
            that are available in the iOS and Android app.
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel="Back to lessons"
          accessibilityRole="button"
          activeOpacity={0.78}
          className="min-h-12 items-center justify-center rounded-full bg-lingua-deep-purple px-6"
          onPress={() => router.back()}
        >
          <Text className="font-inter-semibold text-[14px] text-white">
            Back to lessons
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
});
