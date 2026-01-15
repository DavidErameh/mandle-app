import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { XMarkIcon, PaperAirplaneIcon } from 'react-native-heroicons/outline';
import { BlurView } from 'expo-blur';
import { CommentItem } from './CommentItem';
import { useComments } from '../hooks/useComments';
import { Tweet } from '@/features/generate/domain/entities/Tweet';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import clsx from 'clsx';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  tweet: Tweet | null;
}

export const CommentModal: React.FC<CommentModalProps> = ({ visible, onClose, tweet }) => {
  const { comments, loading, fetchComments, postComment, toggleResolve } = useComments(tweet?.id || '');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (visible && tweet) {
      fetchComments();
    }
  }, [visible, tweet, fetchComments]);

  const handleSend = async () => {
    if (inputText.trim()) {
      await postComment(inputText.trim());
      setInputText('');
    }
  };

  if (!tweet) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-end">
          <Animated.View entering={FadeIn} className="absolute inset-0 bg-black/60">
            <TouchableOpacity className="flex-1" onPress={onClose} />
          </Animated.View>

          <Animated.View 
            entering={SlideInDown.springify().damping(20)}
            className="bg-background-secondary rounded-t-[40px] border-t border-border-light h-[80%]"
          >
            <BlurView intensity={30} tint="dark" className="flex-1 rounded-t-[40px] overflow-hidden">
              <View className="p-6 flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                  <View>
                    <Text className="text-2xl font-display text-text-primary">Feedback</Text>
                    <Text className="text-xs text-text-tertiary">Collaborate on this draft</Text>
                  </View>
                  <TouchableOpacity onPress={onClose} className="bg-frosted/10 p-2 rounded-full">
                    <XMarkIcon size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Draft Preview */}
                <View className="p-4 bg-frosted-default rounded-2xl mb-6 border border-border-light">
                  <Text className="text-text-secondary text-sm font-body italic">
                    "{tweet.content}"
                  </Text>
                </View>

                {/* Comments List */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                  {comments.length === 0 && !loading ? (
                    <View className="py-20 items-center opacity-30">
                      <Text className="text-text-tertiary">No feedback yet. Tag @assistant for help.</Text>
                    </View>
                  ) : (
                    comments.map(comment => (
                      <CommentItem 
                        key={comment.id} 
                        comment={comment} 
                        onResolveToggle={() => toggleResolve(comment.id, comment.resolved)}
                      />
                    ))
                  )}
                  {loading && <Text className="text-center text-text-tertiary py-4">Loading...</Text>}
                </ScrollView>

                {/* Input Area */}
                <View className="pt-4 border-t border-border-light flex-row items-center">
                  <TextInput
                    className="flex-1 bg-background-tertiary p-4 rounded-2xl text-white font-body mr-3 border border-border-light"
                    placeholder="Add a comment... Mention @assistant"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                  />
                  <TouchableOpacity 
                    onPress={handleSend}
                    disabled={!inputText.trim()}
                    className={clsx(
                      "p-4 rounded-2xl",
                      inputText.trim() ? "bg-accent-primary" : "bg-white/5"
                    )}
                  >
                    <PaperAirplaneIcon size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
