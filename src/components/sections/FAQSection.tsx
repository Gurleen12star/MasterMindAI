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
    <section id="faq" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Blurred oval overlay effects */}
      <div className="absolute top-16 -right-32 w-72 h-72 rounded-full bg-gradient-to-br from-teal-500/6 via-cyan-500/4 to-transparent blur-3xl opacity-50" />
      <div className="absolute -bottom-16 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-primary/8 via-indigo-500/4 to-transparent blur-3xl opacity-60" />
      
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Have questions about EchoVerse? We've got answers.
          </p>
        </div>
        
        <div className="mt-12 mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
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
        </div>
        
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