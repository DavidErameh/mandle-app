import React, { createContext, useContext, ReactNode } from 'react';
import { NoteRepository } from '@/features/notes/data/repositories/NoteRepository';
import { GetNotesUseCase } from '@/features/notes/domain/useCases/GetNotesUseCase';
import { SaveNoteUseCase } from '@/features/notes/domain/useCases/SaveNoteUseCase';
import { DeleteNoteUseCase } from '@/features/notes/domain/useCases/DeleteNoteUseCase';
import { UpdateNoteStateUseCase } from '@/features/notes/domain/useCases/UpdateNoteStateUseCase';
import { ExpandToThreadUseCase } from '@/features/notes/domain/useCases/ExpandToThreadUseCase';
import { AIOrchestrator } from '@/core/ai/orchestrator';
import { TweetRepository } from '@/features/generate/data/repositories/TweetRepository';
import { ContextBuilder } from '@/core/ai/memory/ContextBuilder';
import { ThreadPromptBuilder } from '@/core/ai/prompts/ThreadPromptBuilder';
import { PostProcessor } from '@/core/ai/PostProcessor';
import { GuardrailValidator } from '@/core/brand/GuardrailValidator';
import { ContentPillarRepository } from '@/features/generate/data/repositories/ContentPillarRepository';
import { BrandProfileRepository } from '@/features/settings/data/repositories/BrandProfileRepository';
import { PerformanceRepository } from '@/features/analytics/data/repositories/PerformanceRepository';
import { ConnectedAccountRepository } from '@/features/inspiration/data/repositories/ConnectedAccountRepository';
import { SystemPromptBuilder } from '@/core/ai/prompts/SystemPromptBuilder';
import { PatternRepository } from '@/features/analytics/data/repositories/PatternRepository';

interface NotesContextType {
  getNotesUseCase: GetNotesUseCase;
  saveNoteUseCase: SaveNoteUseCase;
  deleteNoteUseCase: DeleteNoteUseCase;
  updateNoteStateUseCase: UpdateNoteStateUseCase;
  expandToThreadUseCase: ExpandToThreadUseCase;
  noteRepo: NoteRepository;
}

const NotesContext = createContext<NotesContextType | null>(null);

// Initialize
const noteRepo = new NoteRepository();
const tweetRepo = new TweetRepository();
const aiOrchestrator = new AIOrchestrator();

// Initialize dependencies for ExpandToThreadUseCase
const pillarRepo = new ContentPillarRepository();
const brandRepo = new BrandProfileRepository();
const perfRepo = new PerformanceRepository();
const accountRepo = new ConnectedAccountRepository();
const patternRepo = new PatternRepository();
const contextBuilder = new ContextBuilder(pillarRepo, brandRepo, perfRepo, noteRepo, accountRepo, patternRepo);
const systemPromptBuilder = new SystemPromptBuilder();
const threadPromptBuilder = new ThreadPromptBuilder(systemPromptBuilder);
const guardrailValidator = new GuardrailValidator();
const postProcessor = new PostProcessor(guardrailValidator);

const getNotesUseCase = new GetNotesUseCase(noteRepo);
const saveNoteUseCase = new SaveNoteUseCase(noteRepo);
const deleteNoteUseCase = new DeleteNoteUseCase(noteRepo);
const updateNoteStateUseCase = new UpdateNoteStateUseCase(noteRepo);
const expandToThreadUseCase = new ExpandToThreadUseCase(tweetRepo, aiOrchestrator, contextBuilder, threadPromptBuilder, postProcessor);

export function NotesProvider({ children }: { children: ReactNode }) {
  const value = {
    getNotesUseCase,
    saveNoteUseCase,
    deleteNoteUseCase,
    updateNoteStateUseCase,
    expandToThreadUseCase,
    noteRepo
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotesContext() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
}
