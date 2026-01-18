import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import clsx from 'clsx';
import { useOnline } from '@/shared/hooks/useOnline';
import { useGenerate } from '../hooks/useGenerate';
import { TweetCard } from '../components/TweetCard';
import { Button } from '@/shared/components/Button';
import { Loading } from '@/shared/components/Loading';
import { SparklesIcon, LightBulbIcon, ClipboardDocumentIcon } from 'react-native-heroicons/solid'; 
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';
import { useCollaboration } from '@/core/di/CollaborationContext';
import { useAnalytics } from '@/core/di/AnalyticsContext';
import { Tweet } from '../domain/entities/Tweet';
import { VersionHistoryModal } from '@/features/collaboration/components/VersionHistoryModal';
import { CommentModal } from '@/features/collaboration/components/CommentModal';
import { PerformanceLogModal } from '@/features/collaboration/components/PerformanceLogModal';
import { PolishModal } from '../components/PolishModal';

export default function HomeScreen() {
  const isOnline = useOnline();
  const { generate, loading, error, tweets, poolSize, platform } = useGenerate();
  const { logPerformance, getPerformanceLogs } = useCollaboration();
  const { extractPattern } = useAnalytics();
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);

  const handleExtractPattern = async (tweet: Tweet) => {
    try {
      Alert.alert('Analyzing...', 'Mandle is deconstructing this tweet\'s DNA...');
      await extractPattern.execute(tweet.content);
      Alert.alert('Success', 'Pattern extracted! You can view it in the Insights tab.');
    } catch (error) {
      Alert.alert('Error', 'Failed to extract pattern. AI might be busy.');
    }
  };
  
  // History State
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [historyTargetTweet, setHistoryTargetTweet] = useState<Tweet | null>(null);

  // Comment State
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentTargetTweet, setCommentTargetTweet] = useState<Tweet | null>(null);

  // Performance State
  const [performanceModalVisible, setPerformanceModalVisible] = useState(false);
  const [performanceTargetTweet, setPerformanceTargetTweet] = useState<Tweet | null>(null);

  // Polish State
  const [polishModalVisible, setPolishModalVisible] = useState(false);
  const [polishTargetTweet, setPolishTargetTweet] = useState<Tweet | null>(null);

  const handleOpenHistory = (tweet: Tweet) => {
    setHistoryTargetTweet(tweet);
    setHistoryModalVisible(true);
  };

  const handleOpenComments = (tweet: Tweet) => {
    setCommentTargetTweet(tweet);
    setCommentModalVisible(true);
  };

  const handleOpenPerformance = (tweet: Tweet) => {
    setPerformanceTargetTweet(tweet);
    setPerformanceModalVisible(true);
  };

  const handleOpenPolish = (tweet: Tweet) => {
    setPolishTargetTweet(tweet);
    setPolishModalVisible(true);
  };

  const handlePolished = (polishedContent: string) => {
    if (polishTargetTweet) {
      // Update the tweet content with polished version
      const updatedTweet = new Tweet({
        ...polishTargetTweet,
        content: polishedContent
      });
      
      if (selectedTweet?.id === polishTargetTweet.id) {
        setSelectedTweet(updatedTweet);
      }
    }
  };

  const handleRestoreContent = (newContent: string) => {
    if (historyTargetTweet) {
      // Create a new Tweet instance with the updated content
      const updatedTweet = new Tweet({
        ...historyTargetTweet,
        content: newContent
      });

      if (selectedTweet?.id === historyTargetTweet.id) {
        setSelectedTweet(updatedTweet);
      }
    }
  };

  const handleTweetSelect = (tweet: Tweet) => {
    if (tweet.hasViolations) {
      Alert.alert(
        'Guardrail Violation',
        `This tweet violates your brand guardrails:\n\n${tweet.violations.map(v => `• ${v}`).join('\n')}\n\nDo you want to use it anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Override', style: 'destructive', onPress: () => setSelectedTweet(tweet) }
        ]
      );
    } else {
      setSelectedTweet(tweet);
    }
  };

  const handleCopy = () => {
    if (selectedTweet) {
      Clipboard.setStringAsync(selectedTweet.content);
      Alert.alert('Copied', 'Tweet copied to clipboard!');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 px-md pt-lg" contentContainerStyle={{ paddingBottom: 150 }}>
        <Animated.View entering={FadeInUp.delay(200)}>
          <View className="flex-row justify-between items-center mb-xl">
            <View>
              <Text className="text-3xl font-display text-text-primary">Mandle</Text>
              <Text className="text-text-tertiary font-body">Refining your voice.</Text>
            </View>
            <View className={clsx("w-3 h-3 rounded-full", isOnline ? "bg-status-success shadow-success" : "bg-status-error")} />
          </View>
        </Animated.View>

        {/* Platform Selector */}
        {/* Platform Selector Removed */}

        <Animated.View entering={FadeInUp.delay(400)}>
          <Button 
            title={loading ? "Generating..." : "Generate Content"} 
            onPress={() => {
              setSelectedTweet(null);
              generate();
            }}
            disabled={loading}
            variant="primary"
            className="mb-md shadow-glow"
            icon={!loading && <SparklesIcon size={20} color="white" />}
          />
          
          {/* Active Ideas Pool Status */}
          <View className="flex-row justify-center items-center mb-xl">
            <View className={clsx(
              "p-1.5 rounded-full mr-2",
              poolSize > 0 ? "bg-accent-primary/20 shadow-glow" : "bg-white/5"
            )}>
              <LightBulbIcon size={12} color={poolSize > 0 ? "#1D9BF0" : "rgba(255,255,255,0.3)"} />
            </View>
            <Text className={clsx(
              "text-xs font-medium tracking-wide",
              poolSize > 0 ? "text-accent-primary" : "text-text-tertiary"
            )}>
              {poolSize === 0 ? "Pool is empty (Pillars only)" : `${poolSize} Ideas in your Active Pool`}
            </Text>
          </View>
        </Animated.View>

        {/* Results Area */}
        <View className="pb-10">
           {error && (
             <Animated.View entering={FadeInUp} className="p-4 bg-status-error/10 border border-status-error rounded-xl mb-4">
               <Text className="text-status-error font-medium text-center">{error}</Text>
             </Animated.View>
           )}

           {tweets.length === 0 && !loading && !error && (
             <Animated.View entering={FadeInUp.delay(300)} className="items-center justify-center py-xxl opacity-50">
                <Text className="text-text-tertiary font-body text-center mb-4">
                  Ready to write.
                </Text>
             </Animated.View>
           )}

           {loading && (
             <View className="py-xxl items-center">
               <Loading message="Consulting the algorithm..." />
             </View>
           )}

           {tweets.map((tweet, index) => (
             <Animated.View key={tweet.id} entering={FadeInUp.delay(index * 100 + 400)}>
                <TweetCard
                  tweet={tweet}
                  className="mb-md"
                  isSelected={selectedTweet?.id === tweet.id}
                  onSelect={handleTweetSelect}
                  onHistoryPress={handleOpenHistory}
                  onCommentPress={handleOpenComments}
                  onPerformancePress={handleOpenPerformance}
                  onExtractPattern={handleExtractPattern}
                  onPolishPress={handleOpenPolish}
                />
             </Animated.View>
           ))}
        </View>
      </ScrollView>

      {/* History Modal */}
      <VersionHistoryModal 
        visible={historyModalVisible}
        onClose={() => setHistoryModalVisible(false)}
        tweet={historyTargetTweet}
        onRestoreAction={handleRestoreContent}
      />

      <CommentModal 
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        tweet={commentTargetTweet}
      />

      <PerformanceLogModal 
        visible={performanceModalVisible}
        onClose={() => setPerformanceModalVisible(false)}
        tweet={performanceTargetTweet}
      />

      <PolishModal
        visible={polishModalVisible}
        onClose={() => setPolishModalVisible(false)}
        tweet={polishTargetTweet}
        onPolished={handlePolished}
      />

      {/* Floating Copy Button */}
      {selectedTweet && (
        <Animated.View 
          entering={FadeInDown} 
          className="absolute bottom-24 left-md right-md px-md"
        >
          <Button 
            title="Copy and Post" 
            onPress={handleCopy}
            variant="primary"
            className="bg-semantic-success shadow-glow-success h-14"
            icon={<ClipboardDocumentIcon size={20} color="white" />}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
