import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProjectNames = async (clientName: string, projectType: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return [
      `${clientName} ${projectType} Campaign`,
      `${clientName} Rebranding 2024`,
      `${projectType} - ${clientName} v1`,
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 5 professional, creative, and concise project names for a "${projectType}" project for the client "${clientName}". Return only the array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [`${clientName} - ${projectType}`];
  }
};

export const suggestFolderStructure = async (projectType: string): Promise<{name: string, type: 'folder' | 'file', children: any[]}[]> => {
    // Fallback if no API key or error
    if (!apiKey) return [];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a standardized folder structure for a "${projectType}" project. Return a JSON structure suitable for a file tree. Use "folder" or "file" as types.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            type: { type: Type.STRING },
                            children: { 
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT, 
                                    properties: {
                                        name: { type: Type.STRING },
                                        type: { type: Type.STRING },
                                    }
                                }
                             }
                        }
                    }
                }
            }
        });
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text);
    } catch (e) {
        console.error(e);
        return [];
    }
}
