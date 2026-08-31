'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/PersonalizedLearningContext";
import { addStoriesChat, generateModule, generateModules, pageTransition, pageVariants, resetContext, validateJSON } from "@/lib/personalized-learning/utilFunctions";
import { Button } from "@/components/ui/button";
import Typed from "typed.js";
import { AnimatePresence, motion } from "framer-motion";
import prompts from "@/lib/personalized-learning/prompts";
import interactionGemini from "@/lib/personalized-learning/geminiClient";
import { Award, ArrowLeft, ArrowRight, Loader2, Copy, SendToBack, BoxSelect as SelectAll, MessageSquare, Expand } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/SupabaseAuthProvider";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ExpandedContent {
  originalText: string;
  expandedText: string | null;
  isLoading: boolean;
  id: string; // Unique ID for rendering
}

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
    const { introduction, setIntroduction, personality, studyMaterial, generationHistory, setGenerationHistory, studyPlatform, setStudyPlatform, currentSessionId, setCurrentSessionId } = useAppContext();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null);
    const [selectedText, setSelectedText] = useState<string>("");
    const [modulo, setModulo] = useState<number>(studyPlatform.actModule);
    const [actualModuleRes, setActualModuleRes] = useState<string>("");
    const [timeModule, setTimeModule] = useState<boolean>(false);
    const [expansions, setExpansions] = useState<ExpandedContent[]>([]); // New state for expanded content

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            setSelectedText(selection.toString());
        }
    };

    const handleCopyText = () => {
        if (selectedText) {
            navigator.clipboard.writeText(selectedText);
            toast({
                title: "Copied to clipboard",
                description: "Selected text has been copied",
            });
        }
    };

    const handleSelectAll = () => {
        if (contentRef.current) {
            const range = document.createRange();
            range.selectNodeContents(contentRef.current);
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
                setSelectedText(selection.toString());
            }
        }
    };

    const handleSendToConvoAI = () => {
        if (selectedText) {
            localStorage.setItem("convoAiContext", selectedText);
            toast({
                title: "Text sent to Convo AI",
                description: "Navigating to Convo AI page...",
            });
            navigate("/dashboard/convo-ai");
        }
    };

    const handleExpandText = async () => {
        if (!selectedText) return;

        const newExpansionId = `exp-${Date.now()}`;
        setExpansions(prev => [...prev, { id: newExpansionId, originalText: selectedText, expandedText: null, isLoading: true }]);

        try {
            const { data, error } = await supabase.functions.invoke('expand-content', {
                body: { textToExpand: selectedText },
            });

            if (error) throw error;
            if (!data || !data.expandedText) throw new Error("No expanded text received.");

            setExpansions(prev => prev.map(exp => 
                exp.id === newExpansionId ? { ...exp, expandedText: data.expandedText, isLoading: false } : exp
            ));
            toast({
                title: "Text Expanded",
                description: "Detailed explanation generated.",
            });
        } catch (error) {
            console.error("Error expanding text:", error);
            setExpansions(prev => prev.map(exp => 
                exp.id === newExpansionId ? { ...exp, expandedText: "Failed to expand text.", isLoading: false } : exp
            ));
            toast({
                title: "Expansion Failed",
                description: error instanceof Error ? error.message : "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setSelectedText(""); // Clear selection after action
        }
    };

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
                    
                    if (user?.id) {
                        try {
                            const { data: existingSession, error: fetchError } = await supabase
                                .from('personalized_learning_sessions')
                                .select('id')
                                .eq('user_id', user.id)
                                .eq('topic', studyMaterial)
                                .eq('personality', personality)
                                .maybeSingle();

                            if (existingSession && !fetchError) {
                                setCurrentSessionId(existingSession.id);
                            } else {
                                const { data, error } = await supabase
                                    .from('personalized_learning_sessions')
                                    .insert({
                                        user_id: user.id,
                                        topic: studyMaterial,
                                        personality: personality,
                                        modules_data: [],
                                        generation_history: generationHistory,
                                    })
                                    .select()
                                    .single();
                                if (data && !error) {
                                    setCurrentSessionId(data.id);
                                }
                            }
                        } catch (dbError) {
                            console.error('Error saving session to database:', dbError);
                        }
                    }
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
    }, [generationHistory, introduction, personality, setGenerationHistory, setIntroduction, setStudyPlatform, studyMaterial, studyPlatform, user?.id, setCurrentSessionId]);

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
                    
                    if (user?.id && currentSessionId) {
                        try {
                            await supabase
                                .from('personalized_learning_sessions')
                                .update({
                                    modules_data: studyPlatform.modulos,
                                    generation_history: generationHistory,
                                })
                                .eq('id', currentSessionId);
                        } catch (dbError) {
                            console.error('Error updating session in database:', dbError);
                        }
                    }
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
    }, [generationHistory, personality, setStudyPlatform, studyPlatform, user?.id, currentSessionId]);

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
                            <Card className="mb-6 bg-[#2A2B32] border-0 rounded-xl">
                                <ScrollArea className="h-[calc(100vh-250px)]">
                                    <CardContent className="p-6 studyPlatform-content">
                                        {studyPlatform.modulos[studyPlatform.actModule] && 
                                         studyPlatform.modulos[studyPlatform.actModule].content && 
                                         <ContextMenu>
                                             <ContextMenuTrigger>
                                                 <div
                                                     ref={contentRef}
                                                     className="studyPlatform-content-wrapper"
                                                     onMouseUp={handleSelection}
                                                     onMouseDown={() => setSelectedText("")}
                                                 >
                                                     {studyPlatform.modulos[studyPlatform.actModule].content.map((item, index) => {
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
                                                 </div>
                                             </ContextMenuTrigger>
                                             {selectedText && (
                                                 <ContextMenuContent>
                                                     <ContextMenuItem onClick={handleCopyText} className="gap-2">
                                                         <Copy className="h-4 w-4" />
                                                         Copy
                                                     </ContextMenuItem>
                                                     <ContextMenuItem onClick={handleSelectAll} className="gap-2">
                                                         <SelectAll className="h-4 w-4" />
                                                         Select All
                                                     </ContextMenuItem>
                                                     <ContextMenuItem onClick={handleSendToConvoAI} className="gap-2">
                                                         <MessageSquare className="h-4 w-4" />
                                                         Send to Convo AI
                                                     </ContextMenuItem>
                                                     <ContextMenuItem onClick={handleExpandText} className="gap-2">
                                                         <Expand className="h-4 w-4" />
                                                         Expand
                                                     </ContextMenuItem>
                                                 </ContextMenuContent>
                                             )}
                                         </ContextMenu>}
                                    </CardContent>
                                </ScrollArea>
                            </Card>
                            
                            {/* Render Expanded Content */}
                            {expansions.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    <h3 className="text-lg font-semibold">Expanded Content</h3>
                                    {expansions.map((exp) => (
                                        <details key={exp.id} className="group rounded-lg border bg-[#2A2B32] p-4">
                                            <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                                                Original: "{exp.originalText.substring(0, 50)}..."
                                                {exp.isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                                            </summary>
                                            <div className="prose prose-neutral dark:prose-invert mt-4 max-w-none text-muted-foreground">
                                                {exp.expandedText ? (
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {exp.expandedText}
                                                    </ReactMarkdown>
                                                ) : (
                                                    !exp.isLoading && <p>No expanded content available.</p>
                                                )}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between gap-4">
                                <Button
                                    variant="outline"
                                    className={`${modulo === 0 ? "invisible" : ""} bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg`}
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
                                    className="bg-white text-black hover:bg-gray-200 rounded-lg"
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