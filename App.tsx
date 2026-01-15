// Polyfills must be imported first
import './src/polyfills';

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { useFonts } from 'expo-font';

import { GenerateProvider } from '@/core/di/GenerateContext';
import { InspirationProvider } from '@/core/di/InspirationContext';
import { NotesProvider } from '@/core/di/NotesContext';
import { CollaborationProvider } from '@/core/di/CollaborationContext';
import { AnalyticsProvider } from '@/core/di/AnalyticsContext';
import { useSync } from '@/shared/hooks/useSync';
import { SQLiteService } from '@/core/database/sqlite';

import { Loading } from '@/shared/components/Loading';
import { AppErrorBoundary } from '@/shared/components/AppErrorBoundary';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const [fontsLoaded, fontError] = useFonts({
    'CooperOldStyle-Regular': require('./assets/fonts/CooperOldStyle-Regular.otf'),
    'CooperOldStyle-Medium': require('./assets/fonts/CooperOldStyle-Medium.otf'),
    'CooperOldStyle-Bold': require('./assets/fonts/CooperOldStyle-Bold.otf'),
  });

  // Initialize SQLite on app startup
  useEffect(() => {
    async function initDB() {
      try {
        await SQLiteService.init();
        setDbReady(true);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError(String(error));
        // Still allow app to run, just without local persistence
        setDbReady(true);
      }
    }
    initDB();
  }, []);

  useSync();

  // Show loading while fonts or database are initializing
  if (!fontsLoaded && !fontError) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-background-primary justify-center items-center">
          <Loading message="Loading assets..." />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!dbReady) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-background-primary justify-center items-center">
          <Loading message="Initializing database..." />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <AnalyticsProvider>
          <GenerateProvider>
            <InspirationProvider>
              <NotesProvider>
                <CollaborationProvider>
                  <RootNavigator />
                </CollaborationProvider>
              </NotesProvider>
            </InspirationProvider>
          </GenerateProvider>
        </AnalyticsProvider>
      </AppErrorBoundary>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

