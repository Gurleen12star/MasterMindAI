import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BentoBox } from '@/components/ui/BentoBox';
import { cn } from '@/lib/utils';

const pricingPlans = [
  {
    name: "Freemium",
    price: "$0",
    description: "Basic access to EchoVerse's core features.",
    highlight: "Perfect for getting started",
    features: [
      "AI content recommendations",
      "Basic text transformations",
      "Standard learning dashboard",
      "5 translations per day",
      "Public content only"
    ],
    cta: "Get Started",
    gradient: "none"
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Enhanced features for serious learners.",
    highlight: "Most popular choice",
    features: [
      "Advanced AI recommendations",
      "Unlimited transformations",
      "Custom learning dashboards",
      "Unlimited translations",
      "Access to premium content",
      "Basic monetization tools"
    ],
    cta: "Try Free for 14 Days",
    featured: true,
    gradient: "purple"
  },
  {
    name: "Creator",
    price: "$29",
    period: "/month",
    description: "Complete toolkit for content creators.",
    highlight: "For professional creators",
    features: [
      "All Pro features",
      "Advanced monetization tools",
      "Content gating options",
      "Analytics dashboard",
      "API access",
      "Priority support"
    ],
    cta: "Try Free for 14 Days",
    gradient: "blue"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for organizations.",
    highlight: "For large teams",
    features: [
      "All Creator features",
      "Custom integrations",
      "Dedicated account manager",
      "Team management",
      "SSO authentication",
      "Custom branding"
    ],
    cta: "Contact Sales",
    gradient: "teal"
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background/50" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Choose Your Learning Journey
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Flexible plans designed to meet your learning and content creation needs.
          </p>
        </div>
        
        <div className="relative mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <BentoBox
              key={plan.name}
              gradient={plan.gradient as any}
              className={cn(
                "backdrop-blur-xl bg-background/20 border border-primary/10 hover:border-primary/20 transition-all duration-300",
                plan.featured && "border-primary/30 ring-1 ring-primary/20 scale-105 shadow-xl"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary/90 px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg backdrop-blur-sm">
                  Most Popular
                </div>
              )}
              
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <span className="text-xs font-medium text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                    {plan.highlight}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="ml-1 text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-base text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10">
                <Button
                  className={cn(
                    "w-full transition-all duration-300",
                    plan.featured
                      ? "bg-primary/90 hover:bg-primary shadow-lg hover:shadow-primary/25"
                      : "bg-primary/10 hover:bg-primary/20 text-primary"
                  )}
                 onClick={() => window.location.href = '/signup'}
                >
                  {plan.cta}
                </Button>
              </div>
            </BentoBox>
          ))}
        </div>
      </div>
    </section>
  );
}