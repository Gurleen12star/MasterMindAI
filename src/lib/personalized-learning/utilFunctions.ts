import { ChatHistoryType, ModuleType, PagesType, SetIntroductionType, SetStudyPlatformType, StudyPlatformType } from "@/types/personalized-learning";

export const pageVariants = (durationStart: number, durationEnd?: number) => ({
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.98 }
});

export const pageTransition = (duration: number) => ({
    type: 'spring',
    stiffness: 300,
    damping: 30,
    duration,
});

/**
 * Extracts and cleans potential JSON content from a string
 * Handles markdown code blocks and finds array/object delimiters
 */
export const extractAndCleanJsonString = (text: string): string | null => {
    if (!text || typeof text !== 'string') {
        return null;
    }

    let extractedText = text;

    // Try to extract from markdown code blocks first
    const codeBlockMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
    if (codeBlockMatch) {
        extractedText = codeBlockMatch[1];
    } else {
        // Fall back to finding array delimiters
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']');
        
        if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
            return null;
        }
        
        extractedText = text.slice(jsonStart, jsonEnd + 1);
    }

    // Clean the extracted string of problematic characters
    const cleanedString = extractedText
        .replace(/[\n\r\t\b\f]/g, '') // Remove whitespace characters
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
        .trim();

    return cleanedString || null;
};

export const validateJSON = (text: string): boolean => {
    try {
        const cleanedString = extractAndCleanJsonString(text);
        
        if (!cleanedString) {
            return false;
        }

        const parsed = JSON.parse(cleanedString);
        
        // Ensure it's an array (which is what the application expects)
        return Array.isArray(parsed);
    } catch (e) {
        return false;
    }
};

export const addHistoryChat = (
    history: ChatHistoryType[],
    setHistory: (history: ChatHistoryType[]) => void,
    role: 'user' | 'model',
    string: string,
) => {
    const newHistory: ChatHistoryType = {
        role: role,
        parts: [{ text: string }],
    };

    setHistory([...history, newHistory]);
};

export const addStoriesChat = (
    history: ChatHistoryType[],
    setHistory: (history: ChatHistoryType[]) => void,
    user: string,
    model: string,
) => {
    const newUserHistory: ChatHistoryType = {
        role: 'user',
        parts: [{ text: user }],
    };
    const newModelHistory: ChatHistoryType = {
        role: 'model',
        parts: [{ text: model }],
    };

    setHistory([...history, newUserHistory, newModelHistory]);
};

export const cleanAndConvertPlanoEstudo = (planoEstudoString: string) => {
    const cleanedString = extractAndCleanJsonString(planoEstudoString);
    
    if (!cleanedString) {
        throw new Error('No valid JSON content found in the provided string');
    }

    // Validate before parsing
    if (!validateJSON(planoEstudoString)) {
        throw new Error('Invalid JSON format detected');
    }

    try {
        const planoEstudo = JSON.parse(cleanedString);
        return planoEstudo;
    } catch (error) {
        throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export const addPropertiesToModules = (modules: any[]): ModuleType[] => {
    return modules.map(module => ({
        ...module,
        content: [],
        isOpen: false,
        chatHistory: [],
    }));
}

export const generateModules = (
    model: string,
    studyPlatform: StudyPlatformType,
    setStudyPlatform: SetStudyPlatformType,
) => {
    try {
        const cleanedModules = cleanAndConvertPlanoEstudo(model);
        const newModules = addPropertiesToModules(cleanedModules);
        setStudyPlatform({
            ...studyPlatform,
            show: true,
            modulos: [
                ...studyPlatform.modulos,
                ...newModules
            ]
        });
    } catch (error) {
        console.error('Error generating modules:', error);
        // Handle the error gracefully - you might want to show an error message to the user
        // For now, we'll just log it and not crash the application
    }
};

export const generateModule = (
    model: string,
    studyPlatform: StudyPlatformType,
    setStudyPlatform: SetStudyPlatformType,
) => {
    try {
        const cleanedModule = cleanAndConvertPlanoEstudo(model);
        const updatedModules = [...studyPlatform.modulos];
        updatedModules[studyPlatform.actModule] = {
            ...updatedModules[studyPlatform.actModule],
            isOpen: true,
            content: [
                ...updatedModules[studyPlatform.actModule].content,
                ...cleanedModule
            ]
        };

        setStudyPlatform(prevState => ({
            ...prevState,
            modulos: updatedModules
        }));
    } catch (error) {
        console.error('Error generating module:', error);
        // Handle the error gracefully
    }
};

export const resetContext = (
    setIntroduction: SetIntroductionType,
    setStudyPlatform: SetStudyPlatformType,
) => {
    setStudyPlatform({
        show: false,
        isGettingModels: false,
        isGettingModulo: false,
        isLoading: false,
        actModule: 0,
        modulos: [],
    });
    setIntroduction(prevState => ({
        ...prevState,
        show: true,
        isLoading: false,
        actPage: 3,
        pages: {
            page1: {
                input: true,
                button: true,
                visited: true,
            },
            page2: {
                input: true,
                button: true,
                visited: true,
            },
            page3: {
                input: true,
                button: true,
                visited: true,
            },
        } as PagesType,
    }));
};