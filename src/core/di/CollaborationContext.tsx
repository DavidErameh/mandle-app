import React, { createContext, useContext } from 'react';
import { VersionRepository } from '@/features/collaboration/data/repositories/VersionRepository';
import { TweetRepository } from '@/features/generate/data/repositories/TweetRepository';
import { GetVersionHistoryUseCase } from '@/features/collaboration/domain/useCases/GetVersionHistoryUseCase';
import { SaveVersionUseCase } from '@/features/collaboration/domain/useCases/SaveVersionUseCase';
import { RestoreVersionUseCase } from '@/features/collaboration/domain/useCases/RestoreVersionUseCase';
import { CommentRepository } from '@/features/collaboration/data/repositories/CommentRepository';
import { AddCommentUseCase } from '@/features/collaboration/domain/useCases/AddCommentUseCase';
import { GetCommentsUseCase } from '@/features/collaboration/domain/useCases/GetCommentsUseCase';
import { ResolveCommentUseCase } from '@/features/collaboration/domain/useCases/ResolveCommentUseCase';
import { PerformanceRepository } from '@/features/analytics/data/repositories/PerformanceRepository';
import { LogPerformanceUseCase } from '@/features/analytics/domain/useCases/LogPerformanceUseCase';
import { GetPerformanceLogsUseCase } from '@/features/analytics/domain/useCases/GetPerformanceLogsUseCase';
import { saveVersionUseCase } from './sharedUseCases';


interface CollaborationContextType {
  getVersionHistory: (draftId: string) => Promise<any[]>;
  saveVersion: (params: any) => Promise<any>;
  restoreVersion: (version: any) => Promise<any>;
  addComment: (params: { draftId: string; content: string; author: 'creator' | 'assistant' }) => Promise<any>;
  getComments: (draftId: string) => Promise<any[]>;
  resolveComment: (commentId: string, resolved: boolean) => Promise<void>;
  logPerformance: (params: any) => Promise<any>;
  getPerformanceLogs: (params?: { minScore?: number }) => Promise<any[]>;
}

// Initialize Dependencies outside the component to allow for proper exports
const versionRepo = new VersionRepository();
const tweetRepo = new TweetRepository();
const commentRepo = new CommentRepository();
const performanceRepo = new PerformanceRepository();

// Use Cases - export these for testing
export const getVersionHistoryUseCaseInstance = new GetVersionHistoryUseCase(versionRepo);
export const saveVersionUseCaseInstance = new SaveVersionUseCase(versionRepo);
export const restoreVersionUseCaseInstance = new RestoreVersionUseCase(versionRepo, tweetRepo);
export const addCommentUseCaseInstance = new AddCommentUseCase(commentRepo);
export const getCommentsUseCaseInstance = new GetCommentsUseCase(commentRepo);
export const resolveCommentUseCaseInstance = new ResolveCommentUseCase(commentRepo);
export const logPerformanceUseCaseInstance = new LogPerformanceUseCase(performanceRepo);
export const getPerformanceLogsUseCaseInstance = new GetPerformanceLogsUseCase(performanceRepo);

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getVersionHistory = async (draftId: string) => await getVersionHistoryUseCaseInstance.execute(draftId);
  const saveVersion = async (params: any) => await saveVersionUseCaseInstance.execute(params);
  const restoreVersion = async (version: any) => {
    await restoreVersionUseCaseInstance.execute(version);
  };

  const addComment = async (params: { draftId: string; content: string; author: 'creator' | 'assistant' }) =>
    await addCommentUseCaseInstance.execute(params);
  const getComments = async (draftId: string) => await getCommentsUseCaseInstance.execute(draftId);
  const resolveComment = async (commentId: string, resolved: boolean) =>
    await resolveCommentUseCaseInstance.execute(commentId, resolved);

  const logPerformance = async (params: any) => await logPerformanceUseCaseInstance.execute(params);
  const getPerformanceLogs = async (params?: { minScore?: number }) =>
    await getPerformanceLogsUseCaseInstance.execute(params);

  // Define the function separately to ensure proper typing
  const typedRestoreVersion = async (version: any): Promise<void> => {
    await restoreVersionUseCaseInstance.execute(version);
  };

  return (
    <CollaborationContext.Provider value={{
      getVersionHistory,
      saveVersion,
      restoreVersion: typedRestoreVersion,
      addComment,
      getComments,
      resolveComment,
      logPerformance,
      getPerformanceLogs
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}

// Export use case instances for testing purposes
export {
  addCommentUseCaseInstance as addCommentUseCase,
  getCommentsUseCaseInstance as getCommentsUseCase,
  resolveCommentUseCaseInstance as resolveCommentUseCase,
  getVersionHistoryUseCaseInstance as getVersionHistoryUseCase,
  saveVersionUseCaseInstance as saveVersionUseCase,
  restoreVersionUseCaseInstance as restoreVersionUseCase,
  logPerformanceUseCaseInstance as logPerformanceUseCase,
  getPerformanceLogsUseCaseInstance as getPerformanceLogsUseCase
};
