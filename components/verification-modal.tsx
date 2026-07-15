import { colors } from '@/theme';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type VerificationModalProps = {
  email: string;
  visible: boolean;
  onClose: () => void;
};

export function VerificationModal({ email, visible, onClose }: VerificationModalProps) {
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    if (!visible) {
      setCode('');
      return;
    }

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(focusTimer);
  }, [visible]);

  const handleCodeChange = (value: string) => {
    const nextCode = value.replace(/\D/g, '').slice(0, 6);
    setCode(nextCode);

    if (nextCode.length === 6) {
      inputRef.current?.blur();
      onClose();
      router.replace('/');
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.card}>
          <TouchableOpacity
            accessibilityLabel="Close verification"
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text className="font-inter-regular text-[27px] leading-7 text-text-secondary">×</Text>
          </TouchableOpacity>

          <View className="items-center gap-2.5">
            <View className="mb-1 size-14 items-center justify-center rounded-full bg-[#F0EDFF]">
              <Text className="text-[26px]">✉️</Text>
            </View>
            <Text className="font-inter-bold text-[24px] leading-8 text-text-primary">
              Check your email
            </Text>
            <Text className="px-2 text-center font-inter-regular text-[14px] leading-[21px] text-text-secondary">
              We sent a verification code to{`\n`}
              <Text className="font-inter-semibold text-text-primary">{email}</Text>
            </Text>
          </View>

          <Pressable className="mt-7 flex-row justify-between" onPress={() => inputRef.current?.focus()}>
            {Array.from({ length: 6 }, (_, index) => (
              <View
                key={index}
                style={[styles.codeBox, index === code.length && styles.activeCodeBox]}
              >
                <Text className="font-inter-semibold text-[22px] text-text-primary">
                  {code[index] ?? ''}
                </Text>
              </View>
            ))}
          </Pressable>

          <TextInput
            ref={inputRef}
            accessibilityLabel="Six digit verification code"
            caretHidden
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={handleCodeChange}
            style={styles.hiddenInput}
            value={code}
          />

          <Text className="mt-5 text-center font-inter-regular text-[13px] text-text-secondary">
            Enter the 6-digit code to continue
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 19, 43, 0.45)',
  },
  card: {
    marginHorizontal: 24,
    borderRadius: 28,
    borderCurve: 'continuous',
    backgroundColor: colors.neutral.background,
    paddingHorizontal: 22,
    paddingBottom: 28,
    paddingTop: 32,
    boxShadow: '0 14px 40px rgba(13, 19, 43, 0.18)',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    zIndex: 1,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBox: {
    height: 52,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.neutral.border,
    borderRadius: 13,
    borderCurve: 'continuous',
    backgroundColor: colors.neutral.background,
  },
  activeCodeBox: {
    borderColor: colors.brand.deepPurple,
  },
  hiddenInput: {
    position: 'absolute',
    height: 1,
    width: 1,
    opacity: 0,
  },
});
