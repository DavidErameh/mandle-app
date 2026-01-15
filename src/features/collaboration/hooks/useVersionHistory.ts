import { useState, useCallback } from 'react';
import { Version } from '../domain/entities/Version';
import { useCollaboration } from '@/core/di/CollaborationContext';

export function useVersionHistory(draftId: string) {
  const {
    getVersionHistory,
    saveVersion,
    restoreVersion
  } = useCollaboration();

  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const history = await getVersionHistory(draftId);
      setVersions(history);
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoading(false);
    }
  }, [draftId, getVersionHistory]);

  const recordEdit = async (content: string, author: 'creator' | 'assistant' = 'creator') => {
    try {
      await saveVersion({
        draftId,
        content,
        author,
        changeType: author === 'assistant' ? 'generated' : 'edited'
      });
      await fetchHistory();
    } catch (e) {
      console.error('Failed to record version:', e);
    }
  };

  const restore = async (version: Version) => {
    setLoading(true);
    try {
      await restoreVersion(version);
      await fetchHistory();
    } catch (e) {
      console.error('Failed to restore version:', e);
    } finally {
      setLoading(false);
    }
  };

  return { versions, loading, fetchHistory, recordEdit, restore };
}
