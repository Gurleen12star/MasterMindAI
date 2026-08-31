import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, Brain, Shield, Zap, Users, Sparkles } from 'lucide-react';

const faqs = [
  {
    category: "AI & Personalization",
    icon: Brain,
    questions: [
      {
        question: "How does EchoVerse's AI personalization work?",
        answer: "Our AI analyzes your learning style, preferences, pace, and current knowledge level to create completely customized learning experiences. It adapts in real-time based on your progress, ensuring optimal learning efficiency. The system considers factors like your preferred teaching personality, difficulty level, study time, and learning objectives to generate content that resonates with your unique learning profile."
      },
      {
        question: "What makes EchoVerse different from other learning platforms?",
        answer: "EchoVerse combines multiple AI-powered tools in one platform: personalized learning paths, deep research capabilities, visual roadmap generation, and animation creation. Unlike traditional platforms that offer static content, our AI creates dynamic, adaptive learning experiences tailored specifically to each user. Every lesson, summary, and research output is generated fresh based on your individual needs and learning goals."
      },
      {
        question: "Can I customize the AI teaching personalities?",
        answer: "Yes! We offer multiple AI teaching personalities (Formal, Informal, Playful, Serious, and Balanced) that adapt the communication style to your preferences. In our Mastermind plan, you can even create custom personalities that match your ideal learning environment. The AI adjusts its explanations, examples, and interactions based on your chosen personality."
      }
    ]
  },
  {
    category: "Features & Capabilities",
    icon: Zap,
    questions: [
      {
        question: "What can the Deep Research Agent do?",
        answer: "Our AI Research Agent conducts comprehensive research on any topic, analyzing multiple sources to provide detailed findings, summaries, and proper source attribution. It can identify knowledge gaps, synthesize information from various sources, and present research in an organized, academic-quality format. This saves hours of manual research time while ensuring thoroughness and accuracy."
      },
      {
        question: "How does the Animation Studio work?",
        answer: "The AI Animation Studio transforms complex concepts into engaging visual explanations. Simply input a topic, and our AI generates educational animations that break down difficult subjects into digestible, visual components. This is particularly effective for STEM subjects, but works across all disciplines to enhance understanding through visual learning."
      },
      {
        question: "What types of learning paths can be generated?",
        answer: "Our AI can generate learning paths for virtually any subject - from technical skills like programming and data science to academic subjects like history and literature, to professional skills like project management and design. Each path includes structured modules, recommended resources, practice exercises, and progress tracking tailored to your skill level and goals."
      }
    ]
  },
  {
    category: "Privacy & Security",
    icon: Shield,
    questions: [
      {
        question: "How is my learning data protected?",
        answer: "We take data privacy seriously. All your learning data is encrypted both in transit and at rest. We comply with GDPR, CCPA, and other privacy regulations. Your personal learning information is never shared with third parties, and you maintain full control over your data. We use this information solely to improve your learning experience within the platform."
      },
      {
        question: "Does EchoVerse store my personal information?",
        answer: "We only store essential information needed to provide personalized learning experiences: your learning preferences, progress data, and generated content. We don't store unnecessary personal data, and you can request data export or deletion at any time. All data processing is transparent and documented in our privacy policy."
      }
    ]
  },
  {
    category: "Getting Started",
    icon: Sparkles,
    questions: [
      {
        question: "How quickly can I start learning with EchoVerse?",
        answer: "You can start immediately after signing up! The AI begins personalizing your experience from your first interaction. Simply create an account, complete a brief learning profile (takes 2-3 minutes), and you'll have access to AI-generated learning content right away. No lengthy setup or complex configurations required."
      },
      {
        question: "Do I need any technical knowledge to use EchoVerse?",
        answer: "Not at all! EchoVerse is designed to be intuitive and user-friendly. Whether you're a student, professional, or lifelong learner, the interface is simple and the AI guides you through every step. You just need to tell the AI what you want to learn, and it handles the complexity behind the scenes."
      },
      {
        question: "Can I try EchoVerse before committing to a paid plan?",
        answer: "Absolutely! We offer a free Explorer plan that gives you access to core features with some limitations. Additionally, all paid plans come with a 14-day free trial with full access to premium features. This allows you to experience the full power of AI-personalized learning before making any financial commitment."
      }
    ]
  },
  {
    category: "Support & Community",
    icon: Users,
    questions: [
      {
        question: "What kind of support is available?",
        answer: "Support varies by plan: Explorer users have access to community forums and documentation, Scholar users get priority email support, and Mastermind users receive 1-on-1 consultation and dedicated support. Our AI also provides contextual help throughout the platform, answering questions about features and learning strategies."
      },
      {
        question: "Is there a community of learners I can connect with?",
        answer: "Yes! Scholar and Mastermind plans include access to learning communities where you can connect with other learners, share insights, and collaborate on projects. Mastermind users also get access to private, focused communities for advanced learners and professionals."
      },
      {
        question: "Can educators use EchoVerse for their students?",
        answer: "Definitely! Many educators use EchoVerse to create engaging content for their classes, generate visual explanations, and develop personalized learning materials. We offer educational discounts and bulk licensing options. The platform is particularly effective for creating supplementary materials and differentiated instruction."
      }
    ]
  }
];

export default function FAQSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Frequently Asked Questions</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to Know
            <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              About AI-Powered Learning
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Get answers to common questions about EchoVerse's AI learning platform, 
            features, privacy, and how to get the most out of your learning experience.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{category.category}</h3>
              </div>

              {/* Questions */}
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, questionIndex) => (
                  <AccordionItem
                    key={questionIndex}
                    value={`${categoryIndex}-${questionIndex}`}
                    className="border border-border/40 rounded-lg px-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="font-medium pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* Additional Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 border border-primary/20">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our support team and AI learning experts are here to help you succeed. 
              Get personalized assistance with your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Contact Support
                <Users className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-background text-foreground border border-border rounded-lg font-medium hover:bg-accent transition-colors inline-flex items-center gap-2"
              >
                Join Community
                <Sparkles className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}