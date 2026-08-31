import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold
} from "@google/generative-ai";
import getInstructions from "./getInstructions";
import { ChatHistoryType, TeacherPersonality } from "@/types/personalized-learning";

const geminiClient = (personality: TeacherPersonality, history?: ChatHistoryType[]) => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ 
        model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash',
        systemInstruction: getInstructions(personality),
    });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: history || [],
    });

    return chat;
};

const interactionGemini = async (message: string, personality: TeacherPersonality, history?: ChatHistoryType[]) => {
    const result = await geminiClient(personality, history).sendMessage(message);
    return result.response;
};

export default interactionGemini;