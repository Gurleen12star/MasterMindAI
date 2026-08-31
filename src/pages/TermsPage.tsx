import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileText, Clock, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
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
              <FileText className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Terms of Service
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
                Welcome to EchoVerse. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using the EchoVerse platform, you agree to comply with and be bound by these Terms.
              </p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using our platform, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not access or use our platform.
              </p>

              <h2>2. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. We will provide notice of any material changes through the platform or by sending you an email. Your continued use of the platform after such modifications constitutes your acceptance of the modified Terms.
              </p>

              <h2>3. User Accounts</h2>
              <p>
                To access certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information and to keep your information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              
              <h2>4. User Content</h2>
              <p>
                You retain ownership of any content you create, upload, or share on the platform. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in connection with providing and promoting our services.
              </p>
              
              <h2>5. Acceptable Use</h2>
              <p>
                You agree not to use the platform to:
              </p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Engage in any activity that interferes with or disrupts the platform</li>
                <li>Attempt to gain unauthorized access to the platform or related systems</li>
                <li>Use the platform to generate or distribute content that violates copyright, trademark, or other intellectual property laws</li>
              </ul>

              <h2>6. Intellectual Property</h2>
              <p>
                The platform, including all content, features, and functionality, is owned by EchoVerse and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our platform without our prior written consent.
              </p>

              <h2>7. AI-Generated Content</h2>
              <p>
                Our platform utilizes artificial intelligence to generate educational content. While we strive to ensure the accuracy and quality of AI-generated content, we do not guarantee its completeness, reliability, or suitability for any purpose. You acknowledge that AI-generated content may sometimes contain errors, inaccuracies, or inappropriate material, and you use such content at your own risk.
              </p>

              <h2>8. Subscription and Payments</h2>
              <p>
                Some features of the platform may require a paid subscription. By subscribing, you agree to pay all fees associated with your subscription. All payments are non-refundable unless otherwise specified. We may change subscription fees upon reasonable notice.
              </p>

              <h2>9. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>

              <h2>10. Disclaimers</h2>
              <p>
                THE PLATFORM AND ALL CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                We do not guarantee that the platform will be uninterrupted, secure, or error-free, or that defects will be corrected. We are not responsible for any harm that may result from the platform or your use of it.
              </p>

              <h2>11. Limitation of Liability</h2>
              <p>
                IN NO EVENT WILL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE PLATFORM.
              </p>

              <h2>12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless EchoVerse and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the platform or your violation of these Terms.
              </p>

              <h2>13. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. You agree to submit to the personal jurisdiction of the courts located within San Francisco County, California for the purpose of litigating all such claims.
              </p>

              <h2>14. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@echoverse.ai.
              </p>
            </div>
          </Card>

          {/* Important Notice Card */}
          <Card className="p-6 md:p-8 mb-16 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 dark:bg-yellow-800/50 p-3 rounded-full">
                <AlertTriangle className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Important Notice</h3>
                <p className="text-muted-foreground">
                  This is a simplified version of our Terms of Service. For the complete legal terms, please refer to our Comprehensive Legal Terms document available upon request.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}