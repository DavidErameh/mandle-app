import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LoggerService } from '@/core/utils/LoggerService';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    LoggerService.fatal('UI_ErrorBoundary', `Uncaught rendering error: ${error.message}`, {
      ...errorInfo,
      stack: error.stack,
    });
  }

  private handleRestart = () => {
    // In a real Expo app, we might use Updates.reloadAsync()
    // For now, we'll just reset state to try re-rendering
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Something went wrong.</Text>
            <Text style={styles.subtitle}>
              Mandle encountered an unexpected error. Don't worry, your data is safe locally.
            </Text>
            
            <ScrollView style={styles.errorBox}>
              <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorBox: {
    maxHeight: 200,
    backgroundColor: 'rgba(244, 33, 46, 0.1)',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 24,
  },
  errorText: {
    color: '#F4212E',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#1D9BF0',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
