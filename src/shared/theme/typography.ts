import { Platform } from 'react-native';

// Font Family Map
// Note: These require the fonts to be loaded in App.tsx
const fonts = {
  regular: 'CooperOldStyle-Regular',
  medium: 'CooperOldStyle-Medium',
  bold: 'CooperOldStyle-Bold',
};

export const typography = {
  // Display (Rare usage, hero sections)
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontFamily: fonts.bold,
    letterSpacing: -0.5,
  },
  
  // Headings
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: fonts.bold,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fonts.bold,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fonts.medium,
    letterSpacing: 0,
  },
  
  // Body Text
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.regular,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.medium,
    letterSpacing: 0,
  },
  
  // Small Text
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    letterSpacing: 0.1,
  },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  
  // Tweet Text (Special case)
  tweet: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: fonts.regular,
    letterSpacing: 0,
  },
};
