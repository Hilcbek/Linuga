import { images } from '@/constants/images';
import { Image } from 'expo-image';
import { styled } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';

type SocialButtonProps = {
  disabled?: boolean;
  onPress?: () => void;
};

const StyledImage = styled(Image);

export function SocialButton({ disabled = false, onPress }: SocialButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      accessibilityLabel="Continue with Google"
      className={`h-11 flex-row items-center rounded-sm border border-[#747775] bg-white px-3 ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled}
      onPress={onPress}
      style={{ borderCurve: 'continuous' }}
    >
      <View className="w-8 items-start">
        <StyledImage
          className="size-5"
          contentFit="contain"
          source={images.googleGLogo}
        />
      </View>
      <Text className="flex-1 text-center font-inter-medium text-[14px] leading-5 text-[#1F1F1F]">
        Continue with Google
      </Text>
      <View className="w-8" />
    </TouchableOpacity>
  );
}
