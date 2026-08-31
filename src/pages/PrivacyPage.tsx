import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Clock, InfoIcon } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex p-4 rounded-full bg-primary/10 mb-6"
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Privacy Policy
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-2 text-muted-foreground"
            >
              <Clock className="h-4 w-4" />
              <span>Last Updated: June 15, 2025</span>
            </motion.div>
          </div>

          <Card className="p-6 md:p-8 mb-8 border-primary/10">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                At EchoVerse, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered learning platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
              
              <h2>1. Information We Collect</h2>
              <p>We collect information that you provide directly to us when you:</p>
              <ul>
                <li>Create an account</li>
                <li>Use our interactive features</li>
                <li>Fill out forms on our platform</li>
                <li>Communicate with us</li>
                <li>Generate or save learning content</li>
              </ul>

              <p>The types of personal information we may collect include:</p>
              <ul>
                <li>Name, email address, and contact information</li>
                <li>Account credentials</li>
                <li>Profile information and preferences</li>
                <li>Educational background and learning objectives</li>
                <li>Content you create, upload, or store on the platform</li>
                <li>Learning progress and assessment data</li>
                <li>Payment information (if applicable)</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your learning experience</li>
                <li>Process transactions</li>
                <li>Send administrative information</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Analyze usage patterns and trends</li>
                <li>Develop new products and services</li>
                <li>Protect against, identify, and prevent fraud and other illegal activity</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>3. Sharing Your Information</h2>
              <p>We may share your personal information with:</p>
              <ul>
                <li>Service providers who perform services on our behalf</li>
                <li>Educational partners (with your consent)</li>
                <li>In response to legal process or when required by law</li>
                <li>In connection with a merger, sale, or acquisition</li>
              </ul>
              <p>We do not sell your personal information to third parties for marketing purposes.</p>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>

              <h2>5. Your Rights and Choices</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
                <li>Withdrawal of consent</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided at the end of this policy.</p>

              <h2>6. Children's Privacy</h2>
              <p>
                Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>

              <h2>7. Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have questions or concerns about this privacy policy or our practices, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> privacy@echoverse.ai<br />
                <strong>Address:</strong> 123 Learning Lane, San Francisco, CA 94103
              </p>
            </div>
          </Card>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-primary" />
              Privacy FAQ
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {[
                { 
                  question: "How is my learning data used to personalize my experience?", 
                  answer: "We analyze your learning patterns, preferences, and performance to customize content recommendations, adapt teaching methods, and optimize your learning journey. This data is used solely to enhance your educational experience and is not shared with third parties without your explicit consent." 
                },
                { 
                  question: "Can I delete my account and all associated data?", 
                  answer: "Yes, you can request complete deletion of your account and associated data through your account settings or by contacting our support team. Upon verification, we will permanently delete your personal information and learning data in accordance with applicable laws." 
                },
                { 
                  question: "How is my payment information secured?", 
                  answer: "We use industry-standard encryption and security protocols to protect your payment information. We never store complete credit card details on our servers. All payment processing is handled by trusted third-party payment processors who comply with PCI DSS standards." 
                },
                { 
                  question: "Do you use AI to analyze my personal data?", 
                  answer: "Yes, our platform uses AI to analyze your learning behavior and preferences to provide personalized recommendations and adaptive content. This processing is necessary for delivering our core service. All AI processing follows strict ethical guidelines and privacy protections." 
                },
                { 
                  question: "How long do you retain my data?", 
                  answer: "We retain your personal information for as long as your account is active or as needed to provide you services. We retain learning data for a longer period to maintain continuity in your educational journey, but you can request deletion of specific data points at any time." 
                }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground py-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Info Card */}
          <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 via-background to-background border-primary/10 rounded-xl mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Data Protection Inquiries</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              If you have specific questions about your data or privacy rights, our Data Protection Officer is here to help.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Email:</strong> dpo@echoverse.ai<br />
                <strong>Response Time:</strong> Within 48 hours
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}