/**
 * Crypto polyfill for React Native
 * Required by Supabase and UUID generation
 * MUST be imported before any other imports in App.tsx
 */

// This polyfill adds crypto.getRandomValues to the global scope
import 'react-native-get-random-values';
