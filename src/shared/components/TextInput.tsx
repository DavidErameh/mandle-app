import React from 'react';
import { TextInput as RNTextInput, View, Text, TextInputProps as RNTextInputProps } from 'react-native';
import clsx from 'clsx';
import { colors } from '@/shared/theme/colors';

interface Props extends RNTextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export const TextInput = ({ label, error, className, ...props }: Props) => {
  return (
    <View className={clsx('mb-4', className)}>
      {label && (
        <Text className="text-body text-text-secondary mb-2 font-bodyMedium">{label}</Text>
      )}
      <RNTextInput
        className={clsx(
          'bg-frosted-default border border-frosted-border rounded-md px-4 py-3 text-text-primary font-body text-base',
          error && 'border-semantic-error',
          props.multiline && 'h-32 textAlign-top'
        )}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />
      {error && (
        <Text className="text-semantic-error text-xs mt-1 font-body">{error}</Text>
      )}
    </View>
  );
};
