import Groq from "groq-sdk";
import { GROQ_API_KEY } from "@env";

const groq = new Groq({ 
  apiKey: GROQ_API_KEY || 'dummy_key', // Prevent crash on init if key missing, validate later
  dangerouslyAllowBrowser: true // Required for React Native
});

export async function generateWithGroq(prompt: string): Promise<string> {
  // Validate API key at runtime
  if (!GROQ_API_KEY || GROQ_API_KEY.includes('your_groq_api_key')) {
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  // Input validation
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  if (prompt.length > 10000) { 
    throw new Error('Prompt exceeds maximum length of 10000 characters');
  }

  try {
    // AI generation configuration constants
    const MODEL_NAME = "llama-3.3-70b-versatile";
    const TEMPERATURE = 0.9;
    const MAX_TOKENS = 1024;

    console.log(`[Groq] Generating with model: ${MODEL_NAME}`);

    const completion = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt }],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error('[Groq] API Error:', error?.message || error);
    throw error;
  }
}
