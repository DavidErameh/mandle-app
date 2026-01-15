import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import PillarSetupScreen from '../screens/PillarSetupScreen';
import SystemPromptScreen from '../screens/SystemPromptScreen';
import GuardrailsScreen from '../screens/GuardrailsScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PillarSetup" component={PillarSetupScreen} />
      <Stack.Screen name="SystemPrompt" component={SystemPromptScreen} />
      <Stack.Screen name="Guardrails" component={GuardrailsScreen} />
    </Stack.Navigator>
  );
}
