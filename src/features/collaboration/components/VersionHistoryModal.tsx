import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { BlurView } from 'expo-blur';
import { VersionTimeline } from './VersionTimeline';
import { useVersionHistory } from '../hooks/useVersionHistory';
import { Tweet } from '@/features/generate/domain/entities/Tweet';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

interface VersionHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  tweet: Tweet | null;
  onRestoreAction: (newContent: string) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ 
  visible, 
  onClose, 
  tweet,
  onRestoreAction
}) => {
  const { versions, fetchHistory, restore, loading } = useVersionHistory(tweet?.id || '');

  useEffect(() => {
    if (visible && tweet) {
      fetchHistory();
    }
  }, [visible, tweet, fetchHistory]);

  const handleRestore = async (version: any) => {
    await restore(version);
    onRestoreAction(version.content);
    onClose();
  };

  if (!tweet) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Animated.View 
          entering={FadeIn}
          className="absolute inset-0 bg-black/60"
        >
          <TouchableOpacity className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View 
          entering={SlideInDown.springify().damping(20)}
          className="bg-background-secondary rounded-t-[40px] border-t border-border-light h-[70%]"
        >
          <BlurView intensity={30} tint="dark" className="flex-1 rounded-t-[40px] overflow-hidden">
            <View className="p-6 flex-1">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-2xl font-display text-text-primary">Version History</Text>
                  <Text className="text-xs text-text-tertiary">Track iterations and revert changes</Text>
                </View>
                <TouchableOpacity onPress={onClose} className="bg-frosted/10 p-2 rounded-full">
                  <XMarkIcon size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Timeline */}
              <VersionTimeline 
                versions={versions} 
                onRestore={handleRestore}
                currentContent={tweet.content}
              />

              {loading && (
                <View className="absolute inset-0 bg-black/20 items-center justify-center">
                  <Text className="text-secondary font-bold">Processing...</Text>
                </View>
              )}
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
};
