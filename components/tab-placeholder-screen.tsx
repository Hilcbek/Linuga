import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabPlaceholderScreenProps {
  description: string;
  icon: IoniconName;
  title: string;
}

export function TabPlaceholderScreen({
  description,
  icon,
  title,
}: TabPlaceholderScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <View className="size-20 items-center justify-center rounded-full bg-[#F1EEFF]">
          <Ionicons color={colors.brand.deepPurple} name={icon} size={36} />
        </View>

        <View className="items-center gap-2">
          <Text className="type--h2 text-center">{title}</Text>
          <Text className="type--body-medium text-center text-text-secondary">
            {description}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
