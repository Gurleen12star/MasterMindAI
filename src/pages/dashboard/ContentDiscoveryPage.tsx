import { motion } from 'framer-motion';
import { Compass, Map, Search, Brain, Newspaper } from 'lucide-react';

const features = [
  {
    title: "Explore Hub",
    description: "Your gateway to discovering new content. Browse through curated collections, trending topics, and personalized recommendations.",
    icon: Compass,
    gradient: "from-purple-500/20 to-indigo-500/20",
    iconGradient: "from-purple-500 to-indigo-500"
  },
  {
    title: "Learning Paths",
    description: "Follow expertly curated topic journeys designed to take you from beginner to expert with structured learning sequences.",
    icon: Map,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconGradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Smart Search",
    description: "Powerful semantic search that understands context and meaning, helping you find exactly what you need.",
    icon: Search,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Knowledge Map",
    description: "Visualize your interests and learning connections with an interactive knowledge graph that grows with you.",
    icon: Brain,
    gradient: "from-pink-500/20 to-rose-500/20",
    iconGradient: "from-pink-500 to-rose-500"
  },
  {
    title: "Daily Digest",
    description: "Get personalized content recommendations based on your interests, learning style, and goals.",
    icon: Newspaper,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconGradient: "from-amber-500 to-orange-500"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function ContentDiscoveryPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Content Discovery & Learning</h2>
        <p className="text-muted-foreground">
          Explore and discover content tailored to your learning journey.
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${feature.gradient} backdrop-blur-xl hover:border-border transition-all duration-300`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
            <div className="relative p-6 space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-background/80 to-background/50 border border-border/50 group-hover:border-border/80 transition-colors duration-300">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              
              <div className="pt-4">
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Explore {feature.title} →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}