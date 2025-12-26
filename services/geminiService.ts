import { GoogleGenAI, Type } from "@google/genai";
import { AtsAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResume = async (
  base64File: string,
  mimeType: string,
  jobDescription: string,
  jobRole: string
): Promise<AtsAnalysisResult> => {
  try {
    // Use the standard gemini-2.5-flash model identifier
    const model = "gemini-2.5-flash";

    const prompt = `
      Act as a strict Application Tracking System (ATS). 
      Analyze the provided resume against the Target Job Role and Job Description below.
      
      Target Job Role: "${jobRole}"
      
      Job Description:
      "${jobDescription || "General Software Engineering best practices"}"

      Perform the following:
      1. Identify key skills and requirements specifically for the role of "${jobRole}" based on the description.
      2. Check if they exist in the resume.
      3. Calculate a match score (0-100) based on weighted importance of keywords relative to the Job Role.
      4. List matched keywords.
      5. List missing keywords that are important for this specific role.
      6. Provide a brief summary and actionable suggestions for improvement.

      Return the result purely as JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64File,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "The ATS score from 0 to 100" },
            matchedKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of keywords found in the resume",
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of important keywords missing from the resume",
            },
            summary: { type: Type.STRING, description: "A brief summary of the analysis" },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable improvements",
            },
          },
          required: ["score", "matchedKeywords", "missingKeywords", "summary", "suggestions"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AtsAnalysisResult;
  } catch (error: any) {
    console.error("ATS Analysis Failed:", error);
    
    // Check for 404 specifically to give a better hint
    if (error.status === 404 || (error.message && error.message.includes("404"))) {
        throw new Error("The AI model requested was not found. Please try again or contact support.");
    }
    
    throw new Error(error.message || "Failed to analyze resume. Please try again.");
  }
};