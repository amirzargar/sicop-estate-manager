
import { GoogleGenAI } from "@google/genai";
import { Estate, Unit } from "../types";

// Always initialize with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askSICOPAssistant = async (
  query: string,
  estates: Estate[],
  units: Unit[]
): Promise<string> => {
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
    // Select gemini-3-flash-preview for basic text and reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // Directly access .text property as per guidelines (not a method call)
    return response.text || "I couldn't generate a response based on that query.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};
