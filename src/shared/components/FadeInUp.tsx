import React from 'react';
import Animated, { 
  useAnimatedStyle, 
  withDelay, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
}

export function FadeInUp({ 
  children, 
  delay = 0, 
  duration = 300,
  translateY = 20 
}: FadeInUpProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withDelay(delay, withTiming(1, { duration })),
    transform: [
      { translateY: withDelay(delay, withSpring(0, { damping: 15, stiffness: 100 })) }
    ],
  }));

  return (
    <Animated.View 
      style={[{ opacity: 0, transform: [{ translateY }] }, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}
