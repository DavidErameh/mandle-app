import { generateWithGemini } from "./providers/gemini";
import { generateWithGroq } from "./providers/groq";

export async function generateContent(prompt: string): Promise<string> {
  try {
    // Try Gemini first (better quality)
    return await generateWithGemini(prompt);
  } catch (error) {
    console.log("Gemini failed, falling back to Groq:", error);

    try {
      // Fallback to Groq
      return await generateWithGroq(prompt);
    } catch (fallbackError) {
      console.error("Both AI providers failed:", fallbackError);
      throw new Error("AI generation unavailable");
    }
  }
}
