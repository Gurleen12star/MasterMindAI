import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Cookie, Clock, Check, X, AlertCircle, Shield } from 'lucide-react';

export default function CookiePolicyPage() {
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
              <Cookie className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Cookie Policy
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
                This Cookie Policy explains how EchoVerse ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
              
              <h2>1. What Are Cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case, EchoVerse) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
              </p>

              <h2>2. Why Do We Use Cookies?</h2>
              <p>
                We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our platform. Third parties serve cookies through our platform for analytics, personalization, and advertising purposes.
              </p>

              <h2>3. Types of Cookies We Use</h2>
              <p>
                The specific types of first and third-party cookies served through our platform and the purposes they perform include:
              </p>
              <h3>3.1. Essential Cookies</h3>
              <p>
                These cookies are strictly necessary to provide you with services available through our platform and to use some of its features, such as access to secure areas.
              </p>
              
              <h3>3.2. Performance and Functionality Cookies</h3>
              <p>
                These cookies are used to enhance the performance and functionality of our platform but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
              </p>
              
              <h3>3.3. Analytics and Customization Cookies</h3>
              <p>
                These cookies collect information that is used either in aggregate form to help us understand how our platform is being used or how effective our marketing campaigns are, or to help us customize our platform for you.
              </p>
              
              <h3>3.4. Advertising Cookies</h3>
              <p>
                These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
              </p>
              
              <h3>3.5. Social Media Cookies</h3>
              <p>
                These cookies are used to enable you to share pages and content that you find interesting on our platform through third-party social networking and other websites. These cookies may also be used for advertising purposes.
              </p>

              <h2>4. How Can You Control Cookies?</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner or by setting or amending your web browser controls to accept or refuse cookies.
              </p>
              <p>
                If you choose to reject cookies, you may still use our platform though your access to some functionality and areas may be restricted. You may also set your browser to reject cookies or to alert you when a cookie is placed on your computer.
              </p>

              <h2>5. How Often Will We Update This Cookie Policy?</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
              <p>
                The date at the top of this Cookie Policy indicates when it was last updated.
              </p>

              <h2>6. Where Can You Get Further Information?</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please email us at privacy@echoverse.ai.
              </p>
            </div>
          </Card>

          {/* Cookie Preferences Manager */}
          <Card className="p-6 md:p-8 mb-16 border-primary/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Manage Your Cookie Preferences
            </h2>
            <p className="text-muted-foreground mb-6">
              You can customize your cookie preferences below. Please note that disabling some types of cookies may impact your experience on our platform and the services we are able to offer.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between p-4 rounded-lg border border-primary/10 bg-accent/50">
                <div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <h3 className="font-bold">Essential Cookies</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Required cookies that enable core functionality. The platform cannot function properly without these cookies, and they can only be disabled by changing your browser preferences.
                  </p>
                </div>
                <Switch id="essential" defaultChecked disabled />
              </div>
              
              <div className="flex items-start justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Performance Cookies</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cookies that help us monitor and improve the performance of our platform. These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                  </p>
                </div>
                <Switch id="performance" defaultChecked />
              </div>
              
              <div className="flex items-start justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Functional Cookies</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cookies that enable the website to provide enhanced functionality and personalization. These cookies may be set by us or by third-party providers whose services we have added to our pages.
                  </p>
                </div>
                <Switch id="functional" defaultChecked />
              </div>
              
              <div className="flex items-start justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Marketing Cookies</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cookies that are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                  </p>
                </div>
                <Switch id="marketing" />
              </div>
            </div>
          </Card>

          {/* Third-party cookies section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Third-Party Cookies We Use</h2>
            
            <div className="overflow-hidden rounded-xl border border-primary/10">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-semibold">Provider</th>
                    <th className="text-left p-4 font-semibold">Purpose</th>
                    <th className="text-left p-4 font-semibold">Expiry</th>
                    <th className="text-left p-4 font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { provider: "Google Analytics", purpose: "Analytics tracking", expiry: "2 years", type: "Analytics" },
                    { provider: "Hotjar", purpose: "User behavior analysis", expiry: "1 year", type: "Analytics" },
                    { provider: "Intercom", purpose: "Customer support chat", expiry: "6 months", type: "Functional" },
                    { provider: "Facebook Pixel", purpose: "Advertising", expiry: "3 months", type: "Marketing" },
                    { provider: "Stripe", purpose: "Payment processing", expiry: "Session", type: "Essential" }
                  ].map((cookie, index) => (
                    <tr key={index} className="hover:bg-muted/30">
                      <td className="p-4">{cookie.provider}</td>
                      <td className="p-4">{cookie.purpose}</td>
                      <td className="p-4">{cookie.expiry}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          cookie.type === "Essential" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          cookie.type === "Functional" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                          cookie.type === "Analytics" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                          {cookie.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Do Not Track section */}
          <Card className="p-6 md:p-8 mb-16 bg-muted/30 border-primary/10">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Do Not Track Signal</h3>
                <p className="text-muted-foreground">
                  Some browsers have incorporated "Do Not Track" (DNT) features that can send a signal to the websites you visit indicating you do not wish to be tracked. Because there is not yet a common understanding of how to interpret the DNT signal, our platform currently does not respond to browser DNT signals. However, you can use the range of other tools we provide to control data collection and use, including the ability to opt out of receiving marketing from us.
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