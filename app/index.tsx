import { useClerk } from '@clerk/expo';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme';

export default function Index() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="type--h1 text-center">Lingua</Text>
      <Text className="type--body-medium mt-2 text-center text-text-secondary">
        Your AI-powered language learning app.
      </Text>

      <Link href="/language-selection" asChild>
        <TouchableOpacity activeOpacity={0.86} style={styles.primaryButton}>
          <Text className="font-inter-semibold text-base text-background">Choose a language</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity activeOpacity={0.86} onPress={() => void handleLogout()} style={styles.button}>
        <Text className="font-inter-semibold text-base text-lingua-deep-purple">Log out</Text>
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
