import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { CheckCircleIcon as CheckOutline } from 'react-native-heroicons/outline';
import { Comment } from '../domain/entities/Comment';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
  comment: Comment;
  onResolveToggle: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onResolveToggle }) => {
  const isAssistant = comment.author === 'assistant';

  return (
    <View 
      className={clsx(
        "p-4 rounded-3xl mb-3 border",
        comment.resolved ? "bg-background-tertiary/20 border-border-light opacity-50" : (isAssistant ? "bg-accent-light border-accent-glow" : "bg-background-tertiary border-border-light")
      )}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <View className={clsx(
            "px-2 py-0.5 rounded-full mr-2",
            isAssistant ? "bg-accent-primary" : "bg-text-secondary"
          )}>
            <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
              {comment.author}
            </Text>
          </View>
          <Text className="text-[10px] text-text-tertiary">
            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
          </Text>
        </View>

        <TouchableOpacity onPress={onResolveToggle} className="p-1">
          {comment.resolved ? (
            <CheckCircleIcon size={20} color="#00D66F" />
          ) : (
            <CheckOutline size={20} color="rgba(255,255,255,0.3)" />
          )}
        </TouchableOpacity>
      </View>

      <Text className={clsx(
        "text-sm font-body leading-5",
        comment.resolved ? "text-text-tertiary line-through" : "text-text-secondary"
      )}>
        {comment.content}
      </Text>
    </View>
  );
};
