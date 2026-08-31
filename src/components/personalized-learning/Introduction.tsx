'use client';

import React, { useRef, useState } from "react";
import { useAppContext } from "@/contexts/PersonalizedLearningContext";
import { AnimatePresence, motion } from 'framer-motion';
import Typed from "typed.js";
import { pageTransition, pageVariants } from "@/lib/personalized-learning/utilFunctions";
import { TeacherPersonality } from "@/types/personalized-learning";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { School, Book, Rocket } from "lucide-react";

const CustomRadio = (props: any) => {
    const { children, value, icon: Icon, labelText, ...otherProps } = props;

    return (
        <div className="flex flex-col items-center justify-center group">
            <Label
                htmlFor={`radio-${value}`}
                className="flex flex-col items-center justify-center p-6 cursor-pointer rounded-xl border-2 border-border/50 hover:border-primary/60 transition-all duration-200 group-has-[[data-state=checked]]:bg-primary/20 group-has-[[data-state=checked]]:border-primary/80 group-has-[[data-state=checked]]:shadow-lg group-has-[[data-state=checked]]:shadow-primary/20 hover:transform hover:scale-105 transition-transform"
            >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-2 shadow-inner-modern">
                    <Icon className="h-8 w-8 text-primary" />
                </div>
                <RadioGroupItem value={value} id={`radio-${value}`} className="opacity-0 absolute" {...otherProps} />
                <span className="block text-center font-semibold mt-2 mb-2">{labelText}</span>
                {children}
            </Label>
        </div>
    );
};

const Introduction = () => {
    const { introduction, setIntroduction, userName, setUserName, personality, setPersonality, studyMaterial, setStudyMaterial } = useAppContext();
    const [page, setPage] = useState<number>(introduction.actPage);
    
    const page1El = useRef<HTMLDivElement>(null);
    const page2El = useRef<HTMLDivElement>(null);
    const page3El = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full">
            <div className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4 w-full min-h-[500px]">
                <AnimatePresence mode='popLayout'>
                    <motion.div
                        key="introduction-logo"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants(2)}
                        transition={pageTransition(2)}
                    >
                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl transform scale-150 opacity-70"></div>
                                <School className="h-20 w-20 text-primary mx-auto mb-2 relative z-10" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Personalized Learning</h2>
                        </div>
                    </motion.div>

                    {page === 1 && (
                        <motion.div
                            key="page1"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants(2, 1)}
                            transition={pageTransition(2)}
                            onAnimationStart={() => {
                                if (introduction.pages.page1.visited && userName) {
                                    if (userName.length < 3) {
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            pages: {
                                                ...prevState.pages,
                                                page1: {
                                                    ...prevState.pages.page1,
                                                    button: false,
                                                },
                                            },
                                        }));
                                        return;
                                    }

                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page1: {
                                                input: true,
                                                button: true,
                                                visited: true,
                                            },
                                        },
                                    }));
                                } else if (!introduction.pages.page1.visited && !userName) {
                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page1: {
                                                ...prevState.pages.page1,
                                                input: false,
                                            },
                                        },
                                    }));
                                } else {
                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page1: {
                                                ...prevState.pages.page1,
                                                input: false,
                                            },
                                        },
                                    }));
                                }
                            }}
                            onAnimationComplete={() => {
                                if (introduction.pages.page1.visited) return;

                                new Typed(page1El.current, {
                                    strings: ['I am Gemini, and I will be your teacher during your learning journey. <br/>I\'m here to help you. But first, what should I call you?'],
                                    typeSpeed: 25,
                                    startDelay: 500,
                                    showCursor: false,
                                    onComplete: () => {
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            pages: {
                                                ...prevState.pages,
                                                page1: {
                                                    ...prevState.pages.page1,
                                                    input: true,
                                                },
                                            },
                                        }));
                                    }
                                });
                            }}
                            className="flex flex-col items-center justify-between gap-5 w-full"
                        >
                            <h2 className="text-3xl md:text-4xl font-semibold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Hello</h2>

                            {introduction.pages.page1.visited ? (
                                <div className="text-[16px] text-foreground text-center">I am Gemini, and I will be your teacher during your learning journey. <br />I'm here to help you. But first, what should I call you?</div>
                            ) : (
                                <div ref={page1El} className="text-[16px] text-foreground text-center" />
                            )}

                            {introduction.pages.page1.input && (
                                <motion.div
                                    key="introduction-page-1-input"
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants(2, 1)}
                                    transition={pageTransition(2)}
                                    onAnimationStart={() => {
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            pages: {
                                                ...prevState.pages,
                                                page1: {
                                                    ...prevState.pages.page1,
                                                    button: false,
                                                },
                                            },
                                        }));
                                    }}
                                    onAnimationComplete={() => {
                                        if (userName.length > 2) {
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
                                        }
                                    }}
                                    className="flex items-center justify-center w-full"
                                >
                                    <Input
                                        placeholder="Enter your name"
                                        className="max-w-[300px] rounded-xl shadow-lg border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                        value={userName}
                                        onChange={(e) => {
                                            if (e.target.value.length > 2) {
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
                                            } else {
                                                setIntroduction(prevState => ({
                                                    ...prevState,
                                                    pages: {
                                                        ...prevState.pages,
                                                        page1: {
                                                            ...prevState.pages.page1,
                                                            button: false,
                                                        },
                                                    },
                                                }));
                                            }
                                            setUserName(e.target.value);
                                        }}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {page === 2 && (
                        <motion.div
                            key="page2"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants(2, 1)}
                            transition={pageTransition(2)}
                            onAnimationStart={() => {
                                if (introduction.pages.page2.visited && personality) {
                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page2: {
                                                input: true,
                                                button: true,
                                                visited: true,
                                            },
                                        }
                                    }));
                                }

                                if (!introduction.pages.page2.visited && !personality) {
                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page2: {
                                                ...prevState.pages.page2,
                                                input: false,
                                            },
                                        },
                                    }));
                                }

                                if (!introduction.pages.page2.visited && personality) {
                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page2: {
                                                ...prevState.pages.page2,
                                                visited: true,
                                            },
                                        },
                                    }));
                                }
                            }}
                            onAnimationComplete={() => {
                                if (introduction.pages.page2.visited) return;

                                new Typed(page2El.current, {
                                    strings: [`Nice to meet you <span class="text-primary font-bold">${userName}</span>. <br/>What kind of teaching personality would you prefer?`],
                                    typeSpeed: 25,
                                    showCursor: false,
                                    onComplete: () => {
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            pages: {
                                                ...prevState.pages,
                                                page2: {
                                                    ...prevState.pages.page2,
                                                    input: true,
                                                },
                                            },
                                        }));
                                    }
                                });
                            }}
                            className="flex flex-col items-center justify-between gap-12 w-full"
                        >
                            {introduction.pages.page2.visited ? (
                                <div className="text-[16px] text-foreground text-center">Nice to meet you <span className="text-primary font-bold">{userName}</span>. <br />What kind of teaching personality would you prefer?</div>
                            ) : (
                                <div ref={page2El} className="text-[16px] text-foreground text-center" />
                            )}

                            {introduction.pages.page2.input && (
                                <motion.div
                                    key="introduction-page-2-radio"
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants(2, 1)}
                                    transition={pageTransition(2)}
                                    onAnimationStart={() => {
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            pages: {
                                                ...prevState.pages,
                                                page2: {
                                                    ...prevState.pages.page2,
                                                    button: false,
                                                },
                                            },
                                        }));
                                    }}
                                    onAnimationComplete={() => {
                                        if (personality) {
                                            setIntroduction(prevState => ({
                                                ...prevState,
                                                pages: {
                                                    ...prevState.pages,
                                                    page2: {
                                                        ...prevState.pages.page2,
                                                        button: true,
                                                    },
                                                },
                                            }));
                                        }
                                    }}
                                    className="flex items-center justify-center w-full"
                                >
                                    <div className="w-full max-w-xl">
                                        <RadioGroup
                                            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5"
                                            value={personality}
                                            onValueChange={(value) => {
                                                setIntroduction(prevState => ({
                                                    ...prevState,
                                                    pages: {
                                                        ...prevState.pages,
                                                        page2: {
                                                            ...prevState.pages.page2,
                                                            button: true,
                                                        },
                                                    },
                                                }));
                                                setPersonality(value as TeacherPersonality);
                                            }}
                                        >
                                            <CustomRadio value="Formal" icon={Book} labelText="Formal" />
                                            <CustomRadio value="Informal" icon={Book} labelText="Informal" />
                                            <CustomRadio value="Engraçado" icon={Book} labelText="Playful" />
                                            <CustomRadio value="Sério" icon={Book} labelText="Serious" />
                                            <CustomRadio value="Default" icon={Book} labelText="Balanced" />
                                        </RadioGroup>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {page === 3 && (
                        <motion.div
                            key="page3"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants(2, 1)}
                            transition={pageTransition(2)}
                            onAnimationStart={() => {
                                if (introduction.pages.page3.visited && studyMaterial) {
                                    if (studyMaterial.length < 5) {
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            pages: {
                                                ...prevState.pages,
                                                page3: {
                                                    ...prevState.pages.page3,
                                                    button: false,
                                                },
                                            },
                                        }));

                                        return;
                                    }

                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page3: {
                                                input: true,
                                                button: true,
                                                visited: true,
                                            },
                                        },
                                    }));
                                }

                                if (!introduction.pages.page3.visited && !studyMaterial) {
                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page3: {
                                                ...prevState.pages.page3,
                                                input: false,
                                            },
                                        },
                                    }));
                                }

                                if (!introduction.pages.page3.visited && studyMaterial || introduction.pages.page3.visited && !studyMaterial) {
                                    setIntroduction(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            page3: {
                                                ...prevState.pages.page3,
                                                input: true,
                                            },
                                        },
                                    }));
                                }
                            }}
                            onAnimationComplete={() => {
                                if (introduction.pages.page3.visited) return;

                                new Typed(page3El.current, {
                                    strings: [`Now, share with me: what topic would you like to explore? <br />I'm here to guide you on this learning journey. <br/>Please be concise. For example, you could say: <br/><code class="px-2 py-1 bg-muted text-foreground rounded-md text-sm">'Ancient Egypt', 'Moon Landing', 'Brazilian History' and so on.</code>`],
                                    typeSpeed: 25,
                                    showCursor: false,
                                    onComplete: () => {
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            pages: {
                                                ...prevState.pages,
                                                page3: {
                                                    ...prevState.pages.page3,
                                                    input: true,
                                                },
                                            },
                                        }));
                                    }
                                });
                            }}
                                    className="flex flex-col items-center justify-center gap-8 w-full"
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Rocket className="h-16 w-16 text-primary" />
                                <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Excellent!</h2>
                            </div>

                            {introduction.pages.page3.visited ? (
                                <div className="text-[16px] text-foreground text-center w-full">Now, share with me: what topic would you like to explore? <br />I'm here to guide you on this learning journey. <br/>Please be concise. For example, you could say: <br/><code className="px-2 py-1 bg-muted text-foreground rounded-md text-sm">'Ancient Egypt', 'Moon Landing', 'Brazilian History' and so on.</code></div>
                            ) : (
                                <div ref={page3El} className="text-[16px] text-foreground text-center w-full" />
                            )}

                            {introduction.pages.page3.input && (
                                <motion.div
                                    key="introduction-page-3-input"
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants(2, 1)}
                                    transition={pageTransition(2)}
                                    onAnimationStart={() => {
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            pages: {
                                                ...prevState.pages,
                                                page3: {
                                                    ...prevState.pages.page3,
                                                    button: false,
                                                },
                                            },
                                        }));
                                    }}
                                    onAnimationComplete={() => {
                                        if (studyMaterial.length > 4) {
                                            setIntroduction(prevState => ({
                                                ...prevState,
                                                pages: {
                                                    ...prevState.pages,
                                                    page3: {
                                                        ...prevState.pages.page3,
                                                        button: true,
                                                    },
                                                },
                                            }));
                                        }
                                    }}
                                    className="flex items-center justify-center w-full"
                                >
                                    <Input
                                        placeholder="I want to learn about..."
                                        className="max-w-[450px] rounded-xl shadow-lg border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                        value={studyMaterial}
                                        onChange={(e) => {
                                            if (e.target.value.length > 4) {
                                                setIntroduction(prevState => ({
                                                    ...prevState,
                                                    pages: {
                                                        ...prevState.pages,
                                                        page3: {
                                                            ...prevState.pages.page3,
                                                            button: true,
                                                        },
                                                    },
                                                }));
                                            } else {
                                                setIntroduction(prevState => ({
                                                    ...prevState,
                                                    pages: {
                                                        ...prevState.pages,
                                                        page3: {
                                                            ...prevState.pages.page3,
                                                            button: false,
                                                        },
                                                    },
                                                }));
                                            }
                                            setStudyMaterial(e.target.value);
                                        }}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    <motion.div
                        key="introduction-options"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants(2)}
                        transition={pageTransition(2)}
                        className="flex flex-col items-center justify-between gap-4 select-none w-full mt-6"
                    >
                        <div className="flex items-center justify-between gap-3 w-full">
                            <motion.div
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants(2)}
                                transition={pageTransition(2)}
                            >
                                <Button
                                    variant="outline"
                                    className={`w-[143px] rounded-xl shadow-md ${page === 1 ? "invisible select-none" : "visible"}`}
                                    onClick={() => {
                                        setPage(page - 1);
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            actPage: page - 1,
                                            pages: {
                                                ...prevState.pages,
                                                [`page${page}`]: {
                                                    ...prevState.pages[`page${page}`],
                                                    input: false,
                                                    button: false,
                                                    visited: true,
                                                },
                                            }
                                        }));
                                    }}
                                >
                                    Back
                                </Button>
                            </motion.div>

                            <motion.div
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants(2)}
                                transition={pageTransition(2)}
                            >
                                <Button
                                    variant="default"
                                    className="min-w-[143px] rounded-xl shadow-lg hover:shadow-primary/25 hover:scale-105 transition-transform duration-200"
                                    disabled={!introduction.pages[`page${page}`].button}
                                    onClick={() => {
                                        if (page === 3) {
                                            setIntroduction(prevState => ({
                                                ...prevState,
                                                show: false,
                                                isLoading: true,
                                            }));
                                            return;
                                        }

                                        setPage(page + 1);
                                        setIntroduction(prevState => ({
                                            ...prevState,
                                            actPage: page + 1,
                                            pages: {
                                                ...prevState.pages,
                                                [`page${page}`]: {
                                                    ...prevState.pages[`page${page}`],
                                                    input: false,
                                                    button: false,
                                                    visited: true,
                                                },
                                            }
                                        }));
                                    }}
                                >
                                    {page === 3 ? "Start Learning" : "Next"}
                                </Button>
                            </motion.div>
                        </div>
                        <div className="flex items-center justify-center gap-4 select-none">
                            <span className={`block w-12 h-2 rounded-full ${page === 1 ? "bg-primary scale-110 shadow-md shadow-primary/40" : "bg-primary/30"} transition-all duration-300`} />
                            <span className={`block w-12 h-2 rounded-full ${page === 2 ? "bg-primary scale-110 shadow-md shadow-primary/40" : "bg-primary/30"} transition-all duration-300`} />
                            <span className={`block w-12 h-2 rounded-full ${page === 3 ? "bg-primary scale-110 shadow-md shadow-primary/40" : "bg-primary/30"} transition-all duration-300`} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Introduction;