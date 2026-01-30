
import { GoogleGenAI } from "@google/genai";

export class GeminiAdapter {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }

  async generate(prompt: string, systemInstruction: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for factual enterprise data
        },
      });
      return response.text || "No response generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to connect to AI infrastructure.");
    }
  }
}
