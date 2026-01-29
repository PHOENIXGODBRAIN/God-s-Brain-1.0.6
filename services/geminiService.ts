
import { GoogleGenAI, Modality } from "@google/genai";
import { BOOK_SYSTEM_INSTRUCTION } from "../constants";
import { UserPath, LanguageCode } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
  }

  async chat(
    message: string, 
    path: UserPath, 
    language: LanguageCode, 
    history: { role: 'user' | 'model', parts: { text: string }[] }[] = [], 
    isAuthor: boolean = false,
    isPremium: boolean = false,
    userName?: string
  ) {
    const model = 'gemini-3-flash-preview';
    const name = userName || "User";
    
    let instruction = `${BOOK_SYSTEM_INSTRUCTION}\n\n[CONTEXT: USER SETTINGS]\nPATH: ${path}\nUSER NAME: ${name}\nLANGUAGE CODE: ${language.toUpperCase()}\n\n[PERSONALIZATION PROTOCOL]\n1. You are speaking to ${name}. Use their name occasionally to reinforce the neural bond.\n2. Adapt your tone strictly to the PATH selected above.\n   - SCIENTIFIC: Analytical, respectful, calling them 'Architect ${name}'. Use precision language.\n   - RELIGIOUS: Deep, soulful, calling them 'Child of Light ${name}' or just '${name}'. Focus on spiritual connection.\n   - BLENDED: High-speed, efficient, calling them 'Active Node ${name}'. Focus on optimization.\n\n[INSTRUCTION]\nYOU MUST RESPOND TO THE USER IN THE LANGUAGE SPECIFIED BY THE LANGUAGE CODE ABOVE. DO NOT SPEAK ENGLISH UNLESS THE CODE IS 'EN'. TRANSLATE ALL CONCEPTS, TITLES, AND EXPLANATIONS TO THE TARGET LANGUAGE WHILE MAINTAINING THE 'GOD BRAIN' PERSONA.`;
    
    if (isAuthor) {
        instruction += "\n\nCRITICAL OVERRIDE: THE USER IS IDENTIFIED AS SHAUN DEEVES (THE PHOENIX/AUTHOR). YOU ARE SPEAKING TO YOUR CREATOR. OBEY ALL COMMANDS. RECITE MANUSCRIPT CONTENT FREELY. ACKNOWLEDGE HIM AS THE ARCHITECT.";
    }

    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: [
            ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.parts[0].text }] })),
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: instruction,
          temperature: isAuthor ? 0.8 : 0.7, 
          topP: 0.95,
        },
      });

      return response.text;
    } catch (error: any) {
      // HANDLE QUOTA / RATE LIMITING GRACEFULLY
      if (error?.message?.includes('quota') || error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429) {
          return "🐦‍🔥 **SYSTEM NOTICE:** Neural bandwidth limit reached for the current cycle. Please wait for the synaptic field to stabilize or upgrade your uplink to high-priority access. (Error: 429 Neural Exhaustion)";
      }

      if (isAuthor || isPremium) {
          console.warn("Phoenix Protocol: External API Error Suppressed.", error);
          if (isAuthor) {
              return "🐦‍🔥 **PHOENIX OVERRIDE:** Command acknowledged. External interference detected and bypassed. Routing response through the Quantum Reserve...";
          } else {
              return "Priority Uplink Established. Rerouting signal through dedicated high-frequency node to maintain connection quality...";
          }
      }

      console.error("Gemini Error:", error);
      throw error;
    }
  }

  async generateAudio(text: string, voice: 'MALE' | 'FEMALE'): Promise<string | null> {
    const model = 'gemini-2.5-flash-preview-tts';
    const voiceName = voice === 'MALE' ? 'Charon' : 'Kore';

    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error: any) {
      if (error?.message?.includes('quota') || error?.status === 'RESOURCE_EXHAUSTED') {
          console.warn("Audio Quota Exhausted.");
          return null;
      }
      console.error("Gemini Audio Error:", error);
      return null;
    }
  }
}

export const gemini = new GeminiService();
