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
    initialConvoMessage: string | null;
    setInitialConvoMessage: (message: string | null) => void;
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
    initialConvoMessage: null,
    setInitialConvoMessage: () => {},
});

export const PersonalizedLearningProvider = ({ children }: { children: ReactNode }) => {
    const [introduction, setIntroduction] = useState<IntroductionType>(() => {
        let localData = null;
        if (typeof window !== 'undefined') {
            localData = localStorage.getItem('personalized_learning_introduction');
        }
        return localData ? JSON.parse(localData) : { show: true, isLoading: false, actPage: 1, pages: { page1: { input: false, button: false, visited: false }, page2: { input: false, button: false, visited: false }, page3: { input: false, button: false, visited: false } } };
    });
    const [studyPlatform, setStudyPlatform] = useState<StudyPlatformType>(() => {
        let localData = null;
        if (typeof window !== 'undefined') {
            localData = localStorage.getItem('personalized_learning_studyPlatform');
        }
        return localData ? JSON.parse(localData) : { show: false, isGettingModels: false, isGettingModulo: false, isLoading: false, actModule: 0, modulos: [] };
    });
    const [userName, setUserName] = useState<string>(() => {
        let localData = null;
        if (typeof window !== 'undefined') {
            localData = localStorage.getItem('personalized_learning_userName');
        }
        return localData ? JSON.parse(localData) : '';
    });
    const [personality, setPersonality] = useState<TeacherPersonality>(() => {
        let localData = null;
        if (typeof window !== 'undefined') {
            localData = localStorage.getItem('personalized_learning_personality');
        }
        return localData ? JSON.parse(localData) : 'Default';
    });
    const [studyMaterial, setStudyMaterial] = useState<string>(() => {
        let localData = null;
        if (typeof window !== 'undefined') {
            localData = localStorage.getItem('personalized_learning_studyMaterial');
        }
        return localData ? JSON.parse(localData) : '';
    });
    const [generationHistory, setGenerationHistory] = useState<ChatHistoryType[]>(() => {
        let localData = null;
        if (typeof window !== 'undefined') {
            localData = localStorage.getItem('personalized_learning_generationHistory');
        }
        return localData ? JSON.parse(localData) : [];
    });
    const [sidebar, setSidebar] = useState<SidebarType>(() => {
        let localData = null;
        if (typeof window !== 'undefined') {
            localData = localStorage.getItem('personalized_learning_sidebar');
        }
        return localData ? JSON.parse(localData) : { expanded: false };
    });
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [initialConvoMessage, setInitialConvoMessage] = useState<string | null>(null);

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
                initialConvoMessage,
                setInitialConvoMessage,
            }}
        >
            {children}
        </PersonalizedLearningContext.Provider>
    );
};

export const useAppContext = () => useContext(PersonalizedLearningContext);