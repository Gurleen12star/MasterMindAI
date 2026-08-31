import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Brain, 
  Search, 
  Network, 
  Film, 
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle,
  Zap
} from 'lucide-react';

const demoFeatures = [
  {
    id: 'personalized',
    icon: Brain,
    title: 'Personalized Learning',
    description: 'AI adapts to your learning style',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 'research',
    icon: Search,
    title: 'Deep Research',
    description: 'Comprehensive topic analysis',
    color: 'from-blue-500 to-teal-500'
  },
  {
    id: 'roadmap',
    icon: Network,
    title: 'Visual Roadmaps',
    description: 'Interactive learning paths',
    color: 'from-teal-500 to-green-500'
  },
  {
    id: 'animation',
    icon: Film,
    title: 'AI Animations',
    description: 'Complex concepts simplified',
    color: 'from-orange-500 to-red-500'
  }
];

const sampleTopics = [
  'Machine Learning Fundamentals',
  'Quantum Physics Basics',
  'Web Development with React',
  'Digital Marketing Strategy',
  'Data Science with Python'
];

export default function DemoSection() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState('personalized');

  const handleGenerate = () => {
    if (!selectedTopic.trim()) return;
    
    setIsGenerating(true);
    setGeneratedContent(null);
    
    // Simulate AI processing
    setTimeout(() => {
      setGeneratedContent(selectedTopic);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Play className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Demo</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            See AI Learning in Action
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Experience the power of AI-driven personalized learning. Enter any topic and watch 
            as our intelligent system creates a customized learning experience just for you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Try AI Learning Generator</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What would you like to learn?
                    </label>
                    <Input
                      placeholder="Enter any topic (e.g., Machine Learning, Photography, Cooking...)"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Quick examples:</span>
                    {sampleTopics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={!selectedTopic.trim() || isGenerating}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI is generating your learning path...
                      </>
                    ) : (
                      <>
                        Generate Learning Path
                        <Zap className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing your topic...
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating personalized modules...
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating interactive content...
                    </div>
                  </motion.div>
                )}

                {generatedContent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Learning path generated successfully!
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your personalized learning path for "{generatedContent}" is ready with:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        5 adaptive learning modules
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        Interactive visual roadmap
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        Personalized difficulty adjustment
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        AI-generated practice exercises
                      </li>
                    </ul>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Feature Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6">Powered by Advanced AI Features</h3>
            
            <div className="space-y-4">
              {demoFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeFeature === feature.id 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <ArrowRight className={`h-5 w-5 transition-transform ${
                      activeFeature === feature.id ? 'translate-x-1' : ''
                    }`} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-medium">Real-time AI Processing</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Every learning path is generated in real-time using advanced machine learning 
                algorithms that analyze your preferences, learning style, and current knowledge level.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle className="h-4 w-4" />
                <span>Personalized for your unique learning profile</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}