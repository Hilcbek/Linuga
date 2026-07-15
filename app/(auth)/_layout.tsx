import { colors } from '@/theme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.neutral.background },
        headerShown: false,
      }}
    />
  );
}
