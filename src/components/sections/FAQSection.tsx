import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "What is EchoVerse?",
    answer:
      "EchoVerse is an AI-powered personalized learning hub that helps you discover, consume, and create content more effectively. It uses advanced AI to recommend content tailored to your interests and learning style, while offering tools to transform content between different formats."
  },
  {
    question: "How does the AI personalization work?",
    answer:
      "Our AI analyzes your interactions, preferences, and learning patterns to create a personalized experience. It considers factors like your reading history, engagement time, topic interests, and learning pace to recommend the most relevant content and optimize your learning journey."
  },
  {
    question: "What content formats does EchoVerse support?",
    answer:
      "EchoVerse supports a wide range of content formats including text, audio, video, and interactive materials. Our multi-modal transformation tools allow you to convert content between these formats seamlessly, making it easier to consume information in your preferred way."
  },
  {
    question: "How does the monetization feature work for creators?",
    answer:
      "Creators can monetize their content through various methods including subscription models, pay-per-view content, tipping, and bundled packages. Our platform handles payment processing, access control, and analytics, allowing creators to focus on producing valuable content."
  },
  {
    question: "Is my data secure on EchoVerse?",
    answer:
      "Yes, we take data security seriously. We use decentralized storage powered by Algorand and IPFS to ensure your data remains secure and private. Additionally, we implement encryption, secure authentication, and follow industry best practices for data protection."
  },
  {
    question: "Can I use EchoVerse for my organization or team?",
    answer:
      "Absolutely! Our Enterprise plan is designed specifically for organizations and teams. It includes features like team management, custom integrations, SSO authentication, and dedicated support to help your organization leverage AI-powered learning effectively."
  }
];

export default function FAQSection() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 relative bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-8 w-16 h-16 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Have questions about EchoVerse? We've got answers.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4 relative z-10">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-2 border-primary/20 rounded-xl bg-background/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl shadow-inner-modern px-6 py-2"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions? Contact our support team at{" "}
            <a
              href="mailto:support@echoverse.ai"
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
            >
              support@echoverse.ai
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}