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
    <section id="faq" className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Have questions about EchoVerse? We've got answers.
          </p>
        </div>
        
        <div className="mt-12 mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
              className="text-primary hover:underline"
            >
              support@echoverse.ai
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}