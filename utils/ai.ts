import { GoogleGenAI, Type } from "@google/genai";
import { ThemeConfig } from "../types";

// Helper to get AI client safely
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateBio(name: string, currentBio: string): Promise<string> {
  try {
    const ai = getAiClient();
    const prompt = `Write a short, engaging, and professional social media bio (under 120 characters) for a person named "${name}". 
    Context/Current Bio: "${currentBio || 'A creative professional'}". 
    Make it catchy and use one emoji if appropriate. Return ONLY the text.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Creative professional exploring new ideas. ✨";
  } catch (error) {
    console.error("AI Bio Generation Error:", error);
    return "Creative professional exploring new ideas. ✨";
  }
}

export async function generateTheme(description: string): Promise<Partial<ThemeConfig>> {
  try {
    const ai = getAiClient();
    const prompt = `Create a UI color theme based on this description: "${description}".
    The theme needs a start/end gradient for the background, a button background color, button text color, and a general text color.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            backgroundStart: { type: Type.STRING, description: "Hex color code for gradient start" },
            backgroundEnd: { type: Type.STRING, description: "Hex color code for gradient end" },
            buttonBg: { type: Type.STRING, description: "Hex color code for button background" },
            buttonText: { type: Type.STRING, description: "Hex color code for button text" },
            textColor: { type: Type.STRING, description: "Hex color code for main text" },
          },
          required: ["backgroundStart", "backgroundEnd", "buttonBg", "buttonText", "textColor"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("AI Theme Generation Error:", error);
    throw new Error("Failed to generate theme.");
  }
}