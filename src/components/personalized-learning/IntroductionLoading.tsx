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
        <div className="w-full h-full bg-background flex flex-col items-center justify-center gap-6 py-6 min-h-[300px]">
            <AnimatePresence mode='popLayout'>
                <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants(2)}
                    transition={pageTransition(2)}
                    className="flex flex-col items-center justify-center gap-4"
                >
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    <div ref={infoEl} className="text-lg text-primary font-medium text-center min-h-[24px]" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default IntroductionLoading;