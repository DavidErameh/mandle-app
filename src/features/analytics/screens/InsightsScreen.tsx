import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBarIcon, SparklesIcon, TrashIcon, ArrowPathIcon } from 'react-native-heroicons/outline';
import { useAnalytics } from '@/core/di/AnalyticsContext';
import { ViralPattern } from '../domain/entities/ViralPattern';
import { colors } from '@/shared/theme/colors';
import { typography } from '@/shared/theme/typography';
import { Loading } from '@/shared/components/Loading';

export default function InsightsScreen() {
  const { patternRepo, extractPattern, getPerformanceLogs } = useAnalytics();
  const [patterns, setPatterns] = useState<ViralPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchPatterns = async () => {
    try {
      const data = await patternRepo.getAll();
      setPatterns(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatterns();
  }, []);

  const handleAnalyzeSuccesses = async () => {
    setAnalyzing(true);
    try {
      const highPerformers = await getPerformanceLogs.execute({ minScore: 7 });
      if (highPerformers.length === 0) {
        Alert.alert('No successes', 'You haven\'t logged any high-performing tweets yet (score > 7).');
        return;
      }

      // Analyze the most recent high performer that hasn't been analyzed perhaps?
      // For MVP, just analyze the top one for now to demonstrate
      const target = highPerformers[0];
      await extractPattern.execute(target.content, target.id);
      
      Alert.alert('Success', 'New pattern extracted from your top performance!');
      fetchPatterns();
    } catch (error) {
      Alert.alert('Error', 'Failed to extract patterns. Try again later.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await patternRepo.delete(id);
      fetchPatterns();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete pattern.');
    }
  };

  if (loading) return <Loading />;

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-border-light">
        <Text style={typography.h2} className="text-white">Insights</Text>
        <TouchableOpacity 
          onPress={handleAnalyzeSuccesses}
          disabled={analyzing}
          className="bg-accent-primary p-2 rounded-full"
        >
          {analyzing ? (
            <ArrowPathIcon size={20} color="white" />
          ) : (
            <SparklesIcon size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPatterns} tintColor="white" />}
      >
        <View className="py-6">
          <Text style={typography.caption} className="text-text-secondary uppercase mb-4">Winning DNA Patterns</Text>
          
          {patterns.length === 0 ? (
            <View className="bg-background-tertiary p-8 rounded-xl items-center border border-border-default border-dashed">
              <ChartBarIcon size={48} color={colors.text.tertiary} />
              <Text style={typography.body} className="text-text-secondary text-center mt-4">
                No patterns extracted yet. Log some high-performing tweets and tap the sparkles to analyze them.
              </Text>
            </View>
          ) : (
            patterns.map((pattern) => (
              <View key={pattern.id} className="bg-background-tertiary p-5 rounded-xl mb-4 border border-border-default">
                <View className="flex-row justify-between items-start mb-2">
                  <Text style={typography.bodyMedium} className="text-white flex-1">{pattern.name}</Text>
                  <TouchableOpacity onPress={() => handleDelete(pattern.id)}>
                    <TrashIcon size={18} color={colors.error.primary} />
                  </TouchableOpacity>
                </View>
                
                <Text style={typography.caption} className="text-text-secondary mb-3">
                  {pattern.description}
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  <Badge label={pattern.hookType} color={colors.accent.primary} />
                  <Badge label={pattern.structure} color={colors.success.primary} />
                  <Badge label={pattern.emotion} color={colors.warning.primary} />
                  <View className="flex-1" />
                  <Text style={typography.overline} className="text-text-tertiary self-end">
                    Intensity: {pattern.intensity}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View className="pb-10">
          <Text style={typography.caption} className="text-text-secondary uppercase mb-4">How it works</Text>
          <Text style={typography.caption} className="text-text-tertiary">
            Mandle uses AI to deconstruct your most successful tweets into reproducible patterns. These patterns are automatically fed back into the generation engine to repeat what works.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View 
      style={{ backgroundColor: color + '20', borderColor: color + '40' }} 
      className="px-2 py-1 rounded-md border"
    >
      <Text style={[typography.overline, { color }]} className="font-bold">{label}</Text>
    </View>
  );
}
