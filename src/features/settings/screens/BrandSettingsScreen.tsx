import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBrandProfile } from '../hooks/useBrandProfile';
import { Card } from '@/shared/components/Card';
import { Loading } from '@/shared/components/Loading';
import { TextInput } from '@/shared/components/TextInput';
import { Button } from '@/shared/components/Button';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PencilSquareIcon, CheckIcon, XMarkIcon } from 'react-native-heroicons/outline';

export default function BrandSettingsScreen() {
  const { profile, loading, updateProfile } = useBrandProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local form state
  const [systemPrompt, setSystemPrompt] = useState('');
  const [allowedTopics, setAllowedTopics] = useState('');
  const [avoidTopics, setAvoidTopics] = useState('');
  const [tone, setTone] = useState('');
  const [voiceExamples, setVoiceExamples] = useState<string[]>([]);
  const [newExample, setNewExample] = useState('');

  useEffect(() => {
    if (profile) {
      setSystemPrompt(profile.systemPrompt || '');
      setAllowedTopics((profile.guardrails?.allowedTopics || []).join(', '));
      setAvoidTopics((profile.guardrails?.avoidTopics || []).join(', '));
      setTone(profile.guardrails?.tone || '');
      setVoiceExamples(profile.voiceExamples || []);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      await updateProfile({
        systemPrompt,
        voiceExamples, // Use local list
        guardrails: {
          ...profile.guardrails,
          allowedTopics: allowedTopics.split(',').map(t => t.trim()).filter(t => t),
          avoidTopics: avoidTopics.split(',').map(t => t.trim()).filter(t => t),
          tone
        }
      });
      setIsEditing(false);
      Alert.alert('Success', 'Brand profile updated successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to update brand profile.');
    }
  };

  const handleAddExample = () => {
    if (newExample.trim() && voiceExamples.length < 20) {
      setVoiceExamples([...voiceExamples, newExample.trim()]);
      setNewExample('');
    } else if (voiceExamples.length >= 20) {
      Alert.alert('Limit Reached', 'You can have a maximum of 20 voice examples.');
    }
  };

  const handleDeleteExample = (index: number) => {
    const newList = [...voiceExamples];
    newList.splice(index, 1);
    setVoiceExamples(newList);
  };

  if (loading || !profile) {
    return (
      <View className="flex-1 bg-background-primary justify-center">
        <Loading fullScreen message="Loading settings..." />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <StatusBar barStyle="light-content" />
      <View className="flex-row justify-between items-center px-md pt-lg pb-4">
        <Text className="text-3xl font-display text-text-primary">Settings</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <PencilSquareIcon size={24} color="#1D9BF0" />
          </TouchableOpacity>
        ) : (
          <View className="flex-row">
            <TouchableOpacity onPress={() => setIsEditing(false)} className="mr-4">
              <XMarkIcon size={24} color="#F4212E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <CheckIcon size={24} color="#00D66F" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-md">
        {/* Voice Analysis Summary (New) */}
        {!isEditing && profile.voiceAnalysis && (
          <Animated.View entering={FadeInUp.delay(50)} className="mb-lg">
            <Card className="bg-accent-primary/5 border-accent-primary/20">
              <Text className="text-accent-primary font-bold text-xs uppercase mb-2 tracking-widest">Style Analysis Summary</Text>
              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-3">
                  <Text className="text-text-tertiary text-[10px] uppercase">Tone</Text>
                  <Text className="text-text-primary text-sm font-medium">{profile.voiceAnalysis.tone}</Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-text-tertiary text-[10px] uppercase">Structure</Text>
                  <Text className="text-text-primary text-sm font-medium">{profile.voiceAnalysis.sentenceLength}</Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-text-tertiary text-[10px] uppercase">Vocabulary</Text>
                  <Text className="text-text-primary text-sm font-medium">{profile.voiceAnalysis.vocabulary}</Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-text-tertiary text-[10px] uppercase">Emoji Intensity</Text>
                  <Text className="text-text-primary text-sm font-medium">{profile.voiceAnalysis.emojiUsage || 'N/A'}</Text>
                </View>
              </View>
              <View className="mt-2 pt-2 border-t border-accent-primary/10">
                <Text className="text-text-tertiary text-[10px] uppercase mb-1">Common Hooks</Text>
                <View className="flex-row flex-wrap gap-2">
                  {(profile.voiceAnalysis.hookTypes || []).map((h, i) => (
                    <View key={i} className="px-2 py-1 bg-accent-primary/10 rounded-md">
                      <Text className="text-accent-primary text-[10px] font-bold">{h}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(100)} className="mb-lg">
          <Text className="text-lg font-h3 text-text-secondary mb-2">System Prompt</Text>
          {isEditing ? (
            <TextInput
              multiline
              value={systemPrompt}
              onChangeText={setSystemPrompt}
              placeholder="Enter custom instructions..."
              className="bg-primary-tertiary"
            />
          ) : (
            <Card variant="dimmed" className="bg-primary-tertiary">
              <Text className="text-text-secondary italic font-body">"{profile.systemPrompt}"</Text>
            </Card>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} className="mb-lg">
          <Text className="text-lg font-h3 text-text-secondary mb-2">Guardrails</Text>
          <Card className="bg-primary-tertiary">
            {isEditing ? (
              <View>
                <TextInput
                  label="Allowed Topics"
                  value={allowedTopics}
                  onChangeText={setAllowedTopics}
                  placeholder="Topic 1, Topic 2..."
                />
                <TextInput
                  label="Avoid Topics"
                  value={avoidTopics}
                  onChangeText={setAvoidTopics}
                  placeholder="Political, Controversial..."
                />
                <TextInput
                  label="Tone"
                  value={tone}
                  onChangeText={setTone}
                  placeholder="Professional, Casual..."
                />
              </View>
            ) : (
              <View>
                <View className="mb-4">
                  <Text className="font-bold text-text-primary mb-1">Allowed Topics</Text>
                  <Text className="text-text-secondary">{(profile.guardrails?.allowedTopics || []).join(', ')}</Text>
                </View>
                
                <View className="mb-4">
                  <Text className="font-bold text-text-primary mb-1">Avoid Topics</Text>
                  <Text className="text-text-secondary opacity-80">{(profile.guardrails?.avoidTopics || []).join(', ')}</Text>
                </View>

                <View>
                  <Text className="font-bold text-text-primary mb-1">Tone</Text>
                  <Text className="text-accent font-medium">{profile.guardrails?.tone || 'Not set'}</Text>
                </View>
              </View>
            )}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300)} className="mb-xxl">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-h3 text-text-secondary">Voice Examples</Text>
            <Text className="text-xs text-text-tertiary">{voiceExamples.length}/20</Text>
          </View>

          {isEditing && (
             <View className="mb-4">
               <TextInput
                 multiline
                 value={newExample}
                 onChangeText={setNewExample}
                 placeholder="Paste a great tweet of yours..."
                 className="mb-2"
               />
               <Button
                 title="Add Example"
                 onPress={handleAddExample}
                 disabled={!newExample.trim() || voiceExamples.length >= 20}
                 variant="secondary"
               />
             </View>
          )}

          {(voiceExamples ?? []).map((ex, i) => (
            <Card key={i} className="mb-2 bg-primary-tertiary border-0">
              <View className="flex-row justify-between">
                <Text className="flex-1 text-text-secondary font-body">"{ex}"</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleDeleteExample(i)} className="ml-2">
                    <XMarkIcon size={20} color="#F4212E" />
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
