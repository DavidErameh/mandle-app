import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence, withDelay, runOnJS } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import clsx from 'clsx';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function Toast({ message, type = 'info', visible, onHide, duration = 3000 }: ToastProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-50); // Start off-screen

  useEffect(() => {
    if (visible) {
      // Reset values first
      opacity.value = 0;
      translateY.value = -50;

      // Enter
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });

      // Exit
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(-20, { duration: 300 }, (finished) => {
          if (finished) runOnJS(onHide)();
        });
      }, duration);
    }
  }, [visible]);

  if (!visible) return null;

  const getStyle = () => {
    switch (type) {
      case 'success': return "bg-semantic-success/20 border-semantic-success";
      case 'error': return "bg-semantic-error/20 border-semantic-error";
      default: return "bg-primary-tertiary border-frosted-border";
    }
  };

  const getTextColor = () => {
     switch (type) {
      case 'success': return "text-semantic-success";
      case 'error': return "text-semantic-error";
      default: return "text-text-primary";
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <AnimatedBlurView 
      intensity={20}
      tint="dark"
      className={clsx(
        "absolute top-12 self-center px-6 py-4 rounded-2xl shadow-lg z-50 border",
        getStyle(),
        "min-w-[200px] flex-row justify-center items-center"
      )}
      style={animatedStyle}
    >
      <Text className={clsx("font-bodyMedium font-medium text-center", getTextColor())}>
        {message}
      </Text>
    </AnimatedBlurView>
  );
}
