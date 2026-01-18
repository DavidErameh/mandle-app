import { AIOrchestrator } from '../orchestrator';
import { generateWithGroq } from '../providers/groq';

// Mock the AI provider
jest.mock('../providers/groq');

const mockedGenerateWithGroq = generateWithGroq as jest.MockedFunction<typeof generateWithGroq>;

describe('AIOrchestrator', () => {
  let orchestrator: AIOrchestrator;

  beforeEach(() => {
    orchestrator = new AIOrchestrator();
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should successfully generate tweets using Groq', async () => {
      const mockResponse = 'TWEET_1: Hello world\nTWEET_2: Another tweet';
      mockedGenerateWithGroq.mockResolvedValue(mockResponse);

      const result = await orchestrator.generate('Test prompt', 2);

      expect(result).toEqual(['Hello world', 'Another tweet']);
      expect(mockedGenerateWithGroq).toHaveBeenCalledWith('Test prompt');
    });

    it('should throw error when Groq fails', async () => {
      mockedGenerateWithGroq.mockRejectedValue(new Error('Groq error'));

      await expect(orchestrator.generate('Test prompt', 1)).rejects.toThrow('AI generation unavailable');
    });

    it('should validate input parameters', async () => {
      await expect(orchestrator.generate('', 1)).rejects.toThrow('Prompt must be a non-empty string');
      await expect(orchestrator.generate('valid prompt', 0)).rejects.toThrow('Target count must be between 1 and 10');
      await expect(orchestrator.generate('valid prompt', 11)).rejects.toThrow('Target count must be between 1 and 10');
    });
  });

  describe('parseTweets', () => {
    it('should parse tweets with numbered format', async () => {
      const orchestratorWithParse = new AIOrchestrator();
      // Access the private method using a workaround
      const parseMethod = (orchestratorWithParse as any).parseTweets.bind(orchestratorWithParse);
      
      const response = 'TWEET_1: First tweet\nTWEET_2: Second tweet\nTWEET_3: Third tweet';
      const result = parseMethod(response, 3);
      
      expect(result).toEqual(['First tweet', 'Second tweet', 'Third tweet']);
    });

    it('should handle Llama 3 bold format (**TWEET_1:**)', async () => {
      const orchestratorWithParse = new AIOrchestrator();
      const parseMethod = (orchestratorWithParse as any).parseTweets.bind(orchestratorWithParse);
      
      const response = '**TWEET_1:** First tweet content\n\n**TWEET_2:** Second tweet content';
      const result = parseMethod(response, 2);
      
      expect(result).toEqual(['First tweet content', 'Second tweet content']);
    });

    it('should handle Llama 3 chatty preamble', async () => {
      const orchestratorWithParse = new AIOrchestrator();
      const parseMethod = (orchestratorWithParse as any).parseTweets.bind(orchestratorWithParse);
      
      const response = 'Here is your thread based on the input:\n\nTWEET_1: First tweet\nTWEET_2: Second tweet';
      const result = parseMethod(response, 2);
      
      expect(result).toEqual(['First tweet', 'Second tweet']);
    });

    it('should handle sloppy spacing (Tweet 1:)', async () => {
      const orchestratorWithParse = new AIOrchestrator();
      const parseMethod = (orchestratorWithParse as any).parseTweets.bind(orchestratorWithParse);
      
      const response = 'Tweet 1: This is tweet one\nTweet #2: This is tweet two';
      const result = parseMethod(response, 2);
      
      expect(result).toEqual(['This is tweet one', 'This is tweet two']);
    });

    it('should fallback to paragraph splitting if tags missing', async () => {
      const orchestratorWithParse = new AIOrchestrator();
      const parseMethod = (orchestratorWithParse as any).parseTweets.bind(orchestratorWithParse);
      
      // Non-TWEET_ format should fall back to paragraph splitting
      const response = 'First paragraph that is long enough to be a tweet.\n\nSecond paragraph that is also a tweet.';
      const result = parseMethod(response, 2);
      
      expect(result).toEqual(['First paragraph that is long enough to be a tweet.', 'Second paragraph that is also a tweet.']);
    });
  });
});