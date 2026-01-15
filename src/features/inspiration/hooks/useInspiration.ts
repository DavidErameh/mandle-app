import { useState, useCallback, useEffect } from 'react';
import { useInspirationContext } from '@/core/di/InspirationContext';
import { Inspiration } from '../domain/entities/Inspiration';
import { ManualInspiration } from '../data/repositories/ManualInspirationRepository';

export function useInspiration() {
  const { 
    getInspirationUseCase, 
    connectAccountUseCase, 
    disconnectAccountUseCase,
    getTopTweetsUseCase,
    analyzeAndRecreateUseCase,
    manualRepo
  } = useInspirationContext();
  
  const [accounts, setAccounts] = useState<Inspiration[]>([]);
  const [manualInspirations, setManualInspirations] = useState<ManualInspiration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getInspirationUseCase.execute();
      setAccounts(result);
    } catch (e) {
      setError('Failed to fetch inspiration');
    } finally {
      setLoading(false);
    }
  }, [getInspirationUseCase]);

  const fetchManualInspirations = useCallback(async () => {
    const results = await manualRepo.getAll();
    setManualInspirations(results);
  }, [manualRepo]);

  const connectAccount = useCallback(async (platform: string, handle: string) => {
    setLoading(true);
    setError(null);
    try {
      const newAccount = await connectAccountUseCase.execute(platform, handle);
      setAccounts(prev => [...prev, newAccount]);
    } catch (e: any) {
      setError(e.message || 'Failed to connect account');
    } finally {
      setLoading(false);
    }
  }, [connectAccountUseCase]);

  const disconnectAccount = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await disconnectAccountUseCase.execute(id);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    } catch (e) {
      setError('Failed to disconnect account');
    } finally {
      setLoading(false);
    }
  }, [disconnectAccountUseCase]);

  const getTopTweets = useCallback(async (accountId: string) => {
    try {
      return await getTopTweetsUseCase.execute(accountId);
    } catch (e) {
      console.error('Failed to fetch top tweets:', e);
      return [];
    }
  }, [getTopTweetsUseCase]);

  const analyzeUrl = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeAndRecreateUseCase.execute(url);
      setManualInspirations(prev => [result, ...prev]);
      return result;
    } catch (e: any) {
      setError(e.message || 'Failed to analyze URL');
      return null;
    } finally {
      setLoading(false);
    }
  }, [analyzeAndRecreateUseCase]);

  const deleteManualInspiration = useCallback(async (id: string) => {
    try {
      await manualRepo.delete(id);
      setManualInspirations(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      setError('Failed to delete inspiration');
    }
  }, [manualRepo]);

  useEffect(() => {
    fetchAccounts();
    fetchManualInspirations();
  }, [fetchAccounts, fetchManualInspirations]);

  return {
    accounts,
    manualInspirations,
    loading,
    error,
    fetchAccounts,
    connectAccount,
    disconnectAccount,
    getTopTweets,
    analyzeUrl,
    deleteManualInspiration
  };
}
