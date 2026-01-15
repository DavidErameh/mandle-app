/**
 * E2E Test: Tweet Generation Flow
 * 
 * This test simulates the complete user journey of generating a tweet using the Mandle app:
 * 1. User opens the app
 * 2. Navigates to the Generate tab
 * 3. Clicks the "Generate Content" button
 * 4. Waits for tweets to be generated
 * 5. Selects a tweet
 * 6. Copies the tweet to clipboard
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '../features/generate/screens/HomeScreen';
import { GenerateProvider } from '../core/di/GenerateContext';

// Mock all external dependencies to focus on the user journey
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));
jest.mock('../shared/hooks/useSync', () => ({
  useSync: () => {},
}));
jest.mock('../shared/hooks/useOnline', () => ({
  useOnline: () => true,
}));
jest.mock('../core/di/GenerateContext', () => ({
  ...jest.requireActual('../core/di/GenerateContext'),
  useGenerate: () => ({
    generate: jest.fn(),
    loading: false,
    error: null,
    tweets: [
      { id: '1', content: 'This is a generated tweet', platform: 'twitter', variant: 1 },
      { id: '2', content: 'Another generated tweet', platform: 'twitter', variant: 2 },
      { id: '3', content: 'Yet another generated tweet', platform: 'twitter', variant: 3 }
    ],
    poolSize: 5,
    platform: 'twitter',
    setPlatform: jest.fn(),
  }),
}));

describe('Tweet Generation E2E Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete the full tweet generation journey', async () => {
    // Render the HomeScreen (Generate tab content)
    render(
      <SafeAreaProvider>
        <NavigationContainer>
          <GenerateProvider>
            <HomeScreen />
          </GenerateProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    );

    // Step 1: Verify the app loads correctly
    expect(screen.getByText('Mandle')).toBeTruthy();
    expect(screen.getByText('Refining your voice.')).toBeTruthy();

    // Step 2: Find and click the Generate Content button
    const generateButton = screen.getByText('Generate Content');
    expect(generateButton).toBeTruthy();
    
    fireEvent.press(generateButton);
    
    // Step 3: Wait for tweets to appear (simulated with mock data)
    await waitFor(() => {
      expect(screen.getByText('This is a generated tweet')).toBeTruthy();
      expect(screen.getByText('Another generated tweet')).toBeTruthy();
      expect(screen.getByText('Yet another generated tweet')).toBeTruthy();
    });

    // Step 4: Select a tweet (click on the first one)
    const firstTweetElement = screen.getByText('This is a generated tweet');
    fireEvent.press(firstTweetElement);

    // Step 5: Verify the copy button appears and click it
    const copyButton = await screen.findByText('Copy and Post');
    expect(copyButton).toBeTruthy();
    
    fireEvent.press(copyButton);

    // Step 6: Verify success message appears
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeTruthy();
      expect(screen.getByText('Tweet copied to clipboard!')).toBeTruthy();
    });

    // All steps completed successfully
    expect(true).toBe(true);
  });

  it('should handle error state gracefully', async () => {
    // Re-render with error state
    jest.mock('../core/di/GenerateContext', () => ({
      useGenerate: () => ({
        generate: jest.fn(),
        loading: false,
        error: 'Failed to generate tweets. Please try again.',
        tweets: [],
        poolSize: 0,
        platform: 'twitter',
        setPlatform: jest.fn(),
      }),
    }));

    render(
      <SafeAreaProvider>
        <NavigationContainer>
          <GenerateProvider>
            <HomeScreen />
          </GenerateProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    );

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to generate tweets. Please try again.')).toBeTruthy();
    });
  });
});