import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const translateX = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = barWidth / state.routes.length;

  useEffect(() => {
    if (!tabWidth) {
      return;
    }

    Animated.spring(translateX, {
      damping: 20,
      mass: 0.8,
      stiffness: 190,
      toValue: state.index * tabWidth,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth, translateX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      onLayout={handleLayout}
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View style={styles.tabRow}>
        {tabWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.indicatorSlot,
              {
                width: tabWidth,
                transform: [{ translateX }],
              },
            ]}
          >
            <View style={styles.activeCircle} />
          </Animated.View>
        ) : null}

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
                color={isFocused ? colors.neutral.background : '#67718F'}
                name={isFocused ? tabItem.activeIcon : tabItem.icon}
                size={isFocused ? 25 : 24}
              />

              {!isFocused ? (
                <Text numberOfLines={1} style={styles.label}>
                  {label}
                </Text>
              ) : null}
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
      height: -5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 14,
  },
  tabRow: {
    position: 'relative',
    height: 72,
    flexDirection: 'row',
  },
  indicatorSlot: {
    position: 'absolute',
    top: 10,
    left: 0,
    height: 52,
    alignItems: 'center',
  },
  activeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brand.deepPurple,
    shadowColor: colors.brand.deepPurple,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 7,
  },
  tabButton: {
    zIndex: 1,
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
    color: '#67718F',
  },
});
