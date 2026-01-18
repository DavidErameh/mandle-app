import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@env";

// Model names to try in order of preference
const MODEL_NAMES = [
  "gemini-1.5-pro",
  "gemini-1.5-flash", 
  "gemini-pro",
  "gemini-2.0-flash-exp" // Experimental
];

export async function generateWithGemini(prompt: string): Promise<string> {
  // Validate API key at runtime
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured in .env');
  }

  // Input validation
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  if (prompt.length > 10000) {
    throw new Error('Prompt exceeds maximum length of 10000 characters');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  
  // Try each model name until one works
  let lastError: Error | null = null;
  
  for (const modelName of MODEL_NAMES) {
    try {
      console.log(`[Gemini] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });

      return result.response.text();
    } catch (error: any) {
      console.error(`[Gemini] Model ${modelName} failed:`, error?.message);
      lastError = error;
      // Continue to next model
    }
  }
  
  // All models failed
  throw lastError || new Error('All Gemini models failed');
}

