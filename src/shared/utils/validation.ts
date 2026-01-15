export function generateUUID(): string {
  // Simple UUID generator for React Native
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isWithinCharacterRange(text: string, min: number, max: number): boolean {
  return text.length >= min && text.length <= max;
}

// Tweet validation constants
const TWITTER_MAX_LENGTH = 280;
const THREADS_MAX_LENGTH = 500;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates tweet content length for platform
 */
export function validateTweetLength(
  content: string, 
  platform: 'twitter' | 'threads' = 'twitter'
): ValidationResult {
  const maxLength = platform === 'twitter' ? TWITTER_MAX_LENGTH : THREADS_MAX_LENGTH;
  const errors: string[] = [];
  
  if (!content || content.trim().length === 0) {
    errors.push('Content cannot be empty');
  }
  
  if (content.length > maxLength) {
    errors.push(`Content exceeds ${maxLength} character limit (currently ${content.length})`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates Twitter handle format
 */
export function validateTwitterHandle(handle: string): ValidationResult {
  const errors: string[] = [];
  
  // Remove @ if present
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
  
  if (!cleanHandle) {
    errors.push('Handle is required');
  } else if (cleanHandle.length > 15) {
    errors.push('Handle cannot exceed 15 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(cleanHandle)) {
    errors.push('Handle can only contain letters, numbers, and underscores');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validates content pillar data
 */
export function validateContentPillar(pillar: { name?: string; description?: string }): ValidationResult {
  const errors: string[] = [];
  
  if (!pillar.name || pillar.name.trim().length === 0) {
    errors.push('Pillar name is required');
  } else if (pillar.name.length > 50) {
    errors.push('Pillar name cannot exceed 50 characters');
  }
  
  if (!pillar.description || pillar.description.trim().length === 0) {
    errors.push('Pillar description is required');
  } else if (pillar.description.length > 200) {
    errors.push('Pillar description cannot exceed 200 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validates voice example meets minimum quality
 */
export function validateVoiceExample(example: string): ValidationResult {
  const errors: string[] = [];
  
  if (!example || example.trim().length === 0) {
    errors.push('Example cannot be empty');
  } else if (example.length < 20) {
    errors.push('Example should be at least 20 characters');
  } else if (example.length > 500) {
    errors.push('Example cannot exceed 500 characters');
  }
  
  return { valid: errors.length === 0, errors };
}