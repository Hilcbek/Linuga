import { images } from '@/constants/images';
import { colors } from '@/theme';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const StyledImage = styled(Image);

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-center gap-2.5 pt-3">
          <StyledImage
            source={images.mascotLogo}
            contentFit="contain"
            className="size-14.5"
          />
          <Text className="font-inter-bold text-[31px] leading-[38px] text-text-primary">
            Lingua
          </Text>
        </View>

        <View className="flex-1 px-10 pt-14">
          <View className="gap-4">
            <Text className="type--h1 text-[34px] leading-[43px]">
              Your AI language{`\n`}
              <Text className="font-inter-bold text-lingua-deep-purple">teacher.</Text>
            </Text>

            <Text className="type--body-large text-[17px] leading-7 text-text-secondary">
              Real conversations, personalized{`\n`}lessons, anytime, anywhere.
            </Text>
          </View>

          <View className="relative min-h-[370px] flex-1 items-center justify-end">
            <View className="absolute left-0 top-9 -rotate-6 rounded-[18px] bg-[#EEF7FF] px-5 py-3">
              <Text className="font-inter-regular text-[21px] text-text-primary">Hello!</Text>
              <View className="absolute -bottom-2 right-5 size-5 rotate-45 bg-[#EEF7FF]" />
            </View>

            <View className="absolute right-1 top-3 rotate-[11deg] rounded-[18px] bg-[#F7F5FF] px-5 py-3">
              <Text className="font-inter-regular text-[21px] italic text-lingua-deep-purple">
                ¡Hola!
              </Text>
              <View className="absolute -bottom-2 left-5 size-5 rotate-45 bg-[#F7F5FF]" />
            </View>

            <View className="absolute right-0 top-[118px] rotate-[11deg] rounded-[18px] bg-[#FFF4EE] px-5 py-3">
              <Text className="text-[21px] text-error">你好!</Text>
              <View className="absolute -bottom-2 left-5 size-5 rotate-45 bg-[#FFF4EE]" />
            </View>

            <View className="relative size-[390px] items-center justify-center">
              <View className="absolute bottom-[42px] h-2 w-[220px] rounded-full bg-text-primary opacity-10" />
              <StyledImage
                source={images.mascotWelcome}
                contentFit="contain"
                className="size-[390px]"
              />
            </View>
          </View>
        </View>

        <View className="px-7 pb-3 pt-5">
          <Link href="/sign-up" asChild>
            <TouchableOpacity activeOpacity={0.86} style={styles.getStartedButton}>
              <Text className="font-inter-semibold text-[19px] leading-6 text-background">
                Get Started
              </Text>
              <Text className="will-change-variable absolute bottom-[15px] right-[27px] font-inter-regular text-[38px] leading-[42px] text-background">
                ›
              </Text>
            </TouchableOpacity>
          </Link>
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
  content: {
    flexGrow: 1,
  },
  getStartedButton: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.brand.deepPurple,
  },
});
