import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { XMarkIcon, ChartBarIcon } from 'react-native-heroicons/outline';
import { BlurView } from 'expo-blur';
import { usePerformance } from '../hooks/usePerformance';
import { Tweet } from '@/features/generate/domain/entities/Tweet';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import clsx from 'clsx';

interface PerformanceLogModalProps {
  visible: boolean;
  onClose: () => void;
  tweet: Tweet | null;
}

export const PerformanceLogModal: React.FC<PerformanceLogModalProps> = ({ visible, onClose, tweet }) => {
  const { submitLog, loading } = usePerformance();
  const [metrics, setMetrics] = useState({
    impressions: '',
    likes: '',
    retweets: '',
    replies: '',
    follows: '',
    clicks: ''
  });

  const handleSave = async () => {
    if (!tweet) return;
    
    try {
      await submitLog({
        draftId: tweet.id,
        content: tweet.content,
        platform: tweet.platform as 'twitter' | 'threads',
        metrics: {
          impressions: parseInt(metrics.impressions) || 0,
          likes: parseInt(metrics.likes) || 0,
          retweets: parseInt(metrics.retweets) || 0,
          replies: parseInt(metrics.replies) || 0,
          follows: parseInt(metrics.follows) || 0,
          clicks: parseInt(metrics.clicks) || 0
        },
        postedAt: new Date(), // Using current date as mock posted date
        tags: [] // Fixed: Tweet entity doesn't have tags yet, using empty array for log
      });
      onClose();
    } catch (err) {
      // Error handled by hook
    }
  };

  const updateMetric = (key: keyof typeof metrics, val: string) => {
    setMetrics(prev => ({ ...prev, [key]: val.replace(/[^0-9]/g, '') }));
  };

  if (!tweet) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-1 justify-end">
          <Animated.View entering={FadeIn} className="absolute inset-0 bg-black/60">
            <TouchableOpacity className="flex-1" onPress={onClose} />
          </Animated.View>

          <Animated.View 
            entering={SlideInDown.springify().damping(20)}
            className="bg-background-secondary rounded-t-[40px] border-t border-border-light h-[85%]"
          >
            <BlurView intensity={30} tint="dark" className="flex-1 rounded-t-[40px] overflow-hidden">
              <View className="p-6 flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                  <View>
                    <Text className="text-2xl font-display text-text-primary">Log Performance</Text>
                    <Text className="text-xs text-text-tertiary">How did this tweet perform?</Text>
                  </View>
                  <TouchableOpacity onPress={onClose} className="bg-frosted/10 p-2 rounded-full">
                    <XMarkIcon size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Content Preview */}
                <View className="p-4 bg-frosted-default rounded-2xl mb-6 border border-border-light">
                  <Text className="text-text-secondary text-sm font-body italic" numberOfLines={2}>
                    "{tweet.content}"
                  </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                  <View className="flex-row flex-wrap justify-between">
                    <MetricInput 
                      label="Impressions" 
                      value={metrics.impressions} 
                      onChange={(v: string) => updateMetric('impressions', v)} 
                      placeholder="e.g. 1000"
                    />
                    <MetricInput 
                      label="Likes" 
                      value={metrics.likes} 
                      onChange={(v: string) => updateMetric('likes', v)} 
                      placeholder="0"
                    />
                    <MetricInput 
                      label="Retweets" 
                      value={metrics.retweets} 
                      onChange={(v: string) => updateMetric('retweets', v)} 
                      placeholder="0"
                    />
                    <MetricInput 
                      label="Replies" 
                      value={metrics.replies} 
                      onChange={(v: string) => updateMetric('replies', v)} 
                      placeholder="0"
                    />
                    <MetricInput 
                      label="Follows" 
                      value={metrics.follows} 
                      onChange={(v: string) => updateMetric('follows', v)} 
                      placeholder="0"
                    />
                    <MetricInput 
                      label="Clicks" 
                      value={metrics.clicks} 
                      onChange={(v: string) => updateMetric('clicks', v)} 
                      placeholder="Optional"
                    />
                  </View>

                  <View className="mt-8 p-6 bg-accent-primary/10 rounded-3xl border border-accent-primary/20 items-center">
                    <Text className="text-accent-primary font-bold text-xs uppercase mb-1">Engagement Forecast</Text>
                    <Text className="text-text-primary text-3xl font-display">
                      {calculateLiveScore(metrics)}
                    </Text>
                    <Text className="text-text-tertiary text-[10px] mt-1 italic">Score auto-calculated based on metrics</Text>
                  </View>
                </ScrollView>

                <TouchableOpacity 
                  onPress={handleSave}
                  disabled={loading || !metrics.impressions}
                  className={clsx(
                    "mt-4 p-5 rounded-2xl flex-row justify-center items-center",
                    metrics.impressions ? "bg-accent-primary" : "bg-white/5"
                  )}
                >
                  <ChartBarIcon size={20} color="white" />
                  <Text className="text-white font-bold ml-2 text-lg">
                    {loading ? "Saving..." : "Save Metrics"}
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const MetricInput = ({ label, value, onChange, placeholder }: any) => (
  <View className="w-[48%] mb-4">
    <Text className="text-text-tertiary text-xs font-bold mb-2 uppercase ml-1">{label}</Text>
    <TextInput
      className="bg-background-tertiary p-4 rounded-2xl text-white font-body border border-border-light"
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.2)"
    />
  </View>
);

const calculateLiveScore = (metrics: any) => {
  const imp = parseInt(metrics.impressions) || 0;
  if (imp === 0) return '0.0';
  
  const likes = parseInt(metrics.likes) || 0;
  const rt = parseInt(metrics.retweets) || 0;
  const rep = parseInt(metrics.replies) || 0;
  const follows = parseInt(metrics.follows) || 0;

  const er = (likes + rt + rep) / imp;
  const score = (imp / 1000) * 0.3 + (er * 10) * 0.4 + (follows) * 0.3;
  return Math.min(Math.max(score, 0), 10).toFixed(1);
};
