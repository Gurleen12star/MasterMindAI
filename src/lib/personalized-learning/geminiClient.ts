import { ChatHistoryType, TeacherPersonality } from "@/types/personalized-learning";

const geminiClient = (personality: TeacherPersonality, history?: ChatHistoryType[]): any => {
    console.warn("Client-side Gemini API is disabled for Phase 1.");
    throw new Error("API Disabled");
};

const interactionGemini = async (message: string, personality: TeacherPersonality, history?: ChatHistoryType[]) => {
    // Disabled
    return "";
};

export default interactionGemini;