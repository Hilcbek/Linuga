import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  activeIcon: IoniconName;
  href: '/' | '/learn' | '/ai-teacher' | '/chat' | '/profile';
  icon: IoniconName;
  label: string;
  routeName: 'index' | 'learn' | 'ai-teacher' | 'chat' | 'profile';
}

const tabItems: TabItem[] = [
  {
    activeIcon: 'home',
    href: '/',
    icon: 'home-outline',
    label: 'Home',
    routeName: 'index',
  },
  {
    activeIcon: 'book',
    href: '/learn',
    icon: 'book-outline',
    label: 'Learn',
    routeName: 'learn',
  },
  {
    activeIcon: 'sparkles',
    href: '/ai-teacher',
    icon: 'sparkles-outline',
    label: 'AI Teacher',
    routeName: 'ai-teacher',
  },
  {
    activeIcon: 'chatbubble',
    href: '/chat',
    icon: 'chatbubble-outline',
    label: 'Chat',
    routeName: 'chat',
  },
  {
    activeIcon: 'person',
    href: '/profile',
    icon: 'person-outline',
    label: 'Profile',
    routeName: 'profile',
  },
];

export function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabRow}>
        {tabItems.map((tabItem) => {
          const route = state.routes.find(
            (candidateRoute) => candidateRoute.name === tabItem.routeName,
          );
          const options = route ? descriptors[route.key]?.options : undefined;
          const isFocused =
            tabItem.routeName === 'learn'
              ? pathname === '/learn' || pathname === '/audio-lesson'
              : tabItem.routeName === 'index'
              ? pathname === '/'
              : pathname === tabItem.href ||
                pathname.startsWith(`${tabItem.href}/`);
          const label =
            typeof options?.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options?.title === 'string'
                ? options.title
                : tabItem.label;

          const handlePress = () => {
            if (route) {
              const event = navigation.emit({
                canPreventDefault: true,
                target: route.key,
                type: 'tabPress',
              });

              if (event.defaultPrevented) {
                return;
              }
            }

            if (!isFocused) {
              router.navigate(tabItem.href);
            }
          };

          const handleLongPress = () => {
            if (route) {
              navigation.emit({
                target: route.key,
                type: 'tabLongPress',
              });
            }
          };

          return (
            <TouchableOpacity
              accessibilityLabel={options?.tabBarAccessibilityLabel ?? label}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              activeOpacity={0.72}
              key={tabItem.routeName}
              onLongPress={handleLongPress}
              onPress={handlePress}
              style={styles.tabButton}
              testID={options?.tabBarButtonTestID}
            >
              <View style={isFocused ? styles.activeIconCircle : styles.iconContainer}>
                <Ionicons
                  color={isFocused ? colors.neutral.background : '#737D9B'}
                  name={isFocused ? tabItem.activeIcon : tabItem.icon}
                  size={isFocused ? 23 : 25}
                />
              </View>

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
    height: 72,
    flexDirection: 'row',
    paddingTop: 5,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  activeIconCircle: {
    width: 44,
    height: 44,
    minWidth: 44,
    maxWidth: 44,
    minHeight: 44,
    maxHeight: 44,
    aspectRatio: 1,
    flexBasis: 44,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 9999,
    borderCurve: 'circular',
    backgroundColor: colors.brand.deepPurple,
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
