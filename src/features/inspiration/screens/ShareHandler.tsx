import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShareIntent } from 'expo-share-intent';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import clsx from 'clsx';

import { AnalyzeTweetUseCase, TweetAnalysis } from '../domain/useCases/AnalyzeTweetUseCase';
import { RecreateTweetUseCase } from '../domain/useCases/RecreateTweetUseCase';
import { Button } from '@/shared/components/Button';
import { Loading } from '@/shared/components/Loading';
import { Card } from '@/shared/components/Card';
import { 
  SparklesIcon, 
  ClipboardDocumentIcon,
  XMarkIcon,
  BookmarkIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  BookOpenIcon
} from 'react-native-heroicons/outline';

// Analysis result badge colors
const HOOK_COLORS: Record<string, string> = {
  question: 'bg-purple-500/20 text-purple-400',
  statement: 'bg-blue-500/20 text-blue-400',
  stat: 'bg-green-500/20 text-green-400',
  story: 'bg-orange-500/20 text-orange-400',
  unknown: 'bg-gray-500/20 text-gray-400',
};

const EMOTION_COLORS: Record<string, string> = {
  curiosity: 'bg-yellow-500/20 text-yellow-400',
  urgency: 'bg-red-500/20 text-red-400',
  aspiration: 'bg-emerald-500/20 text-emerald-400',
  relatability: 'bg-pink-500/20 text-pink-400',
  humor: 'bg-cyan-500/20 text-cyan-400',
  unknown: 'bg-gray-500/20 text-gray-400',
};

export default function ShareHandler() {
  // Check if navigation context exists before trying to use it
  // This prevents the "Couldn't find a navigation context" error
  const navigationState = useNavigationState(state => state);
  const navigation = useNavigation();
  const { shareIntent, resetShareIntent, hasShareIntent } = useShareIntent();
  
  // Guard against navigation context not being ready (e.g., during deep link)
  if (!navigationState || !navigation) {
    console.warn('[ShareHandler] Navigation context not ready');
    return <Loading message="Initializing..." />;
  }
  
  const [originalContent, setOriginalContent] = useState<string>('');
  const [analysis, setAnalysis] = useState<TweetAnalysis | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');

  // Handle incoming share intent
  useEffect(() => {
    if (hasShareIntent && shareIntent) {
      handleShareIntent(shareIntent);
    }
  }, [hasShareIntent, shareIntent]);

  const handleShareIntent = async (intent: any) => {
    let content = '';
    
    // Extract text from share intent
    if (intent.text) {
      content = intent.text;
    } else if (intent.webUrl) {
      content = intent.webUrl;
    }

    if (content) {
      // If it's a URL, prompt user to paste the tweet content
      if (content.startsWith('http')) {
        Alert.alert(
          'Tweet URL Detected',
          'Please paste the tweet text you want to analyze:',
          [
            { text: 'Cancel', onPress: () => navigation.goBack() },
            { text: 'Paste from Clipboard', onPress: () => pasteFromClipboard() }
          ]
        );
      } else {
        setOriginalContent(content);
        await analyzeAndRecreate(content);
      }
    }
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setOriginalContent(text);
      await analyzeAndRecreate(text);
    } else {
      Alert.alert('Clipboard Empty', 'No text found in clipboard');
    }
  };

  const analyzeAndRecreate = async (content: string) => {
    setStep('analyzing');
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Step 1: Analyze the tweet
      const analyzeUseCase = new AnalyzeTweetUseCase();
      const analysisResult = await analyzeUseCase.execute(content);
      setAnalysis(analysisResult);

      // Step 2: Generate variations
      const recreateUseCase = new RecreateTweetUseCase();
      const recreatedTweets = await recreateUseCase.execute(content);
      setVariations(recreatedTweets);

      setStep('results');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Analysis failed:', error);
      Alert.alert('Error', 'Failed to analyze tweet. Please try again.');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyVariation = async (index: number) => {
    const content = variations[index];
    await Clipboard.setStringAsync(content);
    setSelectedVariation(index);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Tweet copied to clipboard. Go post it!');
  };

  const handleSaveToLibrary = async () => {
    // TODO: Save to InspirationRepository
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Saved!', 'Added to your inspiration library.');
  };

  const handleClose = () => {
    resetShareIntent();
    navigation.goBack();
  };

  const renderAnalysisBadge = (label: string, value: string, colorMap: Record<string, string>) => (
    <View className={clsx('px-3 py-1.5 rounded-full mr-2 mb-2', colorMap[value] || colorMap.unknown)}>
      <Text className="text-xs font-medium capitalize">{label}: {value}</Text>
    </View>
  );

  const renderHookIcon = (hookType: string) => {
    switch (hookType) {
      case 'question': return <QuestionMarkCircleIcon size={16} color="#A855F7" />;
      case 'statement': return <ChatBubbleLeftIcon size={16} color="#3B82F6" />;
      case 'stat': return <ChartBarIcon size={16} color="#22C55E" />;
      case 'story': return <BookOpenIcon size={16} color="#F97316" />;
      default: return null;
    }
  };

  // Manual input mode
  if (step === 'input' && !hasShareIntent) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <View className="flex-row justify-between items-center px-4 py-3">
          <Text className="text-xl font-display text-text-primary">Analyze Tweet</Text>
          <TouchableOpacity onPress={handleClose}>
            <XMarkIcon size={24} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-4 justify-center">
          <Text className="text-text-secondary text-center mb-6">
            Share a tweet from Twitter/X to Mandle, or paste tweet content below
          </Text>
          
          <Button
            title="Paste from Clipboard"
            onPress={pasteFromClipboard}
            variant="primary"
            icon={<ClipboardDocumentIcon size={20} color="white" />}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Loading/Analyzing state
  if (step === 'analyzing' || loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary justify-center items-center">
        <Loading message="Deconstructing tweet DNA..." />
        <Text className="text-text-tertiary mt-4 text-sm">Analyzing structure, hook, and emotion...</Text>
      </SafeAreaView>
    );
  }

  // Results view
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-frosted/10">
        <Text className="text-xl font-display text-text-primary">Tweet Analysis</Text>
        <TouchableOpacity onPress={handleClose}>
          <XMarkIcon size={24} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Original Tweet */}
        <Animated.View entering={FadeInUp.delay(100)} className="mt-4">
          <Text className="text-text-tertiary text-xs uppercase tracking-wider mb-2">Original Tweet</Text>
          <Card className="bg-frosted/5 border border-frosted/10">
            <Text className="text-text-secondary font-body">{originalContent}</Text>
          </Card>
        </Animated.View>

        {/* Analysis Results */}
        {analysis && (
          <Animated.View entering={FadeInUp.delay(200)} className="mt-6">
            <Text className="text-text-tertiary text-xs uppercase tracking-wider mb-3">Pattern Analysis</Text>
            
            <View className="flex-row flex-wrap">
              {renderAnalysisBadge('Hook', analysis.hookType, HOOK_COLORS)}
              {renderAnalysisBadge('Emotion', analysis.emotion, EMOTION_COLORS)}
              {renderAnalysisBadge('Structure', analysis.structure, HOOK_COLORS)}
              {renderAnalysisBadge('CTA', analysis.ctaType, EMOTION_COLORS)}
            </View>

            <Text className="text-text-secondary text-sm mt-3 italic">
              "{analysis.summary}"
            </Text>
          </Animated.View>
        )}

        {/* Variations */}
        {variations.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300)} className="mt-6">
            <Text className="text-text-tertiary text-xs uppercase tracking-wider mb-3">
              In Your Voice ({variations.length} variations)
            </Text>

            {variations.map((content, index) => (
              <Animated.View 
                key={index} 
                entering={FadeInUp.delay(400 + index * 100)}
              >
                <TouchableOpacity 
                  onPress={() => handleCopyVariation(index)}
                  className={clsx(
                    "p-4 rounded-xl mb-3 border",
                    selectedVariation === index 
                      ? "bg-accent-primary/10 border-accent-primary" 
                      : "bg-frosted/5 border-frosted/10"
                  )}
                >
                  <Text className="text-text-primary font-body mb-2">{content}</Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-tertiary text-xs">{content.length} chars</Text>
                    <View className="flex-row items-center">
                      <ClipboardDocumentIcon size={14} color="rgba(255,255,255,0.4)" />
                      <Text className="text-text-tertiary text-xs ml-1">Tap to copy</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View 
        entering={FadeInDown.delay(500)} 
        className="absolute bottom-0 left-0 right-0 p-4 bg-background-primary border-t border-frosted/10"
      >
        <View className="flex-row space-x-3">
          <Button
            title="Save to Library"
            onPress={handleSaveToLibrary}
            variant="secondary"
            className="flex-1"
            icon={<BookmarkIcon size={18} color="white" />}
          />
          <Button
            title="Regenerate"
            onPress={() => analyzeAndRecreate(originalContent)}
            variant="primary"
            className="flex-1"
            icon={<SparklesIcon size={18} color="white" />}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
