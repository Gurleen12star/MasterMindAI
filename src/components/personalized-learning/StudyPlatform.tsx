'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "@/contexts/PersonalizedLearningContext";
import { addStoriesChat, generateModule, generateModules, pageTransition, pageVariants, resetContext, validateJSON } from "@/lib/personalized-learning/utilFunctions";
import { Button } from "@/components/ui/button";
import Typed from "typed.js";
import { AnimatePresence, motion } from "framer-motion";
import prompts from "@/lib/personalized-learning/prompts";
import interactionGemini from "@/lib/personalized-learning/geminiClient";
import { Award, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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
        <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div ref={studyPlatformLoadingEl} className="text-lg text-primary font-medium text-center min-h-[24px]" />
        </div>
    );
};

const StudyPlatformInitial = ({ handleGetModule }: { handleGetModule: () => Promise<void> }) => {
    const { setStudyPlatform } = useAppContext();

    return (
        <div className="flex flex-col items-center justify-center gap-6 w-full min-h-[400px] py-8">
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
        <div className="w-full h-full">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key="study-platform-content"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants(2)}
                        transition={pageTransition(2)}
                        className="w-full h-full"
                    >
                        {studyPlatform.isLoading ? (
                            <StudyPlatformLoading />
                        ) : (studyPlatform.isGettingModels ? (
                            <StudyPlatformInitial handleGetModule={handleGetModule} />
                        ) : (
                            <div className="w-full">
                                {/* Module Content */}
                                <Card className="mb-6">
                                    <CardContent className="p-6 studyPlatform-content">
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
                                                        className="mb-6 w-full h-[400px] border-none rounded-lg"
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <div
                                                        key={key}
                                                        className="mb-4"
                                                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                                                    />
                                                );
                                            }
                                        })}
                                    </CardContent>
                                </Card>
                                
                                {/* Navigation */}
                                <div className="flex items-center justify-between gap-4">
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
    );
};

export default StudyPlatform;