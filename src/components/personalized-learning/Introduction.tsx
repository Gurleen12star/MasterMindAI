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
        <div className="flex flex-col items-center justify-center">
            <Label
                htmlFor={`radio-${value}`}
                className="flex flex-col items-center justify-center p-4 cursor-pointer rounded-lg border-2 border-transparent hover:border-primary transition-colors duration-200 data-[state=checked]:bg-primary/5 data-[state=checked]:border-primary"
            >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                </div>
                <RadioGroupItem value={value} id={`radio-${value}`} className="sr-only" {...otherProps} />
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
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-background h-[100vh] w-full z-[999] overflow-y-auto">
            <div className="flex flex-col items-center justify-between gap-12 p-10 max-sm:px-3 w-full min-h-[100vh]">
                <AnimatePresence mode='popLayout'>
                    <motion.div
                        key="introduction-logo"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants(2)}
                        transition={pageTransition(2)}
                    >
                        <div className="text-center">
                            <School className="h-20 w-20 text-primary mx-auto mb-2" />
                            <h2 className="text-2xl font-bold">Personalized Learning</h2>
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
                            <h2 className="text-[40px] text-primary font-semibold text-center">Hello</h2>

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
                                    className="flex items-center justify-center w-full pt-[20px]"
                                >
                                    <Input
                                        placeholder="Enter your name"
                                        className="max-w-[300px]"
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
                                    className="flex items-center justify-center w-full pt-[20px]"
                                >
                                    <div className="space-y-4 w-full max-w-xl">
                                        <RadioGroup
                                            className="grid grid-cols-2 gap-4 md:grid-cols-5"
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
                            className="flex flex-col items-center justify-between gap-14 w-full"
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Rocket className="h-16 w-16 text-primary" />
                                <h2 className="text-3xl text-primary font-semibold text-center">Excellent!</h2>
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
                                        className="max-w-[450px]"
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
                        className="flex flex-col items-center justify-between gap-7 select-none w-full md:max-w-[90%]"
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
                                    className={`w-[143px] ${page === 1 ? "invisible select-none" : "visible"}`}
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
                                    className="min-w-[143px]"
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
                            <span className={`block w-12 h-2 rounded-full ${page === 1 ? "bg-primary" : "bg-primary/30"} transition-all`} />
                            <span className={`block w-12 h-2 rounded-full ${page === 2 ? "bg-primary" : "bg-primary/30"} transition-all`} />
                            <span className={`block w-12 h-2 rounded-full ${page === 3 ? "bg-primary" : "bg-primary/30"} transition-all`} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Introduction;