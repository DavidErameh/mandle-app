import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Button } from './Button';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface EmptyStateProps {
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  lottieSource?: any; // Allow override
}

export function EmptyState({ title, description, actionTitle, onAction, lottieSource }: EmptyStateProps) {
  return (
    <Animated.View 
      entering={FadeInUp.delay(200)} 
      className="flex-1 justify-center items-center p-md"
    >
      <View className="mb-lg w-48 h-48 opacity-70">
        <LottieView
          source={lottieSource || require('../../../assets/animations/empty.json')}
          autoPlay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      
      <Text className="text-2xl font-h2 text-text-primary text-center mb-2">
        {title}
      </Text>
      
      <Text className="text-base font-body text-text-secondary text-center mb-8 px-4 opacity-80">
        {description}
      </Text>

      {actionTitle && onAction && (
        <Button 
          title={actionTitle} 
          onPress={onAction} 
          variant="primary"
          className="min-w-[160px]"
        />
      )}
    </Animated.View>
  );
}
