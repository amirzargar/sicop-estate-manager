import { GoogleGenAI } from "@google/genai";
import { Estate, Unit } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize specific Gemini model
let ai: GoogleGenAI | null = null;
try {
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    }
} catch (error) {
    console.error("Failed to initialize GoogleGenAI", error);
}

export const askSICOPAssistant = async (
  query: string,
  estates: Estate[],
  units: Unit[]
): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Please check your environment variables.";
  }

  // Create a context string from the current state of the application
  const contextData = JSON.stringify({
    estates: estates.map(e => ({ name: e.name, location: e.location })),
    units: units.map(u => ({
      name: u.name,
      estate: estates.find(e => e.id === u.estateId)?.name,
      proprietor: u.proprietorName,
      activity: u.lineOfActivity,
      employees: u.employeeCount,
      rentStatus: u.rentStatus,
      monthlyRent: u.monthlyRent
    }))
  }, null, 2);

  const systemInstruction = `
    You are an intelligent assistant for SICOP (Small Scale Industries Development Corporation).
    You have access to the current database of Industrial Estates and Units in JSON format.
    
    Your role is to help administrators and managers understand their data.
    
    Rules:
    1. Answer based ONLY on the provided JSON context.
    2. Be professional, concise, and helpful.
    3. If asked about financial summaries, calculate them from the data provided.
    4. If the user asks for a specific unit's details, look it up.
    
    Context Data:
    ${contextData}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response based on that query.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};
