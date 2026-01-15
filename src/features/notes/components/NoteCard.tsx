import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Note } from '../domain/entities/Note';
import { TrashIcon, CheckCircleIcon, ArrowPathIcon } from 'react-native-heroicons/outline';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

interface NoteCardProps {
  note: Note;
  onMarkReady?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPress?: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onMarkReady, onDelete, onPress }) => {
  const getStatusColor = () => {
    switch (note.state) {
      case 'ready': return 'text-secondary';
      case 'generated': return 'text-success';
      case 'posted': return 'text-text-tertiary';
      case 'archived': return 'text-text-disabled';
      default: return 'text-text-secondary';
    }
  };

  const getStatusBg = () => {
    switch (note.state) {
      case 'ready': return 'bg-secondary/10';
      case 'generated': return 'bg-success/10';
      case 'posted': return 'bg-white/5';
      case 'archived': return 'bg-white/5';
      default: return 'bg-white/5';
    }
  };

  return (
    <Animated.View 
      entering={FadeIn}
      layout={Layout.springify()}
      className="mb-4 bg-primary-dark/40 rounded-2xl border border-frosted/10 overflow-hidden"
    >
      <TouchableOpacity 
        onPress={() => onPress?.(note)}
        disabled={!onPress}
        activeOpacity={0.7}
        className="p-5"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className={`${getStatusBg()} px-2.5 py-1 rounded-full`}>
            <Text className={`text-[10px] font-bold uppercase tracking-wider ${getStatusColor()}`}>
              {note.state}
            </Text>
          </View>
          <Text className="text-caption text-text-tertiary">
            {new Date(note.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text className="text-body text-text-primary mb-4 leading-relaxed" numberOfLines={4}>
          {note.content}
        </Text>

        {note.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {note.tags.map((tag, idx) => (
              <View key={idx} className="bg-frosted/5 px-2 py-0.5 rounded-lg border border-frosted/5">
                <Text className="text-[11px] text-text-secondary">#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between pt-4 border-t border-frosted/5">
          <View className="flex-row items-center gap-4">
            {note.state === 'draft' && (
              <TouchableOpacity 
                onPress={() => onMarkReady?.(note.id)}
                className="flex-row items-center gap-1.5"
              >
                <CheckCircleIcon size={18} color="#1D9BF0" />
                <Text className="text-caption text-secondary font-medium">Mark Ready</Text>
              </TouchableOpacity>
            )}
            {note.state === 'generated' && (
              <View className="flex-row items-center gap-1.5">
                <ArrowPathIcon size={16} color="#00D66F" />
                <Text className="text-caption text-success">Generated</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            onPress={() => onDelete?.(note.id)}
            className="p-1"
          >
            <TrashIcon size={18} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
