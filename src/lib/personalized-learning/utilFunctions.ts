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
 * Extracts and cleans potential JSON content from a string with multiple fallback methods
 */
export const extractAndCleanJsonString = (text: string): string | null => {
    if (!text || typeof text !== 'string') {
        console.warn('extractAndCleanJsonString: Invalid input - not a string or empty');
        return null;
    }

    console.log('extractAndCleanJsonString: Input text length:', text.length);
    console.log('extractAndCleanJsonString: First 200 chars:', text.substring(0, 200));

    // Method 1: Try to extract from markdown code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
    if (codeBlockMatch) {
        console.log('extractAndCleanJsonString: Found markdown code block');
        return cleanJsonString(codeBlockMatch[1]);
    }

    // Method 2: Look for JSON array patterns with better regex
    const jsonArrayMatch = text.match(/\[[\s\S]*?\]/);
    if (jsonArrayMatch) {
        console.log('extractAndCleanJsonString: Found JSON array pattern');
        return cleanJsonString(jsonArrayMatch[0]);
    }

    // Method 3: Find first [ and last ] with content validation
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1 && firstBracket < lastBracket) {
        const extracted = text.slice(firstBracket, lastBracket + 1);
        console.log('extractAndCleanJsonString: Extracted using bracket positions');
        return cleanJsonString(extracted);
    }

    // Method 4: Try to find JSON-like content between common delimiters
    const patterns = [
        /\[[\s\S]*\]/g,  // Any content between square brackets
        /\{[\s\S]*\}/g,  // Any content between curly brackets (in case it's an object)
    ];

    for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
            // Try the longest match first
            const sortedMatches = matches.sort((a, b) => b.length - a.length);
            for (const match of sortedMatches) {
                const cleaned = cleanJsonString(match);
                if (cleaned && isValidJsonStructure(cleaned)) {
                    console.log('extractAndCleanJsonString: Found valid JSON using pattern matching');
                    return cleaned;
                }
            }
        }
    }

    console.warn('extractAndCleanJsonString: No valid JSON content found');
    return null;
};

/**
 * Cleans a JSON string of problematic characters
 */
const cleanJsonString = (jsonString: string): string | null => {
    if (!jsonString) return null;
    
    // Remove problematic characters but preserve essential JSON structure
    const cleaned = jsonString
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control chars but keep \n, \r, \t
        .replace(/[\u2028\u2029]/g, '') // Remove Unicode line separators
        .trim();

    return cleaned || null;
};

/**
 * Basic check if a string looks like valid JSON structure
 */
const isValidJsonStructure = (text: string): boolean => {
    if (!text) return false;
    
    const trimmed = text.trim();
    if (!trimmed) return false;
    
    // Check if it starts and ends with proper JSON delimiters
    const isArray = trimmed.startsWith('[') && trimmed.endsWith(']');
    const isObject = trimmed.startsWith('{') && trimmed.endsWith('}');
    
    if (!isArray && !isObject) return false;
    
    // Basic bracket balance check
    let bracketCount = 0;
    let braceCount = 0;
    
    for (const char of trimmed) {
        if (char === '[') bracketCount++;
        else if (char === ']') bracketCount--;
        else if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
    }
    
    return bracketCount === 0 && braceCount === 0;
};

export const validateJSON = (text: string): boolean => {
    try {
        const cleanedString = extractAndCleanJsonString(text);
        
        if (!cleanedString) {
            console.warn('validateJSON: No cleaned string extracted');
            return false;
        }

        console.log('validateJSON: Attempting to parse cleaned string:', cleanedString.substring(0, 100));
        const parsed = JSON.parse(cleanedString);
        
        // Ensure it's an array (which is what the application expects)
        const isValid = Array.isArray(parsed);
        console.log('validateJSON: Is valid array:', isValid);
        return isValid;
    } catch (e) {
        console.error('validateJSON: Parse error:', e);
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
    console.log('cleanAndConvertPlanoEstudo: Starting with string length:', planoEstudoString?.length);
    
    if (!planoEstudoString || typeof planoEstudoString !== 'string' || planoEstudoString.trim().length === 0) {
        console.error('cleanAndConvertPlanoEstudo: Invalid input - empty or non-string value');
        throw new Error('Invalid input: planoEstudoString must be a non-empty string. Received: ' + (typeof planoEstudoString) + ' with length: ' + (planoEstudoString?.length || 'undefined'));
    }

    // First validate that we can extract valid JSON
    if (!validateJSON(planoEstudoString)) {
        console.error('cleanAndConvertPlanoEstudo: JSON validation failed for string:', planoEstudoString.substring(0, 500));
        throw new Error('Invalid JSON format detected - no valid array structure found');
    }

    // Extract the cleaned JSON string
    const cleanedString = extractAndCleanJsonString(planoEstudoString);
    
    if (!cleanedString) {
        console.error('cleanAndConvertPlanoEstudo: No cleaned string could be extracted');
        throw new Error('No valid JSON content found in the provided string after validation passed');
    }

    try {
        console.log('cleanAndConvertPlanoEstudo: Parsing cleaned string:', cleanedString.substring(0, 200));
        const planoEstudo = JSON.parse(cleanedString);
        console.log('cleanAndConvertPlanoEstudo: Successfully parsed, result type:', Array.isArray(planoEstudo) ? 'array' : typeof planoEstudo);
        console.log('cleanAndConvertPlanoEstudo: Array length:', Array.isArray(planoEstudo) ? planoEstudo.length : 'N/A');
        return planoEstudo;
    } catch (error) {
        console.error('cleanAndConvertPlanoEstudo: Parse error:', error);
        console.error('cleanAndConvertPlanoEstudo: Failed to parse string:', cleanedString);
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
    setIntroduction: SetIntroductionType,
) => {
    // Add validation to ensure model contains content
    if (!model || typeof model !== 'string' || model.trim().length === 0) {
        console.error('generateModules: Invalid model response - empty or non-string');
        return;
    }
    
    try {
        console.log('generateModules: Processing model response...');
        console.log('generateModules: Model response length:', model.length);
        const cleanedModules = cleanAndConvertPlanoEstudo(model);
        const newModules = addPropertiesToModules(cleanedModules);
        console.log('generateModules: Successfully generated', newModules.length, 'modules');
        
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
        console.error('Model response that caused error:', model);
        // Handle the error gracefully by reverting to introduction
        console.warn('generateModules: Reverting to introduction due to error');
        resetContext(setIntroduction, setStudyPlatform);
    }
};

export const generateModule = (
    model: string,
    studyPlatform: StudyPlatformType,
    setStudyPlatform: SetStudyPlatformType,
) => {
    // Add validation to ensure model contains content
    if (!model || typeof model !== 'string' || model.trim().length === 0) {
        console.error('generateModule: Invalid model response - empty or non-string');
        return;
    }
    
    try {
        console.log('generateModule: Processing model response...');
        console.log('generateModule: Model response length:', model.length);
        const cleanedModule = cleanAndConvertPlanoEstudo(model);
        console.log('generateModule: Successfully parsed module content');
        
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
        console.error('Model response that caused error:', model);
        // Handle the error gracefully
        console.warn('generateModule: Error processing module content');
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