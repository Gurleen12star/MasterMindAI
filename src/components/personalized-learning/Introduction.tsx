'use client';

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import Typed from "typed.js";
import { useAppContext } from "@/contexts/PersonalizedLearningContext";
import { pageTransition, pageVariants } from "@/lib/personalized-learning/utilFunctions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Briefcase, 
  MessageSquare, 
  Sparkles, 
  FlaskConical, 
  Scale,
  ArrowLeft,
  ArrowRight,
  Rocket
} from "lucide-react";

const Introduction = () => {
    const { 
        introduction, 
        setIntroduction, 
        userName, 
        setUserName, 
        personality, 
        setPersonality, 
        studyMaterial, 
        setStudyMaterial 
    } = useAppContext();
    
    const greetingEl = useRef<HTMLSpanElement>(null);
    const questionEl = useRef<HTMLDivElement>(null);
    const topicQuestionEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (introduction.actPage === 1 && !introduction.pages.page1.visited) {
            const typed = new Typed(greetingEl.current, {
                strings: [`Nice to meet you ${userName}.`],
                typeSpeed: 50,
                showCursor: false,
                onComplete: () => {
                    setTimeout(() => {
                        const typed2 = new Typed(questionEl.current, {
                            strings: ['What kind of teaching personality would you prefer?'],
                            typeSpeed: 50,
                            showCursor: false,
                            onComplete: () => {
                                setIntroduction(prevState => ({
                                    ...prevState,
                                    pages: {
                                        ...prevState.pages,
                                        page1: {
                                            ...prevState.pages.page1,
                                            input: true,
                                            visited: true,
                                        },
                                    },
                                }));
                            },
                        });
                    }, 500);
                },
            });

            return () => {
                typed.destroy();
            };
        }
    }, [introduction.actPage, introduction.pages.page1.visited, setIntroduction, userName]);

    useEffect(() => {
        if (introduction.actPage === 3 && !introduction.pages.page3.visited) {
            const typed = new Typed(topicQuestionEl.current, {
                strings: [
                    'Now, share with me: what topic would you like to explore?',
                    "I'm here to guide you on this learning journey.",
                    'Please be concise. For example, you could say:',
                ],
                typeSpeed: 50,
                showCursor: false,
                onComplete: () => {
                    setIntroduction(prevState => ({
                        ...prevState,
                        pages: {
                            ...prevState.pages,
                            page3: {
                                ...prevState.pages.page3,
                                input: true,
                                visited: true,
                            },
                        },
                    }));
                },
            });

            return () => {
                typed.destroy();
            };
        }
    }, [introduction.actPage, introduction.pages.page3.visited, setIntroduction]);

    const handlePersonalitySelect = (selectedPersonality: string) => {
        setPersonality(selectedPersonality);
        setIntroduction(prevState => ({
            ...prevState,
            pages: {
                ...prevState.pages,
                page1: {
                    ...prevState.pages.page1,
                    button: true,
                },
            },
        }));
    };

    const handleNext = () => {
        if (introduction.actPage === 1) {
            setIntroduction(prevState => ({
                ...prevState,
                actPage: 2,
            }));
        } else if (introduction.actPage === 2) {
            setIntroduction(prevState => ({
                ...prevState,
                actPage: 3,
            }));
        } else if (introduction.actPage === 3) {
            setIntroduction(prevState => ({
                ...prevState,
                show: false,
                isLoading: true,
            }));
        }
    };

    const handleBack = () => {
        if (introduction.actPage === 2) {
            setIntroduction(prevState => ({
                ...prevState,
                actPage: 1,
            }));
        } else if (introduction.actPage === 3) {
            setIntroduction(prevState => ({
                ...prevState,
                actPage: 2,
            }));
        }
    };

    const personalityOptions = [
        {
            id: 'Formal',
            name: 'Formal',
            icon: Briefcase,
            description: 'Professional and structured approach'
        },
        {
            id: 'Informal',
            name: 'Informal',
            icon: MessageSquare,
            description: 'Casual and conversational style'
        },
        {
            id: 'Engraçado',
            name: 'Playful',
            icon: Sparkles,
            description: 'Fun and engaging learning'
        },
        {
            id: 'Sério',
            name: 'Serious',
            icon: FlaskConical,
            description: 'Direct and focused approach'
        },
        {
            id: 'Default',
            name: 'Balanced',
            icon: Scale,
            description: 'Adaptive teaching style'
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <AnimatePresence mode='popLayout'>
                {/* Page 1: Name Input and Personality Selection */}
                {introduction.actPage === 1 && (
                    <motion.div
                        key="page1"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants(2)}
                        transition={pageTransition(1.5)}
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-8 text-center">
                                {/* Header */}
                                <div className="mb-8">
                                    <Brain className="h-16 w-16 mx-auto text-primary mb-4" />
                                    <h1 className="text-3xl font-bold mb-2">Personalized Learning</h1>
                                    <p className="text-muted-foreground">Create customized learning experiences powered by AI</p>
                                </div>

                                {/* Name Input */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium mb-3">What's your name?</label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="max-w-md mx-auto text-center"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && userName.trim()) {
                                                setIntroduction(prevState => ({
                                                    ...prevState,
                                                    pages: {
                                                        ...prevState.pages,
                                                        page1: {
                                                            ...prevState.pages.page1,
                                                            visited: true,
                                                        },
                                                    },
                                                }));
                                            }
                                        }}
                                    />
                                </div>

                                {/* Dynamic Greeting */}
                                {userName.trim() && (
                                    <div className="mb-8 space-y-4">
                                        <div className="text-lg">
                                            <span ref={greetingEl} className="text-primary font-medium"></span>
                                        </div>
                                        <div ref={questionEl} className="text-muted-foreground"></div>
                                    </div>
                                )}

                                {/* Personality Selection */}
                                {introduction.pages.page1.input && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                            {personalityOptions.map((option) => {
                                                const IconComponent = option.icon;
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handlePersonalitySelect(option.id)}
                                                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                                                            personality === option.id
                                                                ? 'border-primary bg-primary/10 shadow-lg'
                                                                : 'border-border hover:border-primary/50'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col items-center space-y-2">
                                                            <div className={`p-3 rounded-full ${
                                                                personality === option.id
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-muted text-muted-foreground'
                                                            }`}>
                                                                <IconComponent className="h-6 w-6" />
                                                            </div>
                                                            <span className="font-medium text-sm">{option.name}</span>
                                                            <span className="text-xs text-muted-foreground text-center leading-tight">
                                                                {option.description}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {introduction.pages.page1.button && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="flex justify-center pt-4"
                                            >
                                                <Button
                                                    onClick={handleNext}
                                                    className="gap-2 px-8 py-3"
                                                    size="lg"
                                                >
                                                    Next
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Page 2: Confirmation */}
                {introduction.actPage === 2 && (
                    <motion.div
                        key="page2"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants(2)}
                        transition={pageTransition(1.5)}
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-8 text-center">
                                <div className="mb-8">
                                    <Rocket className="h-16 w-16 mx-auto text-primary mb-4" />
                                    <h2 className="text-3xl font-bold text-primary mb-2">Excellent!</h2>
                                    <p className="text-muted-foreground">Your learning preferences have been set</p>
                                </div>

                                <div className="bg-muted/30 rounded-lg p-6 mb-8">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Student:</span>
                                            <p className="font-semibold text-lg">{userName}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Teaching Style:</span>
                                            <div className="flex items-center justify-center gap-2 mt-1">
                                                {(() => {
                                                    const selected = personalityOptions.find(p => p.id === personality);
                                                    const IconComponent = selected?.icon || Brain;
                                                    return (
                                                        <>
                                                            <div className="p-2 rounded-full bg-primary text-primary-foreground">
                                                                <IconComponent className="h-4 w-4" />
                                                            </div>
                                                            <span className="font-semibold">{selected?.name}</span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={handleBack} className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button onClick={handleNext} className="gap-2">
                                        Continue
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Page 3: Topic Input */}
                {introduction.actPage === 3 && (
                    <motion.div
                        key="page3"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants(2)}
                        transition={pageTransition(1.5)}
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-8 text-center">
                                <div className="mb-8">
                                    <Rocket className="h-16 w-16 mx-auto text-primary mb-4" />
                                    <h2 className="text-3xl font-bold text-primary mb-2">Excellent!</h2>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div ref={topicQuestionEl} className="text-lg text-muted-foreground min-h-[24px]"></div>
                                    
                                    {introduction.pages.page3.input && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="space-y-4"
                                        >
                                            <div className="text-sm text-muted-foreground font-mono bg-muted/30 rounded-lg p-4">
                                                'Ancient Egypt', 'Moon Landing', 'Brazilian History' and so on.
                                            </div>
                                            
                                            <Input
                                                type="text"
                                                placeholder="e.g., Indian history"
                                                value={studyMaterial}
                                                onChange={(e) => {
                                                    setStudyMaterial(e.target.value);
                                                    setIntroduction(prevState => ({
                                                        ...prevState,
                                                        pages: {
                                                            ...prevState.pages,
                                                            page3: {
                                                                ...prevState.pages.page3,
                                                                button: e.target.value.trim().length > 0,
                                                            },
                                                        },
                                                    }));
                                                }}
                                                className="max-w-md mx-auto text-center text-lg py-3"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && studyMaterial.trim()) {
                                                        handleNext();
                                                    }
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={handleBack} className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    
                                    {introduction.pages.page3.button && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Button 
                                                onClick={handleNext}
                                                className="gap-2 px-8 py-3"
                                                size="lg"
                                            >
                                                Start Learning
                                                <Rocket className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Introduction;