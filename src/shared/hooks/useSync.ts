import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { SyncService } from '@/core/database/sync';
import { LoggerService } from '@/core/utils/LoggerService';

export function useSync() {
  useEffect(() => {
    // 1. Process queue on mount
    SyncService.processQueue();

    // 2. Process queue when connection returns
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        LoggerService.info('useSync', 'Network restored, processing sync queue');
        SyncService.processQueue();
      }
    });

    // 3. Periodic sync every 5 minutes
    const interval = setInterval(() => {
      SyncService.processQueue();
    }, 5 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);
}
