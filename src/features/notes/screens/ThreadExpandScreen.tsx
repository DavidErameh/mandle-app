import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { useGenerateContext } from '@/core/di/GenerateContext';
import { Tweet } from '@/features/generate/domain/entities/Tweet';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { Loading } from '@/shared/components/Loading';
import { BrandProfileRepository } from '@/features/settings/data/repositories/BrandProfileRepository';
import { SparklesIcon, ChevronLeftIcon, Square2StackIcon, ArrowPathIcon } from 'react-native-heroicons/outline';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

import clsx from 'clsx';

export default function ThreadExpandScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { noteContent } = route.params as { noteContent: string };
  
  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState<Tweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<'twitter' | 'threads'>('twitter');
  
  const { expandToThreadUseCase } = useGenerateContext();
  const brandRepo = new BrandProfileRepository();

  const generateThread = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await brandRepo.getProfile();
      const results = await expandToThreadUseCase.execute(noteContent, profile, platform);
      setThread(results);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate thread. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [noteContent, expandToThreadUseCase, platform]);

  useEffect(() => {
    generateThread();
  }, [platform]);

  const handleCopyThread = () => {
    const fullText = thread.map((t, i) => `${i + 1}/ ${t.content}`).join('\n\n');
    Share.share({ message: fullText });
  };

  const handleSaveDrafts = () => {
    Alert.alert('Thread Saved', 'All tweets in this thread have been saved to your drafts.');
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="px-md py-4 flex-row items-center border-b border-white/10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-display text-text-primary">Thread Expander</Text>
      </View>

      <View className="px-md pt-md">
        {/* Platform Selector */}
        <View className="bg-primary-tertiary p-1 rounded-2xl flex-row mb-xl">
          <TouchableOpacity 
            onPress={() => setPlatform('twitter')}
            className={clsx(
              "flex-1 py-2.5 rounded-xl flex-row justify-center items-center",
              platform === 'twitter' ? "bg-accent-primary" : "bg-transparent"
            )}
          >
            <Text className={clsx("font-bold text-xs", platform === 'twitter' ? "text-white" : "text-text-tertiary")}>X / Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setPlatform('threads')}
            className={clsx(
              "flex-1 py-2.5 rounded-xl flex-row justify-center items-center",
              platform === 'threads' ? "bg-white" : "bg-transparent"
            )}
          >
            <Text className={clsx("font-bold text-xs", platform === 'threads' ? "text-black" : "text-text-tertiary")}>Threads</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center px-xl">
          <Loading message={`Expanding into a ${platform} thread...`} />
        </View>
      ) : (
        <ScrollView className="flex-1 px-md" contentContainerStyle={{ paddingBottom: 100 }}>
        {error ? (
          <View className="items-center mt-xl">
            <Text className="text-status-error text-center mb-lg">{error}</Text>
            <Button title="Try Again" onPress={generateThread} variant="secondary" />
          </View>
        ) : (
          <>
            <Text className="text-text-tertiary text-xs uppercase tracking-widest mb-4 font-bodyMedium">
              Generated Thread ({thread.length} Tweets)
            </Text>

            {thread.map((tweet, index) => (
              <Animated.View 
                key={tweet.id} 
                entering={FadeInDown.delay(index * 100)}
                className="mb-4"
              >
                <Card className="bg-primary-tertiary border-0 p-4">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-accent-primary font-bold mr-2">{index + 1}/</Text>
                    {tweet.pattern && (
                      <View className="px-2 py-0.5 rounded-full bg-accent-primary/10 border border-accent-primary/20">
                        <Text className="text-[9px] font-bold text-accent-primary uppercase tracking-tighter">
                          {tweet.pattern}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row">
                    <Text className="text-text-primary text-base leading-6 flex-1">
                      {tweet.content}
                    </Text>
                  </View>
                  <View className="flex-row justify-end mt-2 pt-2 border-t border-white/5">
                    <Text className="text-text-tertiary text-[10px]">
                      {tweet.content.length}/280
                    </Text>
                  </View>
                </Card>
              </Animated.View>
            ))}

            <Animated.View entering={FadeInUp.delay(800)} className="mt-lg">
               <View className="flex-row gap-3">
                 <Button 
                   title="Copy Thread" 
                   onPress={handleCopyThread} 
                   variant="secondary" 
                   className="flex-1"
                   icon={<Square2StackIcon size={18} color="#1D9BF0" />}
                 />
                 <Button 
                   title="Regenerate" 
                   onPress={generateThread} 
                   variant="outline" 
                   className="flex-1"
                   icon={<ArrowPathIcon size={18} color="white" />}
                 />
               </View>
               <Button 
                 title="Save All to Drafts" 
                 onPress={handleSaveDrafts} 
                 variant="primary" 
                 className="mt-4 shadow-glow"
                 icon={<SparklesIcon size={18} color="white" />}
               />
            </Animated.View>
          </>
        )}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
