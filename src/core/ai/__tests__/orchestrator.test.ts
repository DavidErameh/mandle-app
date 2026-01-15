import { AIOrchestrator } from '../orchestrator';
import { generateWithGemini } from '../providers/gemini';
import { generateWithGroq } from '../providers/groq';

// Mock the AI providers
jest.mock('../providers/gemini');
jest.mock('../providers/groq');

const mockedGenerateWithGemini = generateWithGemini as jest.MockedFunction<typeof generateWithGemini>;
const mockedGenerateWithGroq = generateWithGroq as jest.MockedFunction<typeof generateWithGroq>;

describe('AIOrchestrator', () => {
  let orchestrator: AIOrchestrator;

  beforeEach(() => {
    orchestrator = new AIOrchestrator();
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should successfully generate tweets using Gemini', async () => {
      const mockResponse = 'TWEET_1: Hello world\nTWEET_2: Another tweet';
      mockedGenerateWithGemini.mockResolvedValue(mockResponse);

      const result = await orchestrator.generate('Test prompt', 2);

      expect(result).toEqual(['Hello world', 'Another tweet']);
      expect(mockedGenerateWithGemini).toHaveBeenCalledWith('Test prompt');
    });

    it('should fallback to Groq when Gemini fails', async () => {
      const mockResponse = 'TWEET_1: Fallback tweet';
      mockedGenerateWithGemini.mockRejectedValue(new Error('Gemini error'));
      mockedGenerateWithGroq.mockResolvedValue(mockResponse);

      const result = await orchestrator.generate('Test prompt', 1);

      expect(result).toEqual(['Fallback tweet']);
      expect(mockedGenerateWithGroq).toHaveBeenCalledWith('Test prompt');
    });

    it('should throw error when both providers fail', async () => {
      mockedGenerateWithGemini.mockRejectedValue(new Error('Gemini error'));
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

    it('should handle tweets with different formatting', async () => {
      const orchestratorWithParse = new AIOrchestrator();
      // Access the private method using a workaround
      const parseMethod = (orchestratorWithParse as any).parseTweets.bind(orchestratorWithParse);
      
      const response = 'Tweet 1: First tweet\nTweet 2: Second tweet';
      const result = parseMethod(response, 2);
      
      expect(result).toEqual(['First tweet', 'Second tweet']);
    });
  });
});