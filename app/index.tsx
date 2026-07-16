import { useClerk } from '@clerk/expo';
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

      <TouchableOpacity activeOpacity={0.86} onPress={() => void handleLogout()} style={styles.button}>
        <Text className="font-inter-semibold text-base text-background">Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    marginTop: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.brand.deepPurple,
  },
});
