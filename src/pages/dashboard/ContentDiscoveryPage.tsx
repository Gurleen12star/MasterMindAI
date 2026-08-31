import { motion } from 'framer-motion';
import { Compass, Map, Search, Brain, Newspaper } from 'lucide-react';

const features = [
  {
    title: "Explore Hub",
    description: "Your gateway to discovering new content tailored to your interests and learning style",
    icon: Compass,
    gradient: "from-purple-500/20 to-indigo-500/20",
    iconGradient: "from-purple-500 to-indigo-500"
  },
  {
    title: "Learning Paths",
    description: "Curated topic journeys designed to guide you from beginner to expert",
    icon: Map,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconGradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Smart Search",
    description: "Powerful semantic search that understands context and meaning",
    icon: Search,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Knowledge Map",
    description: "Visual representation of your interests and learning connections",
    icon: Brain,
    gradient: "from-pink-500/20 to-rose-500/20",
    iconGradient: "from-pink-500 to-rose-500"
  },
  {
    title: "Daily Digest",
    description: "Personalized content recommendations based on your learning patterns",
    icon: Newspaper,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconGradient: "from-amber-500 to-orange-500"
  }
];

export default function ContentDiscoveryPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Content Discovery & Learning</h2>
        <p className="text-muted-foreground">
          Explore personalized content and curated learning paths
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${feature.gradient} backdrop-blur-xl p-6 hover:border-primary/20 transition-all duration-300`}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-background/80 opacity-60 group-hover:opacity-50 transition-opacity duration-300" />
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/10 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float-particle ${10 + Math.random() * 10}s infinite`,
                    animationDelay: `${-Math.random() * 10}s`,
                  }}
                />
              ))}
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.iconGradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              
              <div className="mt-4 flex items-center text-sm text-primary">
                <span className="group-hover:underline">Explore {feature.title}</span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}