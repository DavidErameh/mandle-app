import Groq from "groq-sdk";
import { GROQ_API_KEY } from "@env";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function generateWithGroq(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || "";
}
