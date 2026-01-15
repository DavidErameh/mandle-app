import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { XMarkIcon, SparklesIcon, ArrowPathIcon } from 'react-native-heroicons/outline';
import { Tweet } from '../domain/entities/Tweet';
import { PolishStyle, POLISH_STYLE_DESCRIPTIONS } from '@/core/ai/prompts/PolishPrompt';
import { Button } from '@/shared/components/Button';
import { useGenerateContext } from '@/core/di/GenerateContext';
import { BrandProfileManager } from '@/core/brand/BrandProfileManager';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface PolishModalProps {
  visible: boolean;
  onClose: () => void;
  tweet: Tweet | null;
  onPolished?: (polishedContent: string) => void;
}

const POLISH_STYLES: { key: PolishStyle; label: string; emoji: string }[] = [
  { key: 'punchier', label: 'Make Punchier', emoji: '💥' },
  { key: 'simplify', label: 'Simplify', emoji: '✨' },
  { key: 'add-hook', label: 'Add Hook', emoji: '🎣' },
  { key: 'conversational', label: 'More Casual', emoji: '💬' },
  { key: 'professional', label: 'Professional', emoji: '👔' },
  { key: 'emotional', label: 'Emotional', emoji: '❤️' },
  { key: 'shorter', label: 'Shorter', emoji: '✂️' },
];

export function PolishModal({ visible, onClose, tweet, onPolished }: PolishModalProps) {
  const { polishUseCase } = useGenerateContext();
  const [selectedStyle, setSelectedStyle] = useState<PolishStyle | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePolish = async (style: PolishStyle) => {
    if (!tweet) return;
    
    setSelectedStyle(style);
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const brandManager = new BrandProfileManager();
      const profile = await brandManager.getActiveProfile();
      
      const polishResult = await polishUseCase.execute({
        tweet,
        style,
        brandProfile: profile,
        platform: tweet.platform
      });
      
      setResult(polishResult.polished);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Polish Failed', 'AI is busy. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      onPolished?.(result);
      handleClose();
    }
  };

  const handleClose = () => {
    setResult(null);
    setSelectedStyle(null);
    onClose();
  };

  if (!tweet) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={60} tint="dark" className="flex-1">
        <View className="flex-1 justify-end">
          <Animated.View 
            entering={FadeIn} 
            exiting={FadeOut}
            className="bg-background-secondary rounded-t-3xl max-h-[85%] border-t border-border-default"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 border-b border-border-light">
              <View className="flex-row items-center">
                <SparklesIcon size={20} color="#1D9BF0" />
                <Text className="text-h3 font-display text-white ml-2">Polish Tweet</Text>
              </View>
              <TouchableOpacity onPress={handleClose}>
                <XMarkIcon size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4">
              {/* Original Tweet */}
              <View className="mb-6">
                <Text className="text-xs text-text-tertiary uppercase tracking-widest mb-2">Original</Text>
                <View className="bg-background-tertiary p-4 rounded-xl border border-border-light">
                  <Text className="text-text-secondary text-body">{tweet.content}</Text>
                </View>
              </View>

              {/* Style Selection or Result */}
              {!result ? (
                <View>
                  <Text className="text-xs text-text-tertiary uppercase tracking-widest mb-3">
                    {loading ? 'Polishing...' : 'Choose Style'}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {POLISH_STYLES.map(({ key, label, emoji }) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => handlePolish(key)}
                        disabled={loading}
                        className={`flex-row items-center px-4 py-3 rounded-xl border ${
                          selectedStyle === key && loading
                            ? 'bg-accent-primary/20 border-accent-primary'
                            : 'bg-frosted-default border-border-light'
                        } ${loading ? 'opacity-50' : ''}`}
                      >
                        {selectedStyle === key && loading ? (
                          <ArrowPathIcon size={16} color="#1D9BF0" className="animate-spin" />
                        ) : (
                          <Text className="mr-2">{emoji}</Text>
                        )}
                        <Text className={`text-sm font-medium ${
                          selectedStyle === key && loading ? 'text-accent-primary' : 'text-white'
                        }`}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <View>
                  <Text className="text-xs text-text-tertiary uppercase tracking-widest mb-2">Polished Result</Text>
                  <View className="bg-accent-primary/10 p-4 rounded-xl border border-accent-primary/30 mb-4">
                    <Text className="text-white text-body leading-relaxed">{result}</Text>
                    <Text className="text-accent-primary text-xs mt-2 font-medium">
                      {result.length} characters
                    </Text>
                  </View>
                  
                  <View className="flex-row gap-3">
                    <Button
                      title="Try Another"
                      variant="secondary"
                      onPress={() => setResult(null)}
                      className="flex-1"
                    />
                    <Button
                      title="Use This"
                      variant="primary"
                      onPress={handleAccept}
                      className="flex-1"
                    />
                  </View>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
}
