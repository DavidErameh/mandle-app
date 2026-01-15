import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '@/shared/components/Button';
import { TextInput } from '@/shared/components/TextInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import clsx from 'clsx';
import { colors } from '@/shared/theme/colors';

const PROMPT_TEMPLATES = [
  {
    id: 'ghostwriter',
    label: 'Ghostwriter',
    text: 'You are an expert ghostwriter. Write punchy, engaging tweets that educate and inspire. Avoid hashtags and emojis unless necessary. Use short sentences.'
  },
  {
    id: 'storyteller',
    label: 'Storyteller',
    text: 'You are a master storyteller. Start with a hook that creates a curiosity gap. Use narrative structures to convey value. End with a reflective takeaway.'
  },
  {
    id: 'professional',
    label: 'Professional',
    text: 'You are a thought leader in your industry. Write authoritative, data-backed content. Maintain a professional yet accessible tone. Avoid slang.'
  }
];

export default function SystemPromptScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pillars } = route.params || {};
  
  const [prompt, setPrompt] = useState(PROMPT_TEMPLATES[0].text);

  const handleNext = () => {
    navigation.navigate('Guardrails', { pillars, systemPrompt: prompt });
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 px-lg pt-lg">
        <Text className="text-h2 font-display text-text-primary mb-2">System Prompt</Text>
        <Text className="text-body text-text-secondary mb-lg">
          Tell the AI how to write. Choose a template or write your own.
        </Text>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
           <View className="flex-row gap-2 mb-4 flex-wrap">
             {PROMPT_TEMPLATES.map(t => (
               <TouchableOpacity 
                 key={t.id}
                 onPress={() => setPrompt(t.text)}
                 className={clsx(
                   "px-3 py-2 rounded-full border",
                   prompt === t.text 
                     ? "bg-accent-primary border-accent-primary" 
                     : "bg-frosted-default border-frosted-border"
                 )}
               >
                 <Text className={clsx(
                   "text-caption font-bodyMedium",
                   prompt === t.text ? "text-white" : "text-text-secondary"
                 )}>
                   {t.label}
                 </Text>
               </TouchableOpacity>
             ))}
           </View>

           <TextInput 
             label="Instructions for AI"
             value={prompt}
             onChangeText={setPrompt}
             multiline
             className="h-64"
             style={{ textAlignVertical: 'top' }} // Android fix
           />
        </ScrollView>

        <View className="py-md">
          <Button 
            title="Next Step" 
            onPress={handleNext}
            variant="primary"
            disabled={prompt.length < 10}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
