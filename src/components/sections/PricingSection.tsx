import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassIcons from '@/components/ui/GlassIcons';
import { Check, Star, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: Star,
    price: 'Free',
    period: '',
    description: 'Perfect for individuals getting started with AI learning',
    features: [
      'Access to basic learning paths',
      'Limited AI summaries (10/month)',
      'Community support',
      'Basic progress tracking',
      'Mobile app access'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const,
    popular: false,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    borderGradient: 'from-blue-500/50 to-cyan-500/50',
    iconColor: 'blue'
  },
  {
    name: 'Pro',
    icon: Zap,
    price: '$19',
    period: '/month',
    description: 'Best for professionals and serious learners',
    features: [
      'Unlimited AI summaries',
      'Advanced learning paths',
      'Deep research agent',
      'Audio content generation',
      'Priority support',
      'Advanced analytics',
      'Custom roadmaps',
      'Export capabilities'
    ],
    buttonText: 'Start Pro Trial',
    buttonVariant: 'default' as const,
    popular: true,
    gradient: 'from-primary/30 to-purple-500/30',
    borderGradient: 'from-primary to-purple-500',
    iconColor: 'purple'
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: '$99',
    period: '/month',
    description: 'For teams and organizations with advanced needs',
    features: [
      'Everything in Pro',
      'Team collaboration tools',
      'Advanced integrations',
      'Custom AI models',
      'Dedicated support',
      'SSO & security features',
      'API access',
      'Custom branding'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    popular: false,
    gradient: 'from-orange-500/20 to-red-500/20',
    borderGradient: 'from-orange-500/50 to-red-500/50',
    iconColor: 'orange'
  }
];

export default function PricingSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 relative">
      {/* Background overlay for better text visibility */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-sm">
            Choose Your
            <span className="block bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent drop-shadow-sm">
              Learning Journey
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            Start free and scale as you grow. All plans include our core AI-powered learning features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative group ${plan.popular ? 'md:scale-105 lg:scale-110' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-primary to-purple-500 text-primary-foreground px-4 py-1 text-sm font-semibold shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Card Container */}
              <div className={`
                relative h-full p-6 sm:p-8 rounded-2xl lg:rounded-3xl border-2 transition-all duration-500
                backdrop-blur-xl bg-background/80 overflow-hidden
                ${plan.popular 
                  ? 'border-primary/50 shadow-2xl shadow-primary/20' 
                  : 'border-border/50 hover:border-primary/30'
                }
                ${hoveredCard === index ? 'shadow-2xl shadow-primary/10 -translate-y-2' : ''}
              `}>
                
                {/* Shine Effect */}
                <div className={`
                  absolute inset-0 opacity-0 transition-opacity duration-700
                  ${hoveredCard === index ? 'opacity-100' : ''}
                `}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full animate-shine" />
                </div>

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50 transition-opacity duration-500 ${hoveredCard === index ? 'opacity-70' : ''}`} />
                
                {/* Border Gradient Effect */}
                {hoveredCard === index && (
                  <div className={`absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r ${plan.borderGradient} opacity-20 blur-sm`} />
                )}

                {/* Content */}
                <div className="relative z-10">
                  {/* Plan Header */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="mb-4" style={{ height: '80px' }}>
                      <div className="scale-75">
                        <GlassIcons items={[{ icon: <plan.icon className="h-6 w-6" />, color: plan.iconColor, label: plan.name }]} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${plan.popular ? 'bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent' : 'text-foreground'}`}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-lg text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: (index * 0.1) + (featureIndex * 0.05) }}
                        className="flex items-center gap-3"
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${plan.borderGradient} p-0.5`}>
                          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                        <span className="text-sm sm:text-base text-foreground">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full h-12 sm:h-14 text-base font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25'
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {plan.buttonText}
                    <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${hoveredCard === index ? 'translate-x-1' : ''}`} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6 text-lg font-medium">
            Need something custom? Let's talk.
          </p>
          <Button variant="outline" size="lg" className="bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-2 border-primary/20 hover:border-primary">
            <Sparkles className="mr-2 h-5 w-5" />
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}