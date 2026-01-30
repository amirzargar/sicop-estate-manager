
import { GoogleGenAI } from "@google/genai";
import { StorageService } from "./mockStorage";

export class GeminiService {
  private static ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

  static async askAssistant(prompt: string): Promise<string> {
    const data = StorageService.getData();
    
    // Minimize data for context to stay within token limits
    const context = {
      estates: data.estates.map(e => ({ name: e.name, location: e.location })),
      units: data.units.map(u => ({ name: u.unitName, proprietor: u.proprietorName, estate: data.estates.find(e => e.id === u.estateId)?.name, lease: u.leaseStatus })),
      rent: data.rentRecords.filter(r => r.status !== 'PAID').map(r => ({ unit: data.units.find(u => u.id === r.unitId)?.unitName, amount: r.amount, due: r.dueDate, status: r.status }))
    };

    const systemInstruction = `
      You are the SICOP Estate Management AI Assistant. 
      Current system data: ${JSON.stringify(context)}.
      Answer questions concisely based ONLY on the data provided. 
      Be professional and helpful. Use Markdown for formatting.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "There was an error connecting to the AI assistant. Please check your configuration.";
    }
  }
}
