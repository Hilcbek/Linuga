import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  activeIcon: IoniconName;
  icon: IoniconName;
  label: string;
}

const tabItems: Record<string, TabItem> = {
  index: {
    activeIcon: 'home',
    icon: 'home-outline',
    label: 'Home',
  },
  learn: {
    activeIcon: 'book',
    icon: 'book-outline',
    label: 'Learn',
  },
  'ai-teacher': {
    activeIcon: 'sparkles',
    icon: 'sparkles-outline',
    label: 'AI Teacher',
  },
  chat: {
    activeIcon: 'chatbubble',
    icon: 'chatbubble-outline',
    label: 'Chat',
  },
  profile: {
    activeIcon: 'person',
    icon: 'person-outline',
    label: 'Profile',
  },
};

export function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const tabItem = tabItems[route.name];
          const isFocused = state.index === index;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : tabItem.label;

          const handlePress = () => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: 'tabPress',
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const handleLongPress = () => {
            navigation.emit({
              target: route.key,
              type: 'tabLongPress',
            });
          };

          return (
            <TouchableOpacity
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              activeOpacity={0.72}
              key={route.key}
              onLongPress={handleLongPress}
              onPress={handlePress}
              style={styles.tabButton}
              testID={options.tabBarButtonTestID}
            >
              <Ionicons
                color={isFocused ? colors.brand.deepPurple : '#737D9B'}
                name={isFocused ? tabItem.activeIcon : tabItem.icon}
                size={25}
              />

              <Text
                numberOfLines={1}
                style={[styles.label, isFocused && styles.activeLabel]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#EEF0F5',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.neutral.background,
    shadowColor: '#10152F',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 12,
  },
  tabRow: {
    height: 66,
    flexDirection: 'row',
    paddingTop: 7,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    maxWidth: '100%',
    paddingHorizontal: 3,
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    lineHeight: 15,
    color: '#737D9B',
  },
  activeLabel: {
    fontFamily: 'Inter-SemiBold',
    color: colors.brand.deepPurple,
  },
});
