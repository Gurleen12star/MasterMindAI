import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    iconColor: 'text-blue-500'
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
    iconColor: 'text-primary'
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
    iconColor: 'text-orange-500'
  }
];

export default function PricingSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-8 w-16 h-16 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple & Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start free and scale as you grow. All plans include our core AI-powered learning features.
          </p>
        </motion.div>

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
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} border border-border/20`}>
                      <plan.icon className={`h-6 w-6 ${plan.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
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
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 md:mt-20 lg:mt-24"
        >
          <div className="p-6 sm:p-8 lg:p-12 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 backdrop-blur-xl max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Need a custom solution?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              We offer tailored enterprise solutions with custom integrations, dedicated support, and flexible pricing.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground shadow-lg hover:shadow-xl">
              Contact Enterprise Sales
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}