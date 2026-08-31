import { useEffect, useRef, useState } from 'react';
import robotImage from '../../assets/robott.png';

// Add type declaration for UnicornStudio
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init: (options?: { hideWatermark?: boolean }) => void;
    };
  }
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Rings Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="sf-rings relative w-full h-full">
          <div className="sf-ring__wrap --1 absolute inset-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2828.43 2720.74" className="sf-ring --1">
              <path fill="none" stroke="url(#ring-gradient-1)" strokeWidth="2" d="M578.43 43.87c208.56-130.32 533 78.36 764.29 75.45 235.3-3 511.78-147.66 720.83-31.07 200 111.49 358 337.06 489.06 546.74s261.74 450.84 274.27 679.47c13.12 239-197.48 443.12-303.29 653.36-104 206.65-122.25 529.71-330.8 660s-507.56-50-738.86-47.08c-235.31 3-545.63 221.33-754.69 104.75-199.99-111.47-171.6-493.4-302.6-703.08S14.8 1625.09 2.25 1396.48c-13.11-239.05 78.79-484.87 184.61-695.1 104-206.66 182.96-527.18 391.57-657.51Z"></path>
              <defs>
                <linearGradient id="ring-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="hsl(var(--chart-4))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="sf-ring__wrap --2 absolute inset-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2758.36 2922.53" className="sf-ring --2">
              <path fill="none" stroke="hsl(var(--chart-2) / 0.3)" strokeWidth="2" d="M314.52 474.72c162.24-180.3 571.22-10.93 786.48-80.62 222.06-71.89 434.12-344.59 662.52-296.16 221.38 46.95 435.48 232.82 615.73 395.28s384.25 357.06 454.05 572.47c72 222.23-121.6 471.77-169.85 700.27-46.78 221.48 67.3 559.25-94.94 739.55s-531.15 36.39-746.38 106.09c-222.07 71.9-447.35 445.25-675.75 396.83-221.39-46.94-266.76-485.84-447.06-648.3s-496.24-202.2-566-417.6c-72-222.23-35.42-484.38 12.83-712.88 46.75-221.49 6.13-574.65 168.37-754.93Z" opacity="0.25"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
      
      <div className="container mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight gradient-text-animation">
              Transform Your
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="glowing-button">
              <Button size="lg" className="glowing-button-inner text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:bg-primary/10 transition-all duration-300">
              Watch Demo
              <Play className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}