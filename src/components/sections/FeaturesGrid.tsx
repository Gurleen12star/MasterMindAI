import { motion } from 'framer-motion';
import { BentoBox } from '@/components/ui/BentoBox';
import { 
  GraduationCap, 
  Search, 
  Network, 
  Film, 
  Wand2, 
  User,
  Brain,
  Sparkles,
  Target,
  BookOpen,
  FlaskConical,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: "Personalized Learning Paths",
    description: "AI-driven modules tailored to your unique learning style and preferences, guiding you through any topic with adaptive content and personalized teaching personalities.",
    gradient: "purple",
    size: "lg"
  },
  {
    icon: Search,
    title: "AI Deep Research",
    description: "Conduct in-depth research on any subject with our intelligent research agent that generates comprehensive findings, summaries, and source attribution.",
    gradient: "blue",
    size: "md"
  },
  {
    icon: Network,
    title: "Interactive Roadmap Generator",
    description: "Visualize your learning journey with dynamic, AI-generated roadmaps that show clear progression, dependencies, and optimal learning sequences.",
    gradient: "teal",
    size: "md"
  },
  {
    icon: Film,
    title: "AI Animation Studio",
    description: "Transform complex concepts into engaging, easy-to-understand educational animations powered by advanced AI visualization technology.",
    gradient: "orange",
    size: "lg"
  },
  {
    icon: Wand2,
    title: "Instant Content Summaries",
    description: "Get the essence of any text, document, or video with AI-powered concise summaries that save you time and highlight key insights.",
    gradient: "green",
    size: "md"
  },
  {
    icon: User,
    title: "Smart Profile Customization",
    description: "Build a comprehensive profile that adapts the entire platform to your academic background, learning goals, and personal preferences.",
    gradient: "purple",
    size: "md"
  }
];

const additionalFeatures = [
  {
    icon: Brain,
    title: "Adaptive AI Tutor",
    description: "Your personal AI teacher that adjusts to your pace and style"
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set and monitor your learning objectives with intelligent progress tracking"
  },
  {
    icon: BookOpen,
    title: "Multi-Format Learning",
    description: "Learn through videos, text, interactive exercises, and more"
  },
  {
    icon: Zap,
    title: "Real-time Insights",
    description: "Get instant feedback and recommendations to optimize your learning"
  }
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Learn Smarter, Not Harder
            </span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Our comprehensive suite of AI-powered tools transforms how you learn, research, and retain knowledge. 
            Experience personalized education designed for the modern learner.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${feature.size === 'lg' ? 'md:col-span-2' : ''}`}
            >
              <BentoBox
                gradient={feature.gradient}
                className="h-full p-8 group hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 before:absolute before:inset-0 before:rounded-xl before:bg-primary/5 before:animate-pulse">
                      <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    {feature.description}
                  </p>
                  
                  {/* Interactive Element */}
                  <div className="mt-6 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm text-primary font-medium inline-flex items-center gap-2">
                      Explore Feature
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </span>
                  </div>
                </div>
              </BentoBox>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {additionalFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 text-center group"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 border border-primary/20">
            <FlaskConical className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Learning?</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Join thousands of learners who have revolutionized their education with AI-powered tools.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Get Started Free
              <Sparkles className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}