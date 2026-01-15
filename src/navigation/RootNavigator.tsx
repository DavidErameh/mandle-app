import React from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { SparklesIcon, DocumentTextIcon, Cog6ToothIcon, LightBulbIcon, ChartBarIcon } from 'react-native-heroicons/outline';
import { SparklesIcon as SparklesSolid, DocumentTextIcon as DocumentSolid, Cog6ToothIcon as CogSolid, LightBulbIcon as LightBulbSolid, ChartBarIcon as ChartBarSolid } from 'react-native-heroicons/solid';

// Screens
import HomeScreen from '@/features/generate/screens/HomeScreen';
import InspirationScreen from '@/features/inspiration/screens/InspirationScreen';
import NotesScreen from '@/features/notes/screens/NotesScreen';
import ThreadExpandScreen from '@/features/notes/screens/ThreadExpandScreen';
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

// ... (keep Platform import if needed, but remove if unused or imported above)

export default function RootNavigator() {
  const [isOnboarded, setIsOnboarded] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const status = await OnboardingService.isOnboarded();
    setIsOnboarded(status);
  };

  if (isOnboarded === null) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Loading message="Initializing..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="ThreadExpand" component={ThreadExpandScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
