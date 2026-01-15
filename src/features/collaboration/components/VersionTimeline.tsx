import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Version } from '../domain/entities/Version';
import { ClockIcon, UserIcon, CommandLineIcon, ArrowUturnLeftIcon } from 'react-native-heroicons/outline';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface VersionTimelineProps {
  versions: Version[];
  onRestore: (version: Version) => void;
  currentContent: string;
}

export const VersionTimeline: React.FC<VersionTimelineProps> = ({ versions, onRestore, currentContent }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      {versions.map((v, index) => (
        <Animated.View 
          key={v.id} 
          entering={FadeInRight.delay(index * 100)}
          className="flex-row gap-4 mb-6"
        >
          {/* Timeline Line */}
          <View className="items-center">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${
              v.author === 'assistant' ? 'bg-secondary/20' : 'bg-primary-tertiary'
            }`}>
              {v.author === 'assistant' ? (
                <CommandLineIcon size={16} color="#1D9BF0" />
              ) : (
                <UserIcon size={16} color="#FFFFFF" />
              )}
            </View>
            {index !== versions.length - 1 && (
              <View className="w-[2px] flex-1 bg-frosted/10 my-2" />
            )}
          </View>

          {/* Content Card */}
          <View className="flex-1 bg-primary-dark/40 rounded-2xl p-4 border border-frosted/5">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-overline text-text-tertiary uppercase tracking-widest font-bold">
                  {v.author} • {v.changeType}
                </Text>
                {v.content === currentContent && (
                  <View className="bg-success/20 px-2 py-0.5 rounded-full">
                    <Text className="text-[8px] text-success font-bold">CURRENT</Text>
                  </View>
                )}
              </View>
              <Text className="text-[10px] text-text-tertiary">
                {v.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <Text className="text-caption text-text-secondary leading-5 mb-4 italic">
              "{v.content}"
            </Text>

            {v.content !== currentContent && (
              <TouchableOpacity 
                onPress={() => onRestore(v)}
                className="flex-row items-center gap-1.5 self-end px-3 py-1.5 bg-frosted/10 rounded-lg"
              >
                <ArrowUturnLeftIcon size={14} color="#FFFFFF" />
                <Text className="text-[10px] text-text-primary font-bold uppercase">Restore</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      ))}

      {versions.length === 0 && (
        <View className="items-center pt-10">
          <ClockIcon size={40} color="rgba(255,255,255,0.1)" />
          <Text className="text-text-tertiary mt-4 text-center">No history yet. Start editing to create versions!</Text>
        </View>
      )}
    </ScrollView>
  );
};
