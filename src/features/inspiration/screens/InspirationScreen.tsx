import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { useInspiration } from '../hooks/useInspiration';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Loading } from '@/shared/components/Loading';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { 
  PlusCircleIcon, 
  TrashIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  LinkIcon, 
  ShareIcon, 
  SparklesIcon, 
  DocumentDuplicateIcon 
} from 'react-native-heroicons/outline';
import { InspirationTweet } from '../domain/entities/Inspiration';

export default function InspirationScreen() {
  const { 
    accounts, 
    manualInspirations,
    loading, 
    error, 
    connectAccount, 
    disconnectAccount, 
    getTopTweets,
    analyzeUrl,
    deleteManualInspiration
  } = useInspiration();
  
  const [activeTab, setActiveTab] = useState<'accounts' | 'library'>('accounts');
  const [newHandle, setNewHandle] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedTweets, setSelectedTweets] = useState<InspirationTweet[]>([]);

  const handleExpand = async (accountId: string) => {
    if (expandedId === accountId) {
      setExpandedId(null);
      setSelectedTweets([]);
    } else {
      setExpandedId(accountId);
      const tweets = await getTopTweets(accountId);
      setSelectedTweets(tweets);
    }
  };

  const handleAnalyze = async () => {
    if (!shareUrl) return;
    await analyzeUrl(shareUrl);
    setShareUrl('');
    setActiveTab('library');
  };

  const copyToClipboard = async (text: string) => {
    // In a real device we'd use expo-clipboard
    Alert.alert('Copied to clipboard', text.substring(0, 50) + '...');
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 px-md pt-md">
        <View className="flex-row items-center justify-between mb-md">
          <Text className="text-display font-display text-text-primary">Inspiration</Text>
          <View className="bg-frosted/30 px-3 py-1 rounded-full border border-frosted">
            <Text className="text-text-secondary font-bold">
              {activeTab === 'accounts' ? `${accounts.length} / 4` : manualInspirations.length}
            </Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View className="flex-row bg-primary-dark/50 p-1 rounded-xl mb-lg border border-frosted/10">
          <TouchableOpacity 
            onPress={() => setActiveTab('accounts')}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'accounts' ? 'bg-secondary/20 border border-secondary/30' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'accounts' ? 'text-secondary' : 'text-text-tertiary'}`}>Accounts</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('library')}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'library' ? 'bg-secondary/20 border border-secondary/30' : ''}`}
          >
            <Text className={`font-bold ${activeTab === 'library' ? 'text-secondary' : 'text-text-tertiary'}`}>Library</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View className="bg-semantic-error/10 p-3 rounded-lg mb-4 border border-semantic-error/30">
            <Text className="text-semantic-error">{error}</Text>
          </View>
        )}
        
        {/* Connection / Analysis Form */}
        <View className="mb-xl">
           <Text className="text-h2 font-display text-text-primary mb-4">
             {activeTab === 'accounts' ? 'Connect Account' : 'Analyze Tweet URL'}
           </Text>
           <View className="flex-row gap-2">
             <View className="flex-1">
               <Input 
                 placeholder={activeTab === 'accounts' ? "@username" : "https://twitter.com/..."} 
                 value={activeTab === 'accounts' ? newHandle : shareUrl}
                 onChangeText={activeTab === 'accounts' ? setNewHandle : setShareUrl}
               />
             </View>
             <Button 
              title={activeTab === 'accounts' ? 'Add' : 'Analyze'} 
              variant="secondary"
              disabled={loading}
              onPress={activeTab === 'accounts' ? () => {
                if(newHandle) {
                  connectAccount('twitter', newHandle);
                  setNewHandle('');
                }
              } : handleAnalyze}
            />
           </View>
        </View>

        {/* List Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {loading && (activeTab === 'accounts' ? accounts.length === 0 : manualInspirations.length === 0) && (
            <Loading message={activeTab === 'accounts' ? "Loading accounts..." : "Analyzing tweet..."} />
          )}
          
          {activeTab === 'accounts' ? (
            accounts.map((acc, index) => (
              <Animated.View key={acc.id} entering={FadeInUp.delay(index * 100)}>
                <Card className="mb-4">
                  {/* Account Header */}
                   <View className="flex-row items-center mb-2">
                      <View className="w-12 h-12 rounded-full bg-frosted/20 items-center justify-center mr-3 overflow-hidden border border-frosted">
                        {acc.avatarUrl ? (
                          <Image source={{ uri: acc.avatarUrl }} className="w-full h-full" />
                        ) : (
                          <Text className="text-h3 text-text-tertiary">{acc.accountName.charAt(1).toUpperCase()}</Text>
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-h3 font-display text-text-primary" numberOfLines={1}>{acc.accountName}</Text>
                        <View className="flex-row items-center">
                          <Text className="text-caption text-text-tertiary uppercase mr-2">{acc.platform}</Text>
                          <View className="w-1 h-1 rounded-full bg-text-tertiary mr-2" />
                          <Text className="text-caption text-semantic-success font-bold">Score: {acc.viralScore.toFixed(1)}</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        onPress={() => disconnectAccount(acc.id)}
                        className="p-2"
                      >
                        <TrashIcon size={20} color="#ff4d4d" />
                      </TouchableOpacity>
                   </View>
                   
                   {/* Patterns and Expandable Tweets */}
                   <View className="mt-2 border-t border-frosted/10 pt-3">
                     <View className="flex-row items-center justify-between mb-2">
                       <Text className="text-xs text-text-secondary font-bold uppercase tracking-wider">Top Viral Formats</Text>
                       <TouchableOpacity 
                         onPress={() => handleExpand(acc.id)}
                         className="flex-row items-center"
                       >
                         <Text className="text-xs text-secondary font-bold mr-1">
                           {expandedId === acc.id ? 'Hide' : 'View Top Tweets'}
                         </Text>
                         {expandedId === acc.id ? <ChevronUpIcon size={14} color="#64ffda" /> : <ChevronDownIcon size={14} color="#64ffda" />}
                       </TouchableOpacity>
                     </View>
                     
                     <View className="flex-row flex-wrap gap-2">
                       {acc.patterns.map(p => (
                         <View key={p.id} className="bg-frosted/5 p-2 rounded-lg border border-frosted/10">
                           <Text className="text-xs text-text-primary">{p.description}</Text>
                         </View>
                       ))}
                     </View>
                     
                     {expandedId === acc.id && (
                       <Animated.View entering={FadeInUp} className="mt-4 pt-4 border-t border-frosted/10">
                         <Text className="text-xs text-text-tertiary font-bold mb-3 uppercase tracking-widest">Recent Viral Content</Text>
                         {selectedTweets.map((t, i) => (
                           <View key={i} className="mb-4 bg-primary-dark/30 p-3 rounded-xl border border-frosted/5">
                              <Text className="text-body text-text-primary mb-2 italic">"{t.content}"</Text>
                              <View className="flex-row items-center justify-between">
                                <Text className="text-caption text-text-tertiary">Engagement: {t.engagement.toLocaleString()}</Text>
                                <View className="bg-secondary/10 px-2 py-0.5 rounded">
                                  <Text className="text-[10px] text-secondary font-bold uppercase">{t.patterns[0]}</Text>
                                </View>
                              </View>
                           </View>
                         ))}
                       </Animated.View>
                     )}
                   </View>
                </Card>
              </Animated.View>
            ))
          ) : (
            manualInspirations.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInUp.delay(index * 100)}>
                <Card className="mb-6">
                  {/* Analysis Header */}
                  <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <SparklesIcon size={18} color="#64ffda" />
                        <Text className="text-h3 font-display text-text-primary ml-2">Format Recreation</Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteManualInspiration(item.id)}>
                        <TrashIcon size={18} color="#ff4d4d" />
                      </TouchableOpacity>
                    </View>
                    
                    <View className="bg-primary-dark/30 p-3 rounded-xl border border-frosted/10 mb-3">
                      <Text className="text-xs text-text-tertiary font-bold mb-1 uppercase">Source Hook Structure</Text>
                      <Text className="text-body text-text-secondary italic" numberOfLines={2}>"{item.content}"</Text>
                    </View>

                    {/* Meta Tags */}
                    <View className="flex-row flex-wrap gap-2 mb-4">
                      <View className="bg-secondary/10 px-2 py-1 rounded border border-secondary/20">
                        <Text className="text-[10px] text-secondary font-bold uppercase">Hook: {item.analysis.hookType}</Text>
                      </View>
                      <View className="bg-frosted/10 px-2 py-1 rounded border border-frosted/20">
                        <Text className="text-[10px] text-text-primary font-bold uppercase">Mood: {item.analysis.emotion}</Text>
                      </View>
                      <View className="bg-frosted/10 px-2 py-1 rounded border border-frosted/20">
                        <Text className="text-[10px] text-text-primary font-bold uppercase">Struct: {item.analysis.structure}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Variations */}
                  <View className="border-t border-frosted/10 pt-4">
                    <Text className="text-xs text-text-tertiary font-bold mb-3 uppercase tracking-widest">Recreations in Your Voice</Text>
                    {item.variations.map((v, i) => (
                      <View key={i} className="mb-4 bg-secondary/5 p-3 rounded-xl border border-secondary/10">
                        <Text className="text-body text-text-primary mb-3 leading-relaxed">{v}</Text>
                        <TouchableOpacity 
                          className="flex-row items-center justify-end"
                          onPress={() => copyToClipboard(v)}
                        >
                          <DocumentDuplicateIcon size={14} color="#64ffda" />
                          <Text className="text-xs text-secondary font-bold ml-1">Copy</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </Card>
              </Animated.View>
            ))
          )}
          
          {(activeTab === 'accounts' ? accounts.length === 0 : manualInspirations.length === 0) && !loading && (
            <Text className="text-center text-text-tertiary mt-10">
              {activeTab === 'accounts' ? "No accounts connected yet." : "No shared tweets in your library."}
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
