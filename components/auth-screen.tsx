import { SocialButton } from '@/components/social-button';
import { VerificationModal } from '@/components/verification-modal';
import { images } from '@/constants/images';
import { colors } from '@/theme';
import { useSSO } from '@clerk/expo';
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
  onSubmit: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ requiresVerification: boolean }>;
  onVerify?: (code: string) => Promise<void>;
};

type AuthState = {
  email: string;
  password: string;
  passwordVisible: boolean;
  verificationVisible: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialAuthState: AuthState = {
  email: '',
  password: '',
  passwordVisible: false,
  verificationVisible: false,
  isLoading: false,
  error: null,
};

export function AuthScreen({ mode, onSubmit, onVerify }: AuthScreenProps) {
  const isSignUp = mode === 'sign-up';
  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const title = isSignUp ? 'Create your account' : 'Welcome back';
  const subtitle = isSignUp
    ? 'Start your language journey today ✨'
    : 'Continue your language journey ✨';
  const actionLabel = isSignUp ? 'Sign Up' : 'Sign In';

  const getErrorMessage = (caughtError: unknown) => {
    if (caughtError instanceof Error) return caughtError.message;
    return 'Something went wrong. Please try again.';
  };

  const handleSubmit = async () => {
    setAuth((current) => ({ ...current, error: null }));

    if (!auth.email.trim() || !auth.password) {
      setAuth((current) => ({ ...current, error: 'Enter your email and password.' }));
      return;
    }

    setAuth((current) => ({ ...current, isLoading: true }));
    try {
      const { requiresVerification } = await onSubmit({
        email: auth.email.trim(),
        password: auth.password,
      });
      if (requiresVerification) {
        setAuth((current) => ({ ...current, verificationVisible: true }));
      }
    } catch (caughtError) {
      setAuth((current) => ({ ...current, error: getErrorMessage(caughtError) }));
    } finally {
      setAuth((current) => ({ ...current, isLoading: false }));
    }
  };

  const handleVerify = async (code: string) => {
    if (!onVerify) return;

    setAuth((current) => ({ ...current, error: null, isLoading: true }));
    try {
      await onVerify(code);
      setAuth((current) => ({ ...current, verificationVisible: false }));
    } catch (caughtError) {
      setAuth((current) => ({ ...current, error: getErrorMessage(caughtError) }));
    } finally {
      setAuth((current) => ({ ...current, isLoading: false }));
    }
  };

  const handleGoogleAuth = async () => {
    setAuth((current) => ({ ...current, error: null, isLoading: true }));
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch (caughtError) {
      setAuth((current) => ({ ...current, error: getErrorMessage(caughtError) }));
      console.error(caughtError)
    } finally {
      setAuth((current) => ({ ...current, isLoading: false }));
    }
  };

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

        <View className="h-47.5 items-center justify-center">
          <StyledImage
            className="h-full w-62.5"
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
              onChangeText={(email) => setAuth((current) => ({ ...current, email }))}
              placeholder="alex@gmail.com"
              placeholderTextColor={colors.neutral.textPrimary}
              style={styles.input}
              value={auth.email}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text className="font-inter-regular text-[13px] text-text-secondary">Password</Text>
            <View className="flex-row items-center">
              <TextInput
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                onChangeText={(password) => setAuth((current) => ({ ...current, password }))}
                placeholder="••••••••"
                placeholderTextColor={colors.neutral.textPrimary}
                secureTextEntry={!auth.passwordVisible}
                style={[styles.input, styles.passwordInput]}
                value={auth.password}
              />
              <TouchableOpacity
                accessibilityLabel={auth.passwordVisible ? 'Hide password' : 'Show password'}
                activeOpacity={0.7}
                onPress={() =>
                  setAuth((current) => ({
                    ...current,
                    passwordVisible: !current.passwordVisible,
                  }))
                }
                style={styles.eyeButton}
              >
                <Ionicons
                  color="#73809F"
                  name={auth.passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            disabled={auth.isLoading}
            onPress={() => void handleSubmit()}
            style={[styles.primaryButton, auth.isLoading && styles.disabledButton]}
          >
            <Text className="font-inter-semibold text-[18px] text-white">
              {auth.isLoading ? 'Please wait…' : actionLabel}
            </Text>
          </TouchableOpacity>

          {auth.error && !auth.verificationVisible ? (
            <Text className="text-center font-inter-regular text-[13px] text-error">
              {auth.error}
            </Text>
          ) : null}

          <View className="flex-row items-center gap-4 py-1">
            <View className="h-px flex-1 bg-border" />
            <Text className="font-inter-regular text-[14px] text-text-secondary">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <SocialButton
            disabled={auth.isLoading}
            onPress={() => void handleGoogleAuth()}
          />
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

      {onVerify ? (
        <VerificationModal
          email={auth.email.trim() || 'alex@gmail.com'}
          error={auth.error}
          isLoading={auth.isLoading}
          onClose={() =>
            setAuth((current) => ({ ...current, error: null, verificationVisible: false }))
          }
          onVerify={handleVerify}
          visible={auth.verificationVisible}
        />
      ) : null}
      <View nativeID="clerk-captcha" />
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
  disabledButton: {
    opacity: 0.55,
  },
});
