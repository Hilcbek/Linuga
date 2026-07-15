import { colors } from '@/theme';
import { FontAwesome } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

type SocialProvider = 'google' | 'facebook' | 'apple';

type SocialButtonProps = {
  icon: SocialProvider;
  label: string;
  onPress?: () => void;
};

const iconColors: Record<SocialProvider, string> = {
  google: '#4285F4',
  facebook: '#1877F2',
  apple: colors.neutral.textPrimary,
};

export function SocialButton({ icon, label, onPress }: SocialButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      className="h-[58px] flex-row items-center rounded-[17px] border border-[#ECEEF3] bg-background px-[18px]"
      onPress={onPress}
      style={{ borderCurve: 'continuous' }}
    >
      <View className="w-12 items-center">
        <FontAwesome color={iconColors[icon]} name={icon} size={icon === 'apple' ? 30 : 28} />
      </View>
      <Text className="flex-1 font-inter-regular text-[16px] text-text-primary">{label}</Text>
    </TouchableOpacity>
  );
}
