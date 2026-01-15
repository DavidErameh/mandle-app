import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import clsx from 'clsx';
import { BlurView } from 'expo-blur';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export function Loading({ fullScreen = false, message, className }: LoadingProps) {
  const Animation = (
    <View className="justify-center items-center">
      <LottieView
        source={require('../../../assets/animations/typing.json')}
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
      />
      {message && (
        <Text className="mt-2 text-text-secondary font-body text-sm font-medium">{message}</Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="absolute inset-0 z-50 justify-center items-center">
        {/* Backdrop */}
        <BlurView intensity={20} tint="dark" className="absolute inset-0" />
        <View className="bg-background-secondary/80 p-8 rounded-3xl items-center justify-center">
          {Animation}
        </View>
      </View>
    );
  }

  return (
    <View className={clsx("justify-center items-center p-4", className)}>
      {Animation}
    </View>
  );
}
