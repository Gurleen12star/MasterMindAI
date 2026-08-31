'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "@/contexts/PersonalizedLearningContext";
import { addStoriesChat, generateModule, generateModules, pageTransition, pageVariants, resetContext, validateJSON } from "@/lib/personalized-learning/utilFunctions";
import { Button } from "@/components/ui/button";
import Typed from "typed.js";
import { AnimatePresence, motion } from "framer-motion";
import prompts from "@/lib/personalized-learning/prompts";
import interactionGemini from "@/lib/personalized-learning/geminiClient";
import { Award, ArrowLeft, ArrowRight, Lock, Unlock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StudyPlatformLoading = () => {
    const studyPlatformLoadingEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const typed = new Typed(studyPlatformLoadingEl.current, {
            strings: ['Fetching information...', 'Processing data...', 'Loading content...', 'Just a moment...'],
            typeSpeed: 50,
            showCursor: false,
            loop: true,
            backSpeed: 50,
        });

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full h-full min-h-[calc(100vh-65px)]">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div ref={studyPlatformLoadingEl} className="text-lg text-primary font-medium text-center min-h-[24px]" />
        </div>
    );
};

const StudyPlatformInitial = ({ handleGetModule }: { handleGetModule: () => Promise<void> }) => {
    const { setStudyPlatform } = useAppContext();

    return (
        <div className="flex flex-col items-center justify-center gap-10 w-full h-full min-h-[calc(100vh-65px)]">
            <Award className="h-24 w-24 text-primary" />
            <h2 className="text-4xl text-primary font-semibold text-center">Ready to Start</h2>

            <div className="text-lg text-muted-foreground text-center max-w-xl">
                Let's begin! Click the button below to access the first module of your personalized learning journey.
            </div>

            <Button
                variant="default"
                size="lg" 
                className="mt-4"
                onClick={() => {
                    handleGetModule();
                    setStudyPlatform(prevState => ({
                        ...prevState,
                        isGettingModels: false,
                        isGettingModulo: true,
                        isLoading: true,
                    }));
                }}
            >
                Start Learning
            </Button>
        </div>
    );
};

const StudyPlatform = () => {
    const { introduction, setIntroduction, personality, studyMaterial, generationHistory, setGenerationHistory, studyPlatform, setStudyPlatform } = useAppContext();
    const [modulo, setModulo] = useState<number>(studyPlatform.actModule);
    const [actualModuleRes, setActualModuleRes] = useState<string>("");
    const [timeModule, setTimeModule] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleGetModules = useCallback(async () => {
        if (!studyMaterial) return;

        let attempts = 0;
        while (attempts < 5) {
            try {
                const prompt = prompts.generateModules(studyMaterial);
                const response = await interactionGemini(prompt, personality);
                const responseText = response.text();
                console.log(responseText);

                if (validateJSON(responseText)) {
                    addStoriesChat(generationHistory, setGenerationHistory, prompt, response.text());
                    setActualModuleRes(response.text());
                    break;
                } else {
                    throw new SyntaxError("Invalid JSON response.");
                }
            } catch (error) {
                console.error(error);
                attempts++;
                await delay(1000);
            } finally {
                setIntroduction({ ...introduction, isLoading: false });
                setStudyPlatform({ ...studyPlatform, isGettingModels: true });
            }
        }
    }, [generationHistory, introduction, personality, setGenerationHistory, setIntroduction, setStudyPlatform, studyMaterial, studyPlatform]);

    const handleGetModule = useCallback(async () => {
        if (studyPlatform.modulos.length === 0) return;

        let attempts = 0;
        while (attempts < 5) {
            try {
                const prompt = prompts.generateModule(studyPlatform.modulos[studyPlatform.actModule]);
                const response = await interactionGemini(prompt, personality, generationHistory);
                const responseText = response.text();
                console.log(responseText);

                if (validateJSON(responseText)) {
                    generateModule(response.text(), studyPlatform, setStudyPlatform);
                    break;
                } else {
                    throw new SyntaxError("Invalid JSON response.");
                }
            } catch (error) {
                console.error(error);
                attempts++;
                await delay(1000);
            } finally {
                setStudyPlatform(prevState => ({
                    ...prevState,
                    isLoading: false,
                    isGettingModulo: false,
                }));
            }
        }
    }, [generationHistory, personality, setStudyPlatform, studyPlatform]);

    useEffect(() => {
        if (introduction.isLoading) {
            handleGetModules();
        }
    }, [handleGetModules, introduction.isLoading]);

    useEffect(() => {
        if (studyPlatform.isGettingModels && studyPlatform.show === false) {
            generateModules(actualModuleRes, studyPlatform, setStudyPlatform);
        }
    }, [actualModuleRes, generationHistory, setStudyPlatform, studyPlatform]);

    useEffect(() => {
        if (!studyPlatform.isGettingModulo && !studyPlatform.isLoading) {
            setTimeout(() => {
                setTimeModule(true);
            }, 2000);
        }
    }, [studyPlatform.isGettingModulo, studyPlatform.isLoading]);

    useEffect(() => {
        if (studyPlatform.actModule > modulo) {
            if (studyPlatform.modulos[studyPlatform.actModule].isOpen === false) {
                handleGetModule();
            }

            if (studyPlatform.modulos[studyPlatform.actModule] && studyPlatform.modulos[studyPlatform.actModule].content) {
                setModulo(studyPlatform.actModule);

                if (studyPlatform.modulos[studyPlatform.actModule].isOpen === true) {
                    setStudyPlatform(prevState => ({ ...prevState, isLoading: false, isGettingModulo: false }));
                }
            }
        } else if (studyPlatform.actModule < modulo) {
            if (studyPlatform.modulos[studyPlatform.actModule] && studyPlatform.modulos[studyPlatform.actModule].content) {
                setModulo(studyPlatform.actModule);
                setStudyPlatform(prevState => ({ ...prevState, isLoading: false, isGettingModulo: false }));
            }
        }
    }, [handleGetModule, modulo, setStudyPlatform, studyPlatform.actModule, studyPlatform.modulos]);

    return (
        <div className="flex h-full min-h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out pt-16`}>
                <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Learning Modules</h3>
                        <div className="space-y-1">
                            {studyPlatform.modulos.map((modulo, index) => (
                                <button
                                    key={index}
                                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${studyPlatform.actModule === index ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'} transition-colors ${!modulo.isOpen ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                    disabled={!modulo.isOpen}
                                    onClick={() => {
                                        if (!modulo.isOpen) return;
                                        setStudyPlatform(prevState => ({
                                            ...prevState,
                                            actModule: index,
                                            isGettingModulo: true,
                                            isLoading: true,
                                        }));
                                        setSidebarOpen(false);
                                    }}
                                >
                                    {modulo.isOpen ? <Unlock className="h-4 w-4 mr-2 shrink-0" /> : <Lock className="h-4 w-4 mr-2 shrink-0" />}
                                    <span className="truncate">{modulo.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                        <button 
                            className="flex items-center w-full px-3 py-2 text-sm rounded-md bg-muted hover:bg-primary/10 transition-colors"
                            onClick={() => resetContext(setIntroduction, setStudyPlatform)}
                        >
                            <Award className="h-4 w-4 mr-2" />
                            <span>Change Topic</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 lg:ml-64 pb-10">
                {/* Header */}
                <div className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur">
                    <div className="flex items-center">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="lg:hidden mr-2"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                        </Button>
                        <h2 className="text-lg font-semibold">
                            {studyPlatform.modulos[studyPlatform.actModule]?.title || "Personalized Learning"}
                        </h2>
                    </div>
                </div>
                
                {/* Content */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key="study-platform-content"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants(2)}
                        transition={pageTransition(2)}
                        className="p-6"
                    >
                        {studyPlatform.isLoading ? (
                            <StudyPlatformLoading />
                        ) : (studyPlatform.isGettingModels ? (
                            <StudyPlatformInitial handleGetModule={handleGetModule} />
                        ) : (
                            <div className="max-w-4xl mx-auto">
                                <Card className="mb-8">
                                    <CardContent className="p-6">
                                        {studyPlatform.modulos[studyPlatform.actModule] && 
                                         studyPlatform.modulos[studyPlatform.actModule].content && 
                                         studyPlatform.modulos[studyPlatform.actModule].content.map((item, index) => {
                                            const key = `modulo-${studyPlatform.actModule}-content-${index}`;
                                            const htmlContent = item.html;
                                            
                                            if (htmlContent.includes('<!DOCTYPE>') || htmlContent.includes('<!DOCTYPE html>')) {
                                                return (
                                                    <iframe
                                                        key={key}
                                                        srcDoc={htmlContent}
                                                        title={key}
                                                        className="mb-8 w-full h-[500px] border-none"
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <div
                                                        key={key}
                                                        className="mb-8 prose prose-gray dark:prose-invert max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                                                    />
                                                );
                                            }
                                        })}
                                    </CardContent>
                                </Card>
                                
                                <div className="flex items-center justify-between gap-4 mt-8">
                                    <Button
                                        variant="outline"
                                        className={`${modulo === 0 ? "invisible" : ""}`}
                                        onClick={() => {
                                            setStudyPlatform(prevState => ({
                                                ...prevState,
                                                actModule: prevState.actModule - 1,
                                                isGettingModulo: true,
                                                isLoading: true,
                                            }));
                                        }}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Previous
                                    </Button>

                                    <Button
                                        variant="default"
                                        disabled={!timeModule}
                                        onClick={() => {
                                            if (modulo === (studyPlatform.modulos.length - 1)) {
                                                resetContext(setIntroduction, setStudyPlatform);
                                                return;
                                            }

                                            setStudyPlatform(prevState => ({
                                                ...prevState,
                                                actModule: prevState.actModule + 1,
                                                isGettingModulo: true,
                                                isLoading: true,
                                            }));
                                        }}
                                    >
                                        {modulo === (studyPlatform.modulos.length - 1) ? (
                                            <>
                                                New Topic
                                                <Award className="h-4 w-4 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                Next
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Overlay for sidebar on mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default StudyPlatform;