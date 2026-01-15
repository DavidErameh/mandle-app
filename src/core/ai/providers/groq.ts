import Groq from "groq-sdk";
import { GROQ_API_KEY } from "@env";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function generateWithGroq(prompt: string): Promise<string> {
  // Input validation
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  if (prompt.length > 10000) { // Reasonable limit for prompts
    throw new Error('Prompt exceeds maximum length of 10000 characters');
  }

  // AI generation configuration constants
  const MODEL_NAME = "llama-3.3-70b-versatile";
  const TEMPERATURE = 0.9;
  const MAX_TOKENS = 1024;

  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages: [{ role: "user", content: prompt }],
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
  });

  return completion.choices[0]?.message?.content || "";
}
