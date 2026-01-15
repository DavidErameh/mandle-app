import React, { createContext, useContext, ReactNode } from 'react';
import { GetInspirationUseCase } from '@/features/inspiration/domain/useCases/GetInspirationUseCase';
import { ConnectAccountUseCase } from '@/features/inspiration/domain/useCases/ConnectAccountUseCase';
import { InspirationRepository } from '@/features/inspiration/data/repositories/InspirationRepository';
import { GetTopTweetsUseCase } from '@/features/inspiration/domain/useCases/GetTopTweetsUseCase';
import { DisconnectAccountUseCase } from '@/features/inspiration/domain/useCases/DisconnectAccountUseCase';
import { ManualInspirationRepository } from '@/features/inspiration/data/repositories/ManualInspirationRepository';
import { AnalyzeAndRecreateUseCase } from '@/features/inspiration/domain/useCases/AnalyzeAndRecreateUseCase';
import { PatternExtractor } from '@/core/ai/PatternExtractor';
import { AIOrchestrator } from '@/core/ai/orchestrator';
import { BrandProfileRepository } from '@/features/settings/data/repositories/BrandProfileRepository';

interface InspirationContextType {
  getInspirationUseCase: GetInspirationUseCase;
  connectAccountUseCase: ConnectAccountUseCase;
  disconnectAccountUseCase: DisconnectAccountUseCase;
  getTopTweetsUseCase: GetTopTweetsUseCase;
  analyzeAndRecreateUseCase: AnalyzeAndRecreateUseCase;
  manualRepo: ManualInspirationRepository;
}

const InspirationContext = createContext<InspirationContextType | null>(null);

// Initialize Use Cases with Repositories
const inspirationRepo = new InspirationRepository();
const manualInspirationRepo = new ManualInspirationRepository();
const patternExtractor = new PatternExtractor();
const aiOrchestrator = new AIOrchestrator();
const brandProfileRepo = new BrandProfileRepository();

const getInspirationUseCase = new GetInspirationUseCase(inspirationRepo);
const connectAccountUseCase = new ConnectAccountUseCase(inspirationRepo);
const disconnectAccountUseCase = new DisconnectAccountUseCase(inspirationRepo);
const getTopTweetsUseCase = new GetTopTweetsUseCase(inspirationRepo);
const analyzeAndRecreateUseCase = new AnalyzeAndRecreateUseCase(
  manualInspirationRepo,
  patternExtractor,
  aiOrchestrator,
  brandProfileRepo
);

export function InspirationProvider({ children }: { children: ReactNode }) {
  const value = {
    getInspirationUseCase,
    connectAccountUseCase,
    disconnectAccountUseCase,
    getTopTweetsUseCase,
    analyzeAndRecreateUseCase,
    manualRepo: manualInspirationRepo
  };

  return (
    <InspirationContext.Provider value={value}>
      {children}
    </InspirationContext.Provider>
  );
}

export function useInspirationContext() {
  const context = useContext(InspirationContext);
  if (!context) {
    throw new Error('useInspirationContext must be used within an InspirationProvider');
  }
  return context;
}
