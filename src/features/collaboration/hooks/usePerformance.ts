import { useState, useCallback } from 'react';
import { useCollaboration } from '@/core/di/CollaborationContext';
import { PerformanceLog, PerformanceLogProps } from '@/features/analytics/domain/entities/PerformanceLog';

export const usePerformance = () => {
  const { logPerformance, getPerformanceLogs } = useCollaboration();
  const [logs, setLogs] = useState<PerformanceLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (minScore?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPerformanceLogs({ minScore });
      setLogs(data);
    } catch (err) {
      setError('Failed to load performance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getPerformanceLogs]);

  const submitLog = async (props: PerformanceLogProps) => {
    setLoading(true);
    try {
      const newLog = await logPerformance(props);
      setLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (err) {
      setError('Failed to save performance metrics');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    error,
    fetchLogs,
    submitLog
  };
};
