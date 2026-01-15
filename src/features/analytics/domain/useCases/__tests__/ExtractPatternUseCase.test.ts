import { ExtractPatternUseCase } from '../ExtractPatternUseCase';

describe('ExtractPatternUseCase', () => {
  let useCase: ExtractPatternUseCase;
  let mockAI: any;
  let mockPromptBuilder: any;
  let mockRepo: any;

  beforeEach(() => {
    mockAI = {
      generate: jest.fn()
    };
    mockPromptBuilder = {
      build: jest.fn().mockReturnValue('mock prompt')
    };
    mockRepo = {
      save: jest.fn().mockResolvedValue(undefined)
    };
    useCase = new ExtractPatternUseCase(mockAI, mockPromptBuilder, mockRepo);
  });

  it('should extract and save a pattern from a successful AI response', async () => {
    const mockJsonResponse = JSON.stringify({
      name: 'Educational Thread Hook',
      description: 'A pattern that starts with a realization and follows with a "how-to".',
      hookType: 'Realization',
      structure: 'Problem/Solution',
      emotion: 'Curiosity',
      ctaType: 'Follow',
      intensity: 'High'
    });

    mockAI.generate.mockResolvedValue([mockJsonResponse]);

    const result = await useCase.execute('test content', 'tweet-123');

    expect(result.name).toBe('Educational Thread Hook');
    expect(result.hookType).toBe('Realization');
    expect(mockRepo.save).toHaveBeenCalled();
    
    const savedPattern = mockRepo.save.mock.calls[0][0];
    expect(savedPattern.sourceTweetId).toBe('tweet-123');
  });

  it('should use fallback values if AI JSON is missing fields', async () => {
    const mockJsonResponse = JSON.stringify({
      name: 'Partial Pattern'
    });

    mockAI.generate.mockResolvedValue([mockJsonResponse]);

    const result = await useCase.execute('test content');

    expect(result.name).toBe('Partial Pattern');
    expect(result.hookType).toBe('Unknown');
    expect(result.intensity).toBe('Medium');
  });

  it('should throw an error if AI fails to return content', async () => {
    mockAI.generate.mockResolvedValue([]);

    await expect(useCase.execute('test content')).rejects.toThrow('AI failed to extract pattern');
  });
});
