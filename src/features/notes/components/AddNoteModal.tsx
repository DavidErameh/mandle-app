import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { XMarkIcon, PlusIcon, TagIcon, Squares2X2Icon } from 'react-native-heroicons/outline';
import { ContentPillarRepository } from '@/features/generate/data/repositories/ContentPillarRepository';
import { ContentPillar } from '@/features/generate/domain/entities/ContentPillar';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

interface AddNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string, tags: string[], pillarId?: string) => void;
  initialContent?: string;
  initialTags?: string[];
  initialPillarId?: string;
}

const pillarRepo = new ContentPillarRepository();

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ 
  visible, 
  onClose, 
  onSave,
  initialContent = '',
  initialTags = [],
  initialPillarId
}) => {
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedPillarId, setSelectedPillarId] = useState<string | undefined>(initialPillarId);
  const [pillars, setPillars] = useState<ContentPillar[]>([]);

  useEffect(() => {
    if (visible) {
      pillarRepo.getAll().then(setPillars);
      setContent(initialContent);
      setTags(initialTags);
      setSelectedPillarId(initialPillarId);
    }
  }, [visible, initialContent, initialTags, initialPillarId]);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
      setTags([...tags, currentTag.trim().toLowerCase()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim(), tags, selectedPillarId);
      onClose();
    }
  };

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
          className="bg-primary-secondary rounded-t-[40px] border-t border-frosted/10 h-[85%]"
        >
          <BlurView intensity={20} tint="dark" className="flex-1 rounded-t-[40px] overflow-hidden">
            <View className="p-6 flex-1">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-display text-text-primary">New Idea</Text>
                <TouchableOpacity onPress={onClose} className="bg-frosted/10 p-2 rounded-full">
                  <XMarkIcon size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                  
                  {/* Content Input */}
                  <View className="mb-8">
                    <Text className="text-overline text-text-tertiary mb-3 font-medium">What's the idea?</Text>
                    <TextInput
                      multiline
                      placeholder="Write your raw thought here..."
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={content}
                      onChangeText={setContent}
                      className="bg-primary-dark/40 rounded-2xl p-5 text-text-primary text-body min-h-[160px] border border-frosted/5"
                      textAlignVertical="top"
                    />
                  </View>

                  {/* Pillar Selection */}
                  <View className="mb-8">
                    <View className="flex-row items-center gap-2 mb-3">
                      <Squares2X2Icon size={16} color="rgba(255,255,255,0.4)" />
                      <Text className="text-overline text-text-tertiary font-medium">Content Pillar</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                      {pillars.map(pillar => (
                        <TouchableOpacity 
                          key={pillar.id}
                          onPress={() => setSelectedPillarId(pillar.id === selectedPillarId ? undefined : pillar.id)}
                          className={`px-5 py-3 rounded-2xl border ${
                            selectedPillarId === pillar.id 
                              ? 'bg-secondary/20 border-secondary' 
                              : 'bg-primary-dark/40 border-frosted/5'
                          }`}
                        >
                          <Text className={`text-caption font-medium ${
                            selectedPillarId === pillar.id ? 'text-secondary font-bold' : 'text-text-secondary'
                          }`}>
                            {pillar.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Tags */}
                  <View className="mb-8">
                    <View className="flex-row items-center gap-2 mb-3">
                      <TagIcon size={16} color="rgba(255,255,255,0.4)" />
                      <Text className="text-overline text-text-tertiary font-medium">Tags</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-2 mb-4">
                      {tags.map(tag => (
                        <TouchableOpacity 
                          key={tag} 
                          onPress={() => removeTag(tag)}
                          className="bg-secondary/10 px-3 py-1.5 rounded-xl flex-row items-center gap-2 border border-secondary/20"
                        >
                          <Text className="text-caption text-secondary font-medium">#{tag}</Text>
                          <XMarkIcon size={12} color="#1D9BF0" />
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View className="flex-row gap-3">
                      <TextInput
                        placeholder="Add a tag..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={currentTag}
                        onChangeText={setCurrentTag}
                        onSubmitEditing={handleAddTag}
                        className="flex-1 bg-primary-dark/40 rounded-xl px-4 py-3 text-text-primary text-caption border border-frosted/5"
                      />
                      <TouchableOpacity 
                        onPress={handleAddTag}
                        className="bg-frosted/10 w-12 h-12 rounded-xl items-center justify-center border border-frosted/10"
                      >
                        <PlusIcon size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                </KeyboardAvoidingView>
              </ScrollView>

              {/* Action Button */}
              <TouchableOpacity 
                onPress={handleSave}
                disabled={!content.trim()}
                className={`mt-4 h-16 rounded-2xl items-center justify-center shadow-lg ${
                  content.trim() ? 'bg-secondary' : 'bg-frosted/10'
                }`}
              >
                <Text className={`text-lg font-bold ${
                  content.trim() ? 'text-white' : 'text-text-disabled'
                }`}>
                  Save Idea
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
};
