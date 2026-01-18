// Type declarations for expo-share-intent
declare module 'expo-share-intent' {
  import { ReactNode } from 'react';

  export interface ShareIntent {
    text?: string;
    webUrl?: string;
    files?: Array<{
      path: string;
      mimeType: string;
      fileName: string;
    }>;
  }

  export interface ShareIntentResult {
    shareIntent: ShareIntent | null;
    hasShareIntent: boolean;
    resetShareIntent: () => void;
    error: Error | null;
    isLoading: boolean;
  }

  export function useShareIntent(): ShareIntentResult;

  export interface ShareIntentProviderProps {
    children: ReactNode;
  }

  export function ShareIntentProvider(props: ShareIntentProviderProps): JSX.Element;
}
