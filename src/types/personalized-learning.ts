import { Dispatch, SetStateAction } from "react";

export type PageType = {
    input: boolean;
    button: boolean;
    visited: boolean;
};

export type PagesType = {
    [key: string]: PageType;
};

export type IntroductionType = {
    show: boolean;
    isLoading: boolean;
    actPage: number;
    pages: PagesType;
};

export type SetIntroductionType = Dispatch<SetStateAction<IntroductionType>>;

export type ModuleContentType = {
    html: string;
};

export type ModuleType = {
    title: string;
    description: string;
    content: ModuleContentType[];
    isOpen: boolean;
    audioUrl?: string;
    chatHistory: ChatHistoryType[];
};

export type StudyPlatformType = {
    show: boolean;
    isGettingModels: boolean;
    isGettingModulo: boolean;
    isLoading: boolean;
    actModule: number;
    modulos: ModuleType[];
};

export type SetStudyPlatformType = Dispatch<SetStateAction<StudyPlatformType>>;

export type SidebarType = {
    expanded: boolean;
};

export type SetSidebarType = Dispatch<SetStateAction<SidebarType>>;

export type ChatHistoryType = {
    role: 'user' | 'model';
    parts: { text: string }[];
};

export type TeacherPersonality = "Formal" | "Informal" | "Engraçado" | "Sério" | "Default";