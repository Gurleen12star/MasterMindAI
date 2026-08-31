import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-float opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-primary/20 rounded-full blur-3xl animate-pulse-float-delayed opacity-60" />

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo with floating animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <img 
              src={logo} 
              alt="EchoVerse Logo" 
              className="h-24 w-24 object-contain drop-shadow-2xl" 
            />
            
            {/* Glowing ring around logo */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Outer glowing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/20"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.div>
        </motion.div>

        {/* Brand name with gradient */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-2">
            EchoVerse
          </h1>
          <p className="text-muted-foreground text-lg">AI-Powered Learning Hub</p>
        </motion.div>

        {/* Loading progress bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-64 h-1 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full shadow-lg shadow-primary/30"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>

        {/* Loading text with typing animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <motion.p 
            className="text-muted-foreground text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Initializing your learning experience...
          </motion.p>
        </motion.div>

        {/* Floating dots animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/60 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}