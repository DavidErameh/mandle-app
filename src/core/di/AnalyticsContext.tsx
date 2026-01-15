import React, { createContext, useContext, ReactNode } from 'react';
import { PerformanceRepository } from '@/features/analytics/data/repositories/PerformanceRepository';
import { PatternRepository } from '@/features/analytics/data/repositories/PatternRepository';
import { LogPerformanceUseCase } from '@/features/analytics/domain/useCases/LogPerformanceUseCase';
import { GetPerformanceLogsUseCase } from '@/features/analytics/domain/useCases/GetPerformanceLogsUseCase';
import { ExtractPatternUseCase } from '@/features/analytics/domain/useCases/ExtractPatternUseCase';
import { AIOrchestrator } from '@/core/ai/orchestrator';
import { PatternAnalysisPromptBuilder } from '@/core/ai/prompts/PatternAnalysisPrompt';

// Repositories
const performanceRepo = new PerformanceRepository();
const patternRepo = new PatternRepository();

// Prompt Builders
const patternPromptBuilder = new PatternAnalysisPromptBuilder();

// Use Cases
const aiOrchestrator = new AIOrchestrator();

export const logPerformanceUseCase = new LogPerformanceUseCase(performanceRepo);
export const getPerformanceLogsUseCase = new GetPerformanceLogsUseCase(performanceRepo);
export const extractPatternUseCase = new ExtractPatternUseCase(
  aiOrchestrator,
  patternPromptBuilder,
  patternRepo
);

interface AnalyticsContextType {
  logPerformance: typeof logPerformanceUseCase;
  getPerformanceLogs: typeof getPerformanceLogsUseCase;
  extractPattern: typeof extractPatternUseCase;
  patternRepo: PatternRepository;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AnalyticsContext.Provider value={{
      logPerformance: logPerformanceUseCase,
      getPerformanceLogs: getPerformanceLogsUseCase,
      extractPattern: extractPatternUseCase,
      patternRepo
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
