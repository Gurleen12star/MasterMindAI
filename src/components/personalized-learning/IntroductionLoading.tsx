import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import Typed from "typed.js";
import { pageTransition, pageVariants } from "@/lib/personalized-learning/utilFunctions";
import { Loader2 } from "lucide-react";

const IntroductionLoading = () => {
    const infoEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const typed = new Typed(infoEl.current, {
            strings: ['Fetching information...', 'Processing data...', 'Building learning modules...', 'Loading content...', 'Just a moment...', ''],
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
        <div className="w-full flex flex-col items-center justify-center gap-6 py-12 min-h-[400px]">
            <AnimatePresence mode='popLayout'>
                <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants(2)}
                    transition={pageTransition(2)}
                    className="flex flex-col items-center justify-center gap-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl transform scale-150 opacity-70"></div>
                        <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
                    </div>
                    <div ref={infoEl} className="text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-medium text-center min-h-[24px]" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default IntroductionLoading;