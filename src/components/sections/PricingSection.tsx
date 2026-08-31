import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BentoBox } from '@/components/ui/BentoBox';

const pricingPlans = [
  {
    name: "Freemium",
    price: "$0",
    description: "Basic access to EchoVerse's core features.",
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
    <section id="pricing" className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Choose Your Learning Journey
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Flexible plans designed to meet your learning and content creation needs.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <BentoBox
              key={plan.name}
              gradient={plan.gradient as any}
              className={
                plan.featured
                  ? "border-primary/30 ring-1 ring-primary/20"
                  : ""
              }
            >
              {plan.featured && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-1 text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Button
                  className={plan.featured ? "w-full" : "w-full"}
                  variant={plan.featured ? "default" : "outline"}
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