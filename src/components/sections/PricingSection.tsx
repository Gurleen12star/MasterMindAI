import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Sparkles,
  Brain,
  Search,
  Network,
  Film,
  Wand2,
  User,
  Infinity,
  Shield
} from 'lucide-react';

const plans = [
  {
    name: "Explorer",
    price: "Free",
    period: "forever",
    description: "Perfect for trying out AI-powered learning",
    badge: null,
    color: "border-border",
    buttonVariant: "outline" as const,
    icon: Star,
    features: [
      { text: "3 personalized learning sessions per month", icon: Brain },
      { text: "Basic AI content summaries", icon: Wand2 },
      { text: "Simple roadmap generation", icon: Network },
      { text: "Community support", icon: User },
      { text: "Basic progress tracking", icon: Check }
    ],
    limitations: [
      "Limited to 3 topics per month",
      "Basic AI personalities only",
      "No animation studio access"
    ]
  },
  {
    name: "Scholar",
    price: "$19",
    period: "per month",
    description: "Ideal for students and individual learners",
    badge: "Most Popular",
    color: "border-primary ring-2 ring-primary/20",
    buttonVariant: "default" as const,
    icon: Zap,
    features: [
      { text: "Unlimited personalized learning sessions", icon: Brain },
      { text: "Advanced AI research agent", icon: Search },
      { text: "Interactive roadmap generator", icon: Network },
      { text: "AI animation studio access", icon: Film },
      { text: "All AI teaching personalities", icon: Sparkles },
      { text: "Advanced content summaries", icon: Wand2 },
      { text: "Priority support", icon: User },
      { text: "Detailed analytics & insights", icon: Check }
    ],
    limitations: []
  },
  {
    name: "Mastermind",
    price: "$49",
    period: "per month",
    description: "For professionals and advanced learners",
    badge: "Best Value",
    color: "border-yellow-400 ring-2 ring-yellow-400/20",
    buttonVariant: "default" as const,
    icon: Crown,
    features: [
      { text: "Everything in Scholar plan", icon: Check },
      { text: "Advanced deep research with 10+ sources", icon: Search },
      { text: "Custom AI personality creation", icon: Brain },
      { text: "Collaborative learning spaces", icon: User },
      { text: "API access for integrations", icon: Network },
      { text: "White-label options", icon: Crown },
      { text: "1-on-1 learning consultation", icon: Sparkles },
      { text: "Early access to new features", icon: Zap }
    ],
    limitations: []
  }
];

const features = [
  {
    category: "AI Learning Tools",
    items: [
      { name: "Personalized Learning Sessions", free: "3/month", scholar: "Unlimited", mastermind: "Unlimited" },
      { name: "AI Teaching Personalities", free: "Basic", scholar: "All", mastermind: "All + Custom" },
      { name: "Learning Progress Analytics", free: "Basic", scholar: "Advanced", mastermind: "Enterprise" }
    ]
  },
  {
    category: "Research & Content",
    items: [
      { name: "Deep Research Agent", free: "❌", scholar: "✅", mastermind: "✅ Advanced" },
      { name: "Content Summaries", free: "Basic", scholar: "Advanced", mastermind: "Advanced" },
      { name: "Source Attribution", free: "❌", scholar: "✅", mastermind: "✅" }
    ]
  },
  {
    category: "Visual Learning",
    items: [
      { name: "Roadmap Generator", free: "Basic", scholar: "Interactive", mastermind: "Interactive" },
      { name: "AI Animation Studio", free: "❌", scholar: "✅", mastermind: "✅ Priority" },
      { name: "Custom Visualizations", free: "❌", scholar: "❌", mastermind: "✅" }
    ]
  },
  {
    category: "Support & Collaboration",
    items: [
      { name: "Support Level", free: "Community", scholar: "Priority", mastermind: "1-on-1" },
      { name: "Learning Communities", free: "❌", scholar: "✅", mastermind: "✅ Private" },
      { name: "API Access", free: "❌", scholar: "❌", mastermind: "✅" }
    ]
  }
];

export default function PricingSection() {
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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Flexible AI Learning Plans</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              AI Learning Journey
            </span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            From free exploration to advanced AI-powered learning, find the perfect plan 
            that adapts to your learning goals and accelerates your educational success.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className={`h-full p-8 ${plan.color} transition-all duration-300 hover:shadow-lg group`}>
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                )}
                
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                      <plan.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Free" && (
                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <feature.icon className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
                        {plan.limitations.map((limitation, i) => (
                          <div key={i} className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            <span className="text-xs text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    variant={plan.buttonVariant}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {plan.price === "Free" ? "Get Started Free" : "Start Free Trial"}
                    {plan.name === "Mastermind" && <Crown className="h-4 w-4" />}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Detailed Feature Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Features</th>
                    <th className="text-center p-4 font-semibold">Explorer</th>
                    <th className="text-center p-4 font-semibold">Scholar</th>
                    <th className="text-center p-4 font-semibold">Mastermind</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category) => (
                    <React.Fragment key={category.category}>
                      <tr>
                        <td colSpan={4} className="p-4 bg-muted/30 font-semibold text-sm">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item) => (
                        <tr key={item.name} className="border-b border-border/30">
                          <td className="p-4 text-sm">{item.name}</td>
                          <td className="p-4 text-center text-sm">{item.free}</td>
                          <td className="p-4 text-center text-sm">{item.scholar}</td>
                          <td className="p-4 text-center text-sm">{item.mastermind}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* FAQ / Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <Infinity className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">No Long-term Commitments</h4>
              <p className="text-sm text-muted-foreground">
                Cancel anytime. All plans include a 14-day free trial with full access to features.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Data Privacy Guaranteed</h4>
              <p className="text-sm text-muted-foreground">
                Your learning data is encrypted and never shared. Full GDPR compliance.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Instant Access</h4>
              <p className="text-sm text-muted-foreground">
                Start learning immediately after signup. No setup required, AI is ready to go.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}