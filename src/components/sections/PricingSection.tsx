import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Starter',
    price: 0,
    period: 'month',
    description: 'Perfect for individuals getting started with AI learning',
    icon: Users,
    features: [
      'Access to basic learning paths',
      'Quick summaries (5 per day)',
      'Basic roadmap generation',
      'Community support',
      'Mobile app access',
      'Basic analytics'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const,
    popular: false,
    gradient: 'from-slate-500/20 to-gray-500/20',
    borderGradient: 'from-slate-400/30 to-gray-400/30'
  },
  {
    name: 'Professional',
    price: 29,
    period: 'month',
    description: 'Ideal for professionals and growing teams',
    icon: Zap,
    features: [
      'Everything in Starter',
      'Unlimited summaries & research',
      'Advanced roadmap generation',
      'Deep research agent',
      'Audio content generation',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
      'Custom learning paths',
      'API access'
    ],
    buttonText: 'Start Professional',
    buttonVariant: 'default' as const,
    popular: true,
    gradient: 'from-primary/20 to-purple-500/20',
    borderGradient: 'from-primary/50 to-purple-500/50'
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'Advanced features for large organizations',
    icon: Shield,
    features: [
      'Everything in Professional',
      'White-label solution',
      'Advanced security & compliance',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Advanced team management',
      'Custom AI model training',
      'Enterprise analytics',
      'On-premise deployment'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    popular: false,
    gradient: 'from-orange-500/20 to-red-500/20',
    borderGradient: 'from-orange-400/30 to-red-400/30'
  }
];

export default function PricingSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple & Transparent Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the power of AI-driven learning with plans designed for every stage of your journey
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative group ${plan.popular ? 'md:-mt-8' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-primary to-purple-500 text-primary-foreground px-4 py-1 text-sm font-semibold shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Card */}
              <div className={`relative h-full rounded-3xl p-8 backdrop-blur-xl border-2 transition-all duration-500 group-hover:scale-105 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-background/90 to-background/70 border-primary/30 shadow-2xl shadow-primary/10' 
                  : 'bg-gradient-to-br from-background/80 to-background/60 border-border/30 hover:border-primary/20'
              }`}>
                
                {/* Background Gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${plan.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
                
                {/* Border Gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${plan.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl ${plan.popular ? 'bg-primary/20' : 'bg-muted/50'} transition-colors duration-300`}>
                      <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    {plan.price === 0 && (
                      <p className="text-sm text-green-500 mt-2 font-medium">Forever free</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: (index * 0.1) + (featureIndex * 0.05) }}
                        className="flex items-center gap-3"
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.popular ? 'bg-primary/20' : 'bg-muted/50'
                        }`}>
                          <Check className={`h-3 w-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <span className="text-sm text-foreground/90">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25'
                        : 'hover:bg-primary/10 hover:border-primary/30'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
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
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 backdrop-blur-sm">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-1">Need a custom solution?</h3>
              <p className="text-sm text-muted-foreground">Contact our team for enterprise pricing and custom features</p>
            </div>
            <Button variant="outline" className="flex-shrink-0 hover:bg-primary/10 hover:border-primary/30">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}