import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const AnimationConfig = {
  // Timing
  fast: 200,
  medium: 300,
  slow: 500,

  // Easings
  easing: {
    standard: Easing.bezier(0.4, 0.0, 0.2, 1),
    decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
    accelerate: Easing.bezier(0.4, 0.0, 1, 1),
  },

  // Spring defaults
  spring: {
    damping: 15,
    stiffness: 120,
    mass: 0.7,
  },
};

// Re-export specific presets if needed, but Reanimated's FadeInUp is usually sufficient.
// This file serves as a config centralization.
