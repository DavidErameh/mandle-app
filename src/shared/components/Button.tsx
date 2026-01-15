import React, { useMemo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, Pressable, View } from 'react-native';
import clsx from 'clsx';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  className,
  icon,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const baseStyle = "rounded-xl flex-row justify-center items-center";
  
  // Height & Padding
  const dimensions = variant === 'icon' 
    ? "h-11 w-11 p-0" 
    : "h-14 px-4"; // 56px height for primary/secondary

  // Variants
  const getBackground = () => {
    switch (variant) {
      case 'primary': return "bg-accent-primary";
      case 'secondary': return "bg-frosted-default overflow-hidden";
      case 'outline': return "border border-border-default bg-transparent";
      case 'ghost': return "bg-transparent";
      case 'icon': return "bg-frosted-default border border-border-default";
      default: return "bg-accent-primary";
    }
  };

  const textClass = (() => {
    switch (variant) {
      case 'primary': return "text-white font-bodyMedium font-bold";
      case 'secondary': return "text-white font-bodyMedium";
      case 'outline': return "text-accent font-bodyMedium font-bold";
      case 'ghost': return "text-text-secondary font-bodyMedium";
      default: return "text-white";
    }
  })();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.98, { damping: 15 });
    opacity.value = withTiming(0.9, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const content = (
    <>
       {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#1D9BF0' : 'white'} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          {variant !== 'icon' && (
            <Text className={clsx("text-base text-center", textClass)}>
              {title}
            </Text>
          )}
        </>
      )}
    </>
  );

  // For Secondary/Icon variants, we need the blur wrapper
  const isFrosted = variant === 'secondary' || variant === 'icon';

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      className={clsx(
        baseStyle,
        dimensions,
        getBackground(),
        (disabled || loading) && "opacity-50",
        className
      )}
    >
      {isFrosted ? (
        <BlurView intensity={20} tint="dark" className="absolute inset-0 w-full h-full justify-center items-center flex-row">
           {content}
        </BlurView>
      ) : (
        content
      )}
    </AnimatedPressable>
  );
}
