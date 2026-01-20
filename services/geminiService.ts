import { GoogleGenAI } from "@google/genai";
import { ImageEditRequest, GeneratedImage } from "../types";

// Initialize the API client
// Note: In a real environment, ensure API_KEY is set in process.env
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const editImageWithGemini = async (request: ImageEditRequest): Promise<GeneratedImage> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  try {
    const { imageBase64, mimeType, prompt } = request;

    // Use the specific model requested for image editing capabilities
    // 'gemini-2.5-flash-image' is the 'Nano banana' model referred to in instructions for image tasks
    const modelId = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            return {
              mimeType: part.inlineData.mimeType || 'image/png',
              data: part.inlineData.data,
            };
          }
        }
      }
    }

    throw new Error("No image data returned from the model.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};