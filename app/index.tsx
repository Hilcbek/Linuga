import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="type--h1 text-center">Lingua</Text>
      <Text className="type--body-medium mt-2 text-center text-text-secondary">
        Your AI-powered language learning app.
      </Text>

      <Link href="/onboarding" asChild>
        <TouchableOpacity activeOpacity={0.86} style={styles.link}>
          <Text className="font-inter-semibold text-base text-background">Open onboarding</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    minHeight: 52,
    marginTop: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.brand.deepPurple,
  },
});
