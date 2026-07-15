import { SocialButton } from '@/components/social-button';
import { VerificationModal } from '@/components/verification-modal';
import { images } from '@/constants/images';
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledImage = styled(Image);

type AuthScreenProps = {
  mode: 'sign-up' | 'sign-in';
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const isSignUp = mode === 'sign-up';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const router = useRouter();

  const title = isSignUp ? 'Create your account' : 'Welcome back';
  const subtitle = isSignUp
    ? 'Start your language journey today ✨'
    : 'Continue your language journey ✨';
  const actionLabel = isSignUp ? 'Sign Up' : 'Sign In';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons color={colors.neutral.textPrimary} name="chevron-back" size={34} />
        </TouchableOpacity>

        <View className="px-8">
          <Text className="font-inter-bold text-[32px] leading-[40px] text-text-primary">
            {title}
          </Text>
          <Text className="mt-3 font-inter-regular text-[17px] leading-7 text-text-secondary">
            {subtitle}
          </Text>
        </View>

        <View className="h-[190px] items-center justify-center">
          <StyledImage
            className="h-full w-[250px]"
            contentFit="contain"
            source={images.mascotAuth}
          />
        </View>

        <View className="gap-3.5 px-7">
          <View style={styles.inputContainer}>
            <Text className="font-inter-regular text-[13px] text-text-secondary">Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor={colors.neutral.textPrimary}
              style={styles.input}
              value={email}
            />
          </View>

          {isSignUp ? (
            <View style={styles.inputContainer}>
              <Text className="font-inter-regular text-[13px] text-text-secondary">Password</Text>
              <View className="flex-row items-center">
                <TextInput
                  autoComplete="new-password"
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.neutral.textPrimary}
                  secureTextEntry={!passwordVisible}
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                />
                <TouchableOpacity
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  activeOpacity={0.7}
                  onPress={() => setPasswordVisible((visible) => !visible)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    color="#73809F"
                    name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => setVerificationVisible(true)}
            style={styles.primaryButton}
          >
            <Text className="font-inter-semibold text-[18px] text-white">{actionLabel}</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-4 py-1">
            <View className="h-px flex-1 bg-border" />
            <Text className="font-inter-regular text-[14px] text-text-secondary">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <SocialButton icon="google" label="Continue with Google" />
          <SocialButton icon="facebook" label="Continue with Facebook" />
          <SocialButton icon="apple" label="Continue with Apple" />
        </View>

        <View className="flex-row justify-center pb-4 pt-8">
          <Text className="font-inter-regular text-[14px] text-text-secondary">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <Link href={isSignUp ? '/sign-in' : '/sign-up'}>
            <Text className="font-inter-semibold text-[14px] text-lingua-deep-purple">
              {isSignUp ? 'Log in' : 'Sign up'}
            </Text>
          </Link>
        </View>
      </ScrollView>

      <VerificationModal
        email={email.trim() || 'alex@gmail.com'}
        onClose={() => setVerificationVisible(false)}
        visible={verificationVisible}
      />
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
    paddingBottom: 8,
  },
  backButton: {
    height: 58,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    minHeight: 78,
    justifyContent: 'center',
    borderWidth: 1.25,
    borderColor: colors.neutral.border,
    borderRadius: 18,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    backgroundColor: colors.neutral.background,
  },
  input: {
    height: 38,
    padding: 0,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.neutral.textPrimary,
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    borderCurve: 'continuous',
    backgroundColor: colors.brand.deepPurple,
    boxShadow: '0 5px 0 #4527D9',
    marginBottom: 5,
  },
});
