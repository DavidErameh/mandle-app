import React, { createContext, useContext, ReactNode } from 'react';
import { GenerateTweetUseCase } from '@/features/generate/domain/useCases/GenerateTweetUseCase';
import { PolishTweetUseCase } from '@/features/generate/domain/useCases/PolishTweetUseCase';
import { TweetRepository } from '@/features/generate/data/repositories/TweetRepository';
import { ContentPillarRepository } from '@/features/generate/data/repositories/ContentPillarRepository';
import { AIOrchestrator } from '@/core/ai/orchestrator';
import { ContextBuilder } from '@/core/ai/memory/ContextBuilder';
import { GenerationPromptBuilder } from '@/core/ai/prompts/GenerationPrompt';
import { SystemPromptBuilder } from '@/core/ai/prompts/SystemPromptBuilder';
import { PolishPromptBuilder } from '@/core/ai/prompts/PolishPrompt';
import { PostProcessor } from '@/core/ai/PostProcessor';
import { GuardrailValidator } from '@/core/brand/GuardrailValidator';
import { BrandProfileManager } from '@/core/brand/BrandProfileManager';
import { BrandProfileRepository } from '@/features/settings/data/repositories/BrandProfileRepository';
import { PerformanceRepository } from '@/features/analytics/data/repositories/PerformanceRepository';
import { NoteRepository } from '@/features/notes/data/repositories/NoteRepository';
import { ConnectedAccountRepository } from '@/features/inspiration/data/repositories/ConnectedAccountRepository';
// Removed ThreadPromptBuilder and ExpandToThreadUseCase imports
import { PatternRepository } from '@/features/analytics/data/repositories/PatternRepository';
import { saveVersionUseCase } from './sharedUseCases';

// Initialize Dependencies outside the component to allow for proper exports
const tweetRepo = new TweetRepository();
const pillarRepo = new ContentPillarRepository();

// Initialize Repositories
const brandRepo = new BrandProfileRepository();
const perfRepo = new PerformanceRepository();
const noteRepo = new NoteRepository();
const accountRepo = new ConnectedAccountRepository();
const patternRepo = new PatternRepository();

const contextBuilderInstance = new ContextBuilder(pillarRepo, brandRepo, perfRepo, noteRepo, accountRepo, patternRepo);
const systemPromptBuilder = new SystemPromptBuilder();
const promptBuilder = new GenerationPromptBuilder(systemPromptBuilder);
// Removed threadPromptBuilder
const polishPromptBuilder = new PolishPromptBuilder();
const guardrailValidator = new GuardrailValidator();
const postProcessor = new PostProcessor(guardrailValidator);
const aiOrchestrator = new AIOrchestrator();

export const generateUseCaseInstance = new GenerateTweetUseCase(
  tweetRepo,
  aiOrchestrator,
  contextBuilderInstance,
  promptBuilder,
  postProcessor,
  saveVersionUseCase
);

// Removed expandToThreadUseCaseInstance

export const polishUseCaseInstance = new PolishTweetUseCase(
  aiOrchestrator,
  polishPromptBuilder,
  postProcessor,
  tweetRepo,
  saveVersionUseCase
);

// Define the Interface for the Context
interface GenerateContextType {
  generateUseCase: GenerateTweetUseCase;
  // expandToThreadUseCase removed
  polishUseCase: PolishTweetUseCase;
  contextBuilder: ContextBuilder;
}

// Create Context
const GenerateContext = createContext<GenerateContextType | null>(null);

export function GenerateProvider({ children }: { children: ReactNode }) {
  const value = {
    generateUseCase: generateUseCaseInstance,
    // expandToThreadUseCase removed
    polishUseCase: polishUseCaseInstance,
    contextBuilder: contextBuilderInstance
  };

  return (
    <GenerateContext.Provider value={value}>
      {children}
    </GenerateContext.Provider>
  );
}

// Hook to consume the context
export function useGenerateContext() {
  const context = useContext(GenerateContext);
  if (!context) {
    throw new Error('useGenerateContext must be used within a GenerateProvider');
  }
  return context;
}

// Export use case instances for testing purposes
export {
  generateUseCaseInstance as generateUseCase,
  // expandToThreadUseCaseInstance removed
  polishUseCaseInstance as polishUseCase,
  contextBuilderInstance as contextBuilder
};

