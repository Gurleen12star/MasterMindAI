'use client';

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { ChatHistoryType, IntroductionType, ModuleType, PagesType, SetIntroductionType, SetSidebarType, SetStudyPlatformType, SidebarType, StudyPlatformType, TeacherPersonality } from "@/types/personalized-learning";

interface PersonalizedLearningContextType {
    introduction: IntroductionType;
    setIntroduction: SetIntroductionType;
    studyPlatform: StudyPlatformType;
    setStudyPlatform: SetStudyPlatformType;
    userName: string;
    setUserName: (userName: string) => void;
    personality: TeacherPersonality;
    setPersonality: (personality: TeacherPersonality) => void;
    studyMaterial: string;
    setStudyMaterial: (studyMaterial: string) => void;
    generationHistory: ChatHistoryType[];
    setGenerationHistory: (generationHistory: ChatHistoryType[]) => void;
    sidebar: SidebarType;
    setSidebar: SetSidebarType;
    currentSessionId: string | null;
    loadSession: (session: any) => void;
    setCurrentSessionId: (id: string | null) => void;
}

const PersonalizedLearningContext = createContext<PersonalizedLearningContextType>({
    introduction: {
        show: true,
        isLoading: false,
        actPage: 1,
        pages: {
            page1: {
                input: false,
                button: false,
                visited: false,
            },
            page2: {
                input: false,
                button: false,
                visited: false,
            },
            page3: {
                input: false,
                button: false,
                visited: false,
            },
        } as PagesType,
    },
    setIntroduction: () => {},
    studyPlatform: {
        show: false,
        isGettingModels: false,
        isGettingModulo: false,
        isLoading: false,
        actModule: 0,
        modulos: [] as ModuleType[],
    },
    setStudyPlatform: () => {},
    userName: '',
    setUserName: () => {},
    personality: 'Default',
    setPersonality: () => {},
    studyMaterial: '',
    setStudyMaterial: () => {},
    generationHistory: [] as ChatHistoryType[],
    setGenerationHistory: () => {},
    sidebar: {
        expanded: false,
    },
    setSidebar: () => {},
    currentSessionId: null,
    loadSession: () => {},
    setCurrentSessionId: () => {},
});

export const PersonalizedLearningProvider = ({ children }: { children: ReactNode }) => {
    const [introduction, setIntroduction] = useState<IntroductionType>(() => {
        const defaultIntroduction = {
            show: true,
            isLoading: false,
            actPage: 1,
            pages: {
                page1: { input: false, button: false, visited: false },
                page2: { input: false, button: false, visited: false },
                page3: { input: false, button: false, visited: false }
            }
        };

        if (typeof window === 'undefined') {
            return defaultIntroduction;
        }

        try {
            const localData = localStorage.getItem('personalized_learning_introduction');
            const parsed = localData ? JSON.parse(localData) : null;
            
            // Load from localStorage but force show: true to ensure introduction displays
            if (parsed && typeof parsed.show === 'boolean' && typeof parsed.actPage === 'number') {
                return {
                    ...parsed,
                    show: true, // Always show introduction on page load
                    isLoading: false // Ensure we're not stuck in loading state
                };
            }
        } catch (error) {
            console.warn('Error parsing localStorage data for introduction:', error);
        }
        
        return defaultIntroduction;
    });

    const [studyPlatform, setStudyPlatform] = useState<StudyPlatformType>(() => {
        const defaultStudyPlatform = {
            show: false,
            isGettingModels: false,
            isGettingModulo: false,
            isLoading: false,
            actModule: 0,
            modulos: []
        };

        if (typeof window === 'undefined') {
            return defaultStudyPlatform;
        }

        try {
            const localData = localStorage.getItem('personalized_learning_studyPlatform');
            const parsed = localData ? JSON.parse(localData) : null;
            
            // Load from localStorage but force show: false to ensure clean start
            if (parsed && typeof parsed.show === 'boolean' && Array.isArray(parsed.modulos)) {
                return {
                    ...parsed,
                    show: false, // Always hide study platform on page load
                    isLoading: false,
                    isGettingModels: false,
                    isGettingModulo: false
                };
            }
        } catch (error) {
            console.warn('Error parsing localStorage data for studyPlatform:', error);
        }
        
        return defaultStudyPlatform;
    });

    const [userName, setUserName] = useState<string>(() => {
        if (typeof window === 'undefined') {
            return '';
        }
        
        try {
            const localData = localStorage.getItem('personalized_learning_userName');
            return localData ? JSON.parse(localData) : '';
        } catch (error) {
            console.warn('Error parsing localStorage data for userName:', error);
            return '';
        }
    });

    const [personality, setPersonality] = useState<TeacherPersonality>(() => {
        if (typeof window === 'undefined') {
            return 'Default';
        }
        
        try {
            const localData = localStorage.getItem('personalized_learning_personality');
            return localData ? JSON.parse(localData) : 'Default';
        } catch (error) {
            console.warn('Error parsing localStorage data for personality:', error);
            return 'Default';
        }
    });

    const [studyMaterial, setStudyMaterial] = useState<string>(() => {
        if (typeof window === 'undefined') {
            return '';
        }
        
        try {
            const localData = localStorage.getItem('personalized_learning_studyMaterial');
            return localData ? JSON.parse(localData) : '';
        } catch (error) {
            console.warn('Error parsing localStorage data for studyMaterial:', error);
            return '';
        }
    });

    const [generationHistory, setGenerationHistory] = useState<ChatHistoryType[]>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        
        try {
            const localData = localStorage.getItem('personalized_learning_generationHistory');
            const parsed = localData ? JSON.parse(localData) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('Error parsing localStorage data for generationHistory:', error);
            return [];
        }
    });

    const [sidebar, setSidebar] = useState<SidebarType>(() => {
        if (typeof window === 'undefined') {
            return { expanded: false };
        }
        
        try {
            const localData = localStorage.getItem('personalized_learning_sidebar');
            return localData ? JSON.parse(localData) : { expanded: false };
        } catch (error) {
            console.warn('Error parsing localStorage data for sidebar:', error);
            return { expanded: false };
        }
    });

    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('personalized_learning_introduction', JSON.stringify(introduction));
    }, [introduction]);

    useEffect(() => {
        localStorage.setItem('personalized_learning_studyPlatform', JSON.stringify(studyPlatform));
    }, [studyPlatform]);

    useEffect(() => {
        localStorage.setItem('personalized_learning_userName', JSON.stringify(userName));
    }, [userName]);

    useEffect(() => {
        localStorage.setItem('personalized_learning_personality', JSON.stringify(personality));
    }, [personality]);

    useEffect(() => {
        localStorage.setItem('personalized_learning_studyMaterial', JSON.stringify(studyMaterial));
    }, [studyMaterial]);

    useEffect(() => {
        localStorage.setItem('personalized_learning_generationHistory', JSON.stringify(generationHistory));
    }, [generationHistory]);

    useEffect(() => {
        localStorage.setItem('personalized_learning_sidebar', JSON.stringify(sidebar));
    }, [sidebar]);

    const loadSession = (session: any) => {
        setStudyPlatform({
            show: true,
            isGettingModels: false,
            isGettingModulo: false,
            isLoading: false,
            actModule: 0,
            modulos: session.modules_data || [],
        });
        setPersonality(session.personality);
        setStudyMaterial(session.topic);
        setGenerationHistory(session.generation_history || []);
        setCurrentSessionId(session.id);
        setIntroduction({
            show: false,
            isLoading: false,
            actPage: 3,
            pages: {
                page1: { input: true, button: true, visited: true },
                page2: { input: true, button: true, visited: true },
                page3: { input: true, button: true, visited: true },
            },
        });
    };

    return (
        <PersonalizedLearningContext.Provider
            value={{
                introduction,
                setIntroduction,
                studyPlatform,
                setStudyPlatform,
                userName,
                setUserName,
                personality,
                setPersonality,
                studyMaterial,
                setStudyMaterial,
                generationHistory,
                setGenerationHistory,
                sidebar,
                setSidebar,
                currentSessionId,
                loadSession,
                setCurrentSessionId,
            }}
        >
            {children}
        </PersonalizedLearningContext.Provider>
    );
};

export const useAppContext = () => useContext(PersonalizedLearningContext);