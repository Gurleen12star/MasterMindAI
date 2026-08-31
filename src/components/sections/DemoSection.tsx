import { useState } from 'react';
import { motion } from 'framer-motion';
import { BentoBox } from '@/components/ui/BentoBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Headphones, Video, Wand2, Sparkles, Play } from 'lucide-react';

const demoFeatures = [
  {
    title: 'AI-Powered Summaries',
    description: 'Get instant, comprehensive summaries of any topic with our advanced AI technology.',
    icon: FileText
  },
  {
    title: 'Audio Learning',
    description: 'Convert any content to high-quality audio for learning on the go.',
    icon: Headphones
  },
  {
    title: 'Visual Learning',
    description: 'Generate engaging videos and animations to enhance your understanding.',
    icon: Video
  },
  {
    title: 'Smart Roadmaps',
    description: 'Create personalized learning paths tailored to your goals and pace.',
    icon: Wand2
  }
];

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [content, setContent] = useState('');

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="gradient-line"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-animation">
            See EchoVerse in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of AI-driven learning with our interactive demo
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center spotlight-group" data-spotlight>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group spotlight-card"
          >
            <div className="spotlight-card-content gradient-border-card">
              <div className="shimmer" style={{ '--delay': '-4s' } as React.CSSProperties}></div>
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white opacity-10" />
                <Button 
                  size="lg" 
                  className="relative z-10 bg-primary/90 hover:bg-primary text-primary-foreground shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                >
                  <Play className="mr-2 h-6 w-6" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {demoFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 rounded-xl gradient-border-card"
              >
                <div className="shimmer" style={{ '--delay': `${-index * 3}s` } as React.CSSProperties}></div>
                <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}