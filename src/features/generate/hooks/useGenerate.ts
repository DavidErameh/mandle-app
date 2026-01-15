import { useState, useCallback, useEffect } from 'react';
import { Tweet } from '../domain/entities/Tweet';
import { useGenerateContext } from '@/core/di/GenerateContext';
import { BrandProfileManager } from '@/core/brand/BrandProfileManager'; // Stub
import { AppError } from '@/shared/utils/errors';

// Temporary repo access for profile until we move Profile to Context too
const brandRepo = { getProfile: async () => new BrandProfileManager().getActiveProfile() } as any;

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [poolSize, setPoolSize] = useState<number>(0);
  const [platform, setPlatform] = useState<'twitter' | 'threads'>('twitter');
  
  // Consume dependencies from Context
  const { generateUseCase, contextBuilder } = useGenerateContext();

  const refreshPool = useCallback(async () => {
    try {
      const size = await contextBuilder.getPoolSize();
      setPoolSize(size);
    } catch (e) {
      console.error('Failed to fetch pool size:', e);
    }
  }, [contextBuilder]);

  useEffect(() => {
    refreshPool();
  }, [refreshPool]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch profile (normally cached/context)
      const profile = await brandRepo.getProfile();
      
      const results = await generateUseCase.execute(profile, platform);
      setTweets(results);
      // Refresh pool size after generation might change note states
      refreshPool();
    } catch (err) {
      console.error(err);
      if (err instanceof AppError) {
        setError(err.message);
      } else {
        setError('Failed to generate tweets. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [generateUseCase, refreshPool, platform]); 

  return { generate, loading, error, tweets, poolSize, refreshPool, platform, setPlatform };
}
