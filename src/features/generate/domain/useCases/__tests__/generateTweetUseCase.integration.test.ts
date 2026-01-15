import { GenerateTweetUseCase } from '../GenerateTweetUseCase';
import { TweetRepository } from '../../../data/repositories/TweetRepository';
import { AIOrchestrator } from '../../../../../core/ai/orchestrator';
import { ContextBuilder } from '../../../../../core/ai/memory/ContextBuilder';
import { GenerationPromptBuilder } from '../../../../../core/ai/prompts/GenerationPrompt';
import { SystemPromptBuilder } from '../../../../../core/ai/prompts/SystemPromptBuilder';
import { PostProcessor } from '../../../../../core/ai/PostProcessor';
import { GuardrailValidator } from '../../../../../core/brand/GuardrailValidator';
import { BrandProfileRepository } from '../../../../settings/data/repositories/BrandProfileRepository';
import { ContentPillarRepository } from '../../../data/repositories/ContentPillarRepository';
import { PerformanceRepository } from '../../../../analytics/data/repositories/PerformanceRepository';
import { NoteRepository } from '../../../../notes/data/repositories/NoteRepository';
import { ConnectedAccountRepository } from '../../../../inspiration/data/repositories/ConnectedAccountRepository';
import { PatternRepository } from '../../../../analytics/data/repositories/PatternRepository';
import { SaveVersionUseCase } from '../../../../collaboration/domain/useCases/SaveVersionUseCase';
import { VersionRepository } from '../../../../collaboration/data/repositories/VersionRepository';

// Mock the AI orchestrator to avoid actual API calls
jest.mock('../../../../../core/ai/orchestrator');
jest.mock('../../../data/repositories/TweetRepository');
jest.mock('../../../../settings/data/repositories/BrandProfileRepository');
jest.mock('../../../data/repositories/ContentPillarRepository');
jest.mock('../../../../analytics/data/repositories/PerformanceRepository');
jest.mock('../../../../notes/data/repositories/NoteRepository');
jest.mock('../../../../inspiration/data/repositories/ConnectedAccountRepository');
jest.mock('../../../../analytics/data/repositories/PatternRepository');

describe('GenerateTweetUseCase Integration', () => {
  let generateTweetUseCase: GenerateTweetUseCase;
  let mockTweetRepo: TweetRepository;
  let mockAiOrchestrator: AIOrchestrator;
  let mockContextBuilder: ContextBuilder;
  let mockPromptBuilder: GenerationPromptBuilder;
  let mockPostProcessor: PostProcessor;
  let mockSaveVersionUseCase: SaveVersionUseCase;

  beforeEach(() => {
    // Setup mocks
    mockTweetRepo = new TweetRepository();
    mockAiOrchestrator = new AIOrchestrator();
    mockContextBuilder = new ContextBuilder(
      new ContentPillarRepository(),
      new BrandProfileRepository(),
      new PerformanceRepository(),
      new NoteRepository(),
      new ConnectedAccountRepository(),
      new PatternRepository()
    );
    mockPromptBuilder = new GenerationPromptBuilder(new SystemPromptBuilder());
    mockPostProcessor = new PostProcessor(new GuardrailValidator());
    mockSaveVersionUseCase = new SaveVersionUseCase(new VersionRepository());

    generateTweetUseCase = new GenerateTweetUseCase(
      mockTweetRepo,
      mockAiOrchestrator,
      mockContextBuilder,
      mockPromptBuilder,
      mockPostProcessor,
      mockSaveVersionUseCase
    );

    jest.clearAllMocks();
  });

  it('should generate tweets successfully with valid inputs', async () => {
    // Mock the AI orchestrator to return sample tweets
    const mockAiResponse = [
      'This is a sample tweet about technology',
      'Another tech tweet for testing purposes',
      'Testing tweet generation flow'
    ];
    
    jest.spyOn(mockAiOrchestrator, 'generate').mockResolvedValue(mockAiResponse);
    
    // Mock the context builder to return sample context
    const mockContext = {
      pillar: {
        id: 'test-pillar',
        name: 'Technology',
        description: 'Technology related content',
        examples: ['Example tweet'],
        tags: ['Technology'],
        active: true,
        usageCount: 0,
        createdAt: new Date()
      },
      brandProfile: {
        id: 'test-brand',
        systemPrompt: 'You are a tech expert',
        guardrails: {
          allowedTopics: ['Technology'],
          avoidTopics: ['Politics'],
          tone: 'Professional',
          maxHashtags: 2,
          characterRange: [10, 280] as [number, number]
        },
        voiceExamples: ['Sample voice example'],
        createdAt: new Date()
      },
      pastSuccesses: [],
      readyNotes: [],
      viralPatterns: []
    };

    jest.spyOn(mockContextBuilder, 'build').mockResolvedValue(mockContext);
    
    // Mock the prompt builder
    const mockPrompt = 'Generated prompt for tweet generation';
    jest.spyOn(mockPromptBuilder, 'build').mockReturnValue(mockPrompt);
    
    // Mock the post processor
    const mockProcessedTweets = mockAiResponse.map(content => ({
      content,
      violations: [],
      hasViolations: false
    }));
    
    jest.spyOn(mockPostProcessor, 'process').mockResolvedValue(mockProcessedTweets);
    
    // Mock repository save
    jest.spyOn(mockTweetRepo, 'saveDrafts').mockResolvedValue(undefined);
    
    // Execute the use case
    const mockBrandProfile = {
      id: 'test-profile',
      systemPrompt: 'You are a tech expert',
      guardrails: {
        allowedTopics: ['Technology'],
        avoidTopics: ['Politics'],
        tone: 'Professional',
        maxHashtags: 2,
        characterRange: [10, 280] as [number, number]
      },
      voiceExamples: ['Sample voice example'],
      createdAt: new Date()
    };
    
    const result = await generateTweetUseCase.execute(mockBrandProfile, 'twitter');
    
    // Assertions
    expect(result).toHaveLength(3);
    expect(mockAiOrchestrator.generate).toHaveBeenCalledWith(mockPrompt, 3);
    expect(mockTweetRepo.saveDrafts).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    // Mock the AI orchestrator to throw an error
    jest.spyOn(mockAiOrchestrator, 'generate').mockRejectedValue(new Error('AI Service unavailable'));
    
    const mockBrandProfile = {
      id: 'test-profile',
      systemPrompt: 'You are a tech expert',
      guardrails: {
        allowedTopics: ['Technology'],
        avoidTopics: ['Politics'],
        tone: 'Professional',
        maxHashtags: 2,
        characterRange: [10, 280] as [number, number]
      },
      voiceExamples: ['Sample voice example'],
      createdAt: new Date()
    };
    
    await expect(generateTweetUseCase.execute(mockBrandProfile, 'twitter')).rejects.toThrow('AI Service unavailable');
  });
});