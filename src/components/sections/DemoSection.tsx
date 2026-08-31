import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, RotateCcw, Sparkles, Zap, Brain, Target } from 'lucide-react';

const demoFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your learning patterns',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Target,
    title: 'Personalized Paths',
    description: 'Custom learning journeys tailored to your goals and pace',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    description: 'Real-time feedback and recommendations to optimize your learning',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Sparkles,
    title: 'Smart Content',
    description: 'Curated content that adapts to your learning style and preferences',
    color: 'from-orange-500 to-red-500'
  }
];

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    'Upload your content',
    'AI analyzes and processes',
    'Generate personalized insights',
    'Access your learning path'
  ];

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Start demo animation
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= demoSteps.length - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    }
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
            Interactive Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            See EchoVerse in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of AI-driven learning with our interactive demonstration
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
          {/* Demo Interface */}
          <Card className="p-8 demo-card-gradient">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">AI Learning Assistant</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayDemo}
                    className="bg-primary/10 border-primary/20 hover:bg-primary/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetDemo}
                    className="bg-muted/50 border-border/50 hover:bg-muted"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Demo Steps */}
              <div className="space-y-4">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-500 ${
                      index <= currentStep
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-muted/30 border-border/30 text-muted-foreground'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: index === currentStep ? 1.02 : 1
                    }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index <= currentStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{step}</span>
                      {index === currentStep && isPlaying && (
                        <motion.div
                          className="ml-auto"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Demo Output */}
              <div className="p-6 bg-background/50 rounded-lg border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">AI Generated Insights</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✨ Identified 3 key learning objectives</p>
                  <p>🎯 Recommended 5 personalized resources</p>
                  <p>📊 Generated progress tracking metrics</p>
                  <p>🔄 Created adaptive learning schedule</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <Sparkles className="h-5 w-5" />
            Try EchoVerse Now
          </Button>
        </div>
      </div>
    </section>
  );
}