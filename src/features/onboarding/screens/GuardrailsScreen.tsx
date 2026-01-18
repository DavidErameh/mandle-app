import React, { useState } from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/shared/components/Button';
import { OnboardingService } from '@/core/settings/OnboardingService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ContentPillarRepository } from '@/features/generate/data/repositories/ContentPillarRepository';
import { BrandProfileRepository } from '@/features/settings/data/repositories/BrandProfileRepository';
import { colors } from '@/shared/theme/colors';

// Repos
const pillarRepo = new ContentPillarRepository();
const brandRepo = new BrandProfileRepository();

export default function GuardrailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pillars, systemPrompt } = route.params || {};

  const [avoidPolitics, setAvoidPolitics] = useState(true);
  const [avoidControversy, setAvoidControversy] = useState(true);
  const [limitEmojis, setLimitEmojis] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
     setLoading(true);
     try {
       // 1. Save Pillars
       if (pillars && pillars.length > 0) {
         await pillarRepo.saveAll(pillars);
       }
       
       // 2. Save Brand Profile (id will be auto-generated as UUID by repository)
       const profile = { 
         systemPrompt: systemPrompt || 'You are an helpful AI assistant.', // Default fallback
         guardrails: {
           allowedTopics: pillars?.map((p: any) => p.name) || [],
           avoidTopics: [
             avoidPolitics ? 'Politics' : '',
             avoidControversy ? 'Controversy' : ''
           ].filter(Boolean),
           tone: 'Professional',
           maxHashtags: 2,
           characterRange: [50, 280] as [number, number]
         },
         voiceExamples: []
       };

       await brandRepo.saveProfile(profile);

       // 3. Complete Onboarding
       await OnboardingService.completeOnboarding();
       
       // Note: RootNavigator logic will need a state update or app reload to see this change.
       // In a real device, hot reload might not trigger it, but a fresh launch will.
       console.log('Onboarding complete.');
       
     } catch (e) {
       console.error(e);
     } finally {
       setLoading(false);
     }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="flex-1 px-lg pt-lg">
        <Text className="text-h2 font-display text-text-primary mb-2">Guardrails</Text>
        <Text className="text-body text-text-secondary mb-lg">
          Set boundaries for your content safety.
        </Text>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
           <View className="bg-frosted-default rounded-lg border border-frosted-border p-4 mb-4">
             <View className="flex-row justify-between items-center mb-4">
               <Text className="text-body font-bodyMedium text-text-primary">Avoid Politics</Text>
               <Switch 
                 value={avoidPolitics} 
                 onValueChange={setAvoidPolitics}
                 trackColor={{ false: '#767577', true: colors.accent.primary }}
               />
             </View>
             <View className="w-full h-[1px] bg-frosted-border mb-4" />
             <View className="flex-row justify-between items-center mb-4">
               <Text className="text-body font-bodyMedium text-text-primary">Avoid Controversy</Text>
               <Switch 
                 value={avoidControversy} 
                 onValueChange={setAvoidControversy}
                 trackColor={{ false: '#767577', true: colors.accent.primary }}
               />
             </View>
             <View className="w-full h-[1px] bg-frosted-border mb-4" />
              <View className="flex-row justify-between items-center">
               <Text className="text-body font-bodyMedium text-text-primary">Limit Emojis (Max 1)</Text>
               <Switch 
                 value={limitEmojis} 
                 onValueChange={setLimitEmojis}
                 trackColor={{ false: '#767577', true: colors.accent.primary }}
               />
             </View>
           </View>
        </ScrollView>

        <View className="py-md">
          <Button 
            title="Finish Setup" 
            onPress={handleFinish}
            loading={loading}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
