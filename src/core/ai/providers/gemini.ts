import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@env";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateWithGemini(prompt: string): Promise<string> {
  // Input validation
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  if (prompt.length > 10000) { // Reasonable limit for prompts
    throw new Error('Prompt exceeds maximum length of 10000 characters');
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  // AI generation configuration constants
  const TEMPERATURE = 0.9;
  const TOP_P = 0.95;
  const TOP_K = 40;
  const MAX_OUTPUT_TOKENS = 1024;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: TEMPERATURE,
      topP: TOP_P,
      topK: TOP_K,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  });

  return result.response.text();
}
