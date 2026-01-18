import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/shared/components/Button';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-lg justify-between py-xxl">
      <View className="mt-xxl">
        <Text className="text-display font-display text-text-primary text-center mb-md">Mandle</Text>
        <Text className="text-h2 font-display text-text-secondary text-center">
          write less.{'\n'}express more.
        </Text>
      </View>
      
      <View>
        <Text className="text-body text-text-tertiary text-center mb-xl px-md">
          Your personal AI ghostwriter that learns your voice and never runs out of ideas.
        </Text>
        <Button 
          title="Get Started" 
          onPress={() => navigation.navigate('PillarSetup')} 
          variant="primary"
          className="shadow-glow"
        />
      </View>
    </SafeAreaView>
  );
}

