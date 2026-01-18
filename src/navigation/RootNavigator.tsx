
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { ShareIntentProvider } from 'expo-share-intent';
import { SparklesIcon, DocumentTextIcon, Cog6ToothIcon, LightBulbIcon, ChartBarIcon } from 'react-native-heroicons/outline';
import { SparklesIcon as SparklesSolid, DocumentTextIcon as DocumentSolid, Cog6ToothIcon as CogSolid, LightBulbIcon as LightBulbSolid, ChartBarIcon as ChartBarSolid } from 'react-native-heroicons/solid';

import { GenerateProvider } from '@/core/di/GenerateContext';
import { InspirationProvider } from '@/core/di/InspirationContext';
import { NotesProvider } from '@/core/di/NotesContext';
import { CollaborationProvider } from '@/core/di/CollaborationContext';
import { AnalyticsProvider } from '@/core/di/AnalyticsContext';

// Screens
import HomeScreen from '@/features/generate/screens/HomeScreen';
import InspirationScreen from '@/features/inspiration/screens/InspirationScreen';
import ShareHandler from '@/features/inspiration/screens/ShareHandler';
import NotesScreen from '@/features/notes/screens/NotesScreen';
// import ThreadExpandScreen removed
import BrandSettingsScreen from '@/features/settings/screens/BrandSettingsScreen';
import InsightsScreen from '@/features/analytics/screens/InsightsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 70,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={30} style={{ flex: 1, backgroundColor: 'rgba(10,10,10,0.7)' }} />
        ),
        tabBarActiveTintColor: '#1D9BF0',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'CooperOldStyle-Medium',
          marginTop: -5,
          marginBottom: 5,
        }
      }}
    >
      <Tab.Screen 
        name="Generate" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <SparklesSolid size={24} color={color} /> : <SparklesIcon size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Notes" 
        component={NotesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <DocumentSolid size={24} color={color} /> : <DocumentTextIcon size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Inspiration" 
        component={InspirationScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <LightBulbSolid size={24} color={color} /> : <LightBulbIcon size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <ChartBarSolid size={24} color={color} /> : <ChartBarIcon size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={BrandSettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <CogSolid size={24} color={color} /> : <Cog6ToothIcon size={24} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

import { OnboardingService } from '@/core/settings/OnboardingService';
import OnboardingNavigator from '@/features/onboarding/navigation/OnboardingNavigator';
import { Loading } from '@/shared/components/Loading';
import { SyncService } from '@/core/database/sync';

// ... (keep Platform import if needed, but remove if unused or imported above)

export default function RootNavigator() {
  const [isOnboarded, setIsOnboarded] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    checkOnboarding();
  }, []);

  // Process sync queue - deferred to ensure navigation context is ready
  React.useEffect(() => {
    // Slight delay to ensure navigation is fully mounted before sync operations
    const timer = setTimeout(() => {
      SyncService.processQueue();
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);

  const checkOnboarding = async () => {
    const status = await OnboardingService.isOnboarded();
    setIsOnboarded(status);
  };

  // Wrap everything in ShareIntentProvider and other providers (NavigationContainer is now in App.tsx)
  return (
    <ShareIntentProvider>
      <AnalyticsProvider>
        <GenerateProvider>
          <InspirationProvider>
            <NotesProvider>
              <CollaborationProvider>
                <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
                  {isOnboarded === null ? (
                    <Stack.Screen name="Loading">
                      {() => <View className="flex-1 bg-background-primary justify-center items-center"><Loading message="Initializing..." /></View>}
                    </Stack.Screen>
                  ) : !isOnboarded ? (
                    <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
                  ) : (
                    <>
                      <Stack.Screen name="Main" component={TabNavigator} />
                      {/* ThreadExpand route removed */}
                      <Stack.Screen 
                        name="ShareHandler" 
                        component={ShareHandler}
                        options={{ presentation: 'modal' }}
                      />
                    </>
                  )}
                </Stack.Navigator>
              </CollaborationProvider>
            </NotesProvider>
          </InspirationProvider>
        </GenerateProvider>
      </AnalyticsProvider>
    </ShareIntentProvider>
  );
}
