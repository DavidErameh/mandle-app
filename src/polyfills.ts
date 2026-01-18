/**
 * Crypto polyfill for React Native
 * Required by Supabase and UUID generation
 * MUST be imported before any other imports in App.tsx
 */

// This polyfill adds crypto.getRandomValues to the global scope
import 'react-native-get-random-values';

// Add crypto.randomUUID polyfill if not available
// @ts-ignore - crypto is added by polyfill
if (typeof global.crypto === 'undefined') {
  // @ts-ignore
  global.crypto = {} as Crypto;
}

// @ts-ignore - checking crypto.randomUUID
if (typeof global.crypto.randomUUID === 'undefined') {
  // Polyfill randomUUID using getRandomValues
  // @ts-ignore - adding randomUUID to crypto
  global.crypto.randomUUID = function(): string {
    const bytes = new Uint8Array(16);
    // @ts-ignore - getRandomValues is added by polyfill
    global.crypto.getRandomValues(bytes);
    
    // Set version (4) and variant (8, 9, A, or B)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };
}
