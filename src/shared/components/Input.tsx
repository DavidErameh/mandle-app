import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import clsx from 'clsx';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ label, error, containerClassName, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: withTiming(isFocused ? 0.4 : 0),
    shadowRadius: withTiming(isFocused ? 12 : 0),
    shadowColor: '#1D9BF0',
    elevation: isFocused ? 4 : 0,
  }));

  return (
    <View className={clsx("w-full", containerClassName)}>
      {label && (
        <Text className="text-sm font-medium text-text-secondary mb-2 ml-1">{label}</Text>
      )}
      <Animated.View 
        style={glowStyle}
        className={clsx(
          "w-full rounded-xl overflow-hidden bg-frosted border border-frosted-border",
          isFocused && "border-accent",
          error && "border-semantic-error bg-semantic-error/10"
        )}
      >
        <TextInput
          className={clsx(
            "w-full px-4 py-3 text-text-primary text-base font-body",
            className
          )}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#1D9BF0"
          {...props}
        />
      </Animated.View>
      {error && (
        <Text className="text-xs text-semantic-error mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
