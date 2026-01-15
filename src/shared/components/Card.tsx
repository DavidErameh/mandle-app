import React, { useEffect } from 'react';
import { View, ViewProps, Pressable } from 'react-native';
import clsx from 'clsx';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface CardProps extends ViewProps {
  variant?: 'default' | 'selected' | 'dimmed' | 'elevated';
  className?: string;
  onPress?: () => void;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedView = Animated.createAnimatedComponent(View);

export function Card({ children, variant = 'default', className, onPress, ...props }: CardProps) {
  const scale = useSharedValue(1);
  const borderOpacity = useSharedValue(variant === 'selected' ? 1 : 0);

  useEffect(() => {
    if (variant === 'selected') {
      scale.value = withSpring(1.02);
      borderOpacity.value = withTiming(1);
    } else if (variant === 'dimmed') {
      scale.value = withTiming(0.98);
      borderOpacity.value = withTiming(0);
    } else {
      scale.value = withTiming(1);
      borderOpacity.value = withTiming(0);
    }
  }, [variant]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: variant === 'dimmed' ? 0.6 : 1,
    borderColor: '#1D9BF0', // We can't easily access theme JS here without a provider, sticking to hex for now but setting it correctly
    borderWidth: withTiming(variant === 'selected' ? 2 : 0),
  }));
  
  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: withTiming(variant === 'selected' ? 0.4 : 0),
    shadowRadius: withTiming(variant === 'selected' ? 20 : 0),
    shadowColor: '#1D9BF0',
  }));

  const containerStyle = clsx(
    "rounded-2xl overflow-hidden",
    variant === 'elevated' && "bg-background-tertiary",
    className
  );

  const Content = (
    <AnimatedBlurView 
      intensity={24} 
      tint="dark" 
      className={clsx("p-5 w-full h-full", variant === 'selected' && "bg-accent-light")}
    >
      {children}
    </AnimatedBlurView>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        <AnimatedView className={containerStyle} style={[animatedStyle, shadowStyle]} {...props}>
          {Content}
        </AnimatedView>
      </Pressable>
    );
  }

  return (
    <AnimatedView className={containerStyle} style={[animatedStyle, shadowStyle]} {...props}>
      {Content}
    </AnimatedView>
  );
}
