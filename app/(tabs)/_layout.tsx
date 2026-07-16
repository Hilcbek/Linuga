import { Tabs } from 'expo-router';

import { BottomTabBar } from '@/components/bottom-tab-bar';
import { colors } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.neutral.background,
        },
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
      <Tabs.Screen name="ai-teacher" options={{ title: 'AI Teacher' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
