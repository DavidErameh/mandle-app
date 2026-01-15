import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Tweet } from '../domain/entities/Tweet';
import { Card } from '@/shared/components/Card';
import clsx from 'clsx';
// Standardizing on simple View for dot until Icon set is fully confirmed/imported
// using heroicons if available otherwise fallback
import { CheckCircleIcon, XCircleIcon, ClockIcon, ChatBubbleLeftIcon, ChartBarIcon, SparklesIcon, PaintBrushIcon } from 'react-native-heroicons/solid';

interface TweetCardProps {
  tweet: Tweet;
  onSelect?: (tweet: Tweet) => void;
  onHistoryPress?: (tweet: Tweet) => void;
  onCommentPress?: (tweet: Tweet) => void;
  onPerformancePress?: (tweet: Tweet) => void;
  onExtractPattern?: (tweet: Tweet) => void;
  onPolishPress?: (tweet: Tweet) => void;
  className?: string;
  isSelected?: boolean;
}

export function TweetCard({ 
  tweet, 
  onSelect, 
  onHistoryPress, 
  onCommentPress, 
  onPerformancePress,
  onExtractPattern,
  onPolishPress,
  className, 
  isSelected 
}: TweetCardProps) {
  // Logic to determine variant based on selection or props
  // If isSelected is true, use 'selected'. 
  const variant = isSelected ? 'selected' : 'default';

  return (
    <TouchableOpacity onPress={() => onSelect?.(tweet)} activeOpacity={0.8}>
      <Card variant={variant} className={clsx("mb-4", className)}>
        {/* ... existing header ... */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            {/* Platform Badge */}
            <View className={clsx("px-2 py-0.5 rounded-full border border-border-light bg-frosted-default")}>
               <Text className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">
                 {tweet.platform}
               </Text>
            </View>

            {/* Pattern Badge */}
            {tweet.pattern && (
              <View className="px-2 py-0.5 rounded-full bg-accent-light border border-accent-glow flex-row items-center">
                <Text className="text-[9px] font-bold text-accent-primary uppercase tracking-tighter">
                  Inspired by {tweet.pattern}
                </Text>
              </View>
            )}
          </View>
          
          <View className="flex-row items-center">
             <Text className={clsx(
               "text-xs font-semibold mr-1",
               tweet.withinLimit ? 'text-semantic-success' : 'text-semantic-error'
             )}>
               {tweet.characterCount}/{tweet.platform === 'twitter' ? 280 : 500}
             </Text>
             {tweet.withinLimit ? (
               <CheckCircleIcon size={14} color="#00D66F" />
             ) : (
               <XCircleIcon size={14} color="#F4212E" />
             )}
          </View>
        </View>
        
        {/* Content */}
        <Text className="text-text-primary text-[17px] font-body leading-relaxed mb-4">
          {tweet.content}
        </Text>

        {tweet.inspiredBy && (
          <View className="flex-row items-center bg-accent-light self-start px-2 py-1 rounded-full border border-accent-glow mb-2">
            <Text className="text-accent-primary text-[10px] font-bold uppercase tracking-wider">
              {tweet.inspiredBy}
            </Text>
          </View>
        )}

        {/* Violations Section */}
        {tweet.hasViolations && (
          <View className="mt-4 p-3 bg-semantic-error/10 border border-semantic-error/20 rounded-lg">
            <View className="flex-row items-center mb-1">
              <Text className="text-red-500 font-bold text-xs uppercase tracking-tighter">
                Brand Guardrail Violations:
              </Text>
            </View>
            {tweet.violations.map((v, i) => (
              <Text key={i} className="text-semantic-error/80 text-[11px] font-medium">
                • {v}
              </Text>
            ))}
          </View>
        )}
        
        {/* Footer / Actions */}
        <View className="mt-4 pt-3 border-t border-border-light flex-row justify-between items-center">
           <Text className="text-text-tertiary text-xs italic">
             {tweet.hasViolations ? "⚠ May require manual editing" : (isSelected ? "Ready to post" : "Tap to select")}
           </Text>
           
            <View className="flex-row items-center gap-2">
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  onExtractPattern?.(tweet);
                }}
                className="bg-accent-primary/10 p-2 rounded-lg border border-accent-primary/20"
              >
                <SparklesIcon size={16} color="#1D9BF0" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  onPolishPress?.(tweet);
                }}
                className="bg-semantic-warning/10 p-2 rounded-lg border border-semantic-warning/20"
              >
                <PaintBrushIcon size={16} color="#FFD60A" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  onPerformancePress?.(tweet);
                }}
                className="bg-primary-tertiary p-2 rounded-lg border border-frosted-border"
              >
                <ChartBarIcon size={16} color="#FFFFFF" />
              </TouchableOpacity>

             <TouchableOpacity 
               onPress={(e) => {
                 e.stopPropagation();
                 onCommentPress?.(tweet);
               }}
               className="bg-primary-tertiary p-2 rounded-lg border border-frosted-border"
             >
               <ChatBubbleLeftIcon size={16} color="#FFFFFF" />
             </TouchableOpacity>

             <TouchableOpacity 
               onPress={(e) => {
                 e.stopPropagation();
                 onHistoryPress?.(tweet);
               }}
               className="bg-primary-tertiary p-2 rounded-lg border border-frosted-border"
             >
               <ClockIcon size={16} color="#FFFFFF" />
             </TouchableOpacity>
           </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
