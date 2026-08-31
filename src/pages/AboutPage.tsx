import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Info, Users, ArrowRight, Building, Award, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Our Mission
            </h1>
            <p className="text-xl text-muted-foreground">
              At EchoVerse, we're on a mission to transform how people learn by creating personalized, 
              AI-powered educational experiences that adapt to each individual's unique needs and preferences.
            </p>
          </div>

          {/* Vision and Values */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-24"
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-background via-muted/10 to-background border-2 border-primary/20 rounded-2xl">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-6">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We envision a world where education is boundless, personalized, and accessible to everyone. 
                    By harnessing the power of AI, we're creating learning experiences that adapt to individual 
                    learning styles, pace, and interests.
                  </p>
                </div>

                <div>
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-6">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                  <ul className="space-y-3 text-lg text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      </div>
                      <span>Innovation in learning technologies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      </div>
                      <span>Inclusive and accessible education</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/20 p-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      </div>
                      <span>Ethical AI development and implementation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Leadership Team */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Leadership Team</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Meet the passionate individuals driving innovation in AI-powered education
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  title: "Founder & CEO",
                  bio: "Former education technology executive with a passion for democratizing access to quality education.",
                  image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                },
                {
                  name: "Michael Chen",
                  title: "Chief Technology Officer",
                  bio: "AI researcher with over 10 years of experience developing adaptive learning systems.",
                  image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                },
                {
                  name: "Amara Patel",
                  title: "Chief Learning Officer",
                  bio: "Former university professor specializing in cognitive science and learning methodologies.",
                  image: "https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg"
                }
              ].map((person, index) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="h-56 overflow-hidden">
                      <img 
                        src={person.image} 
                        alt={person.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                      <p className="text-primary text-sm mb-3">{person.title}</p>
                      <p className="text-muted-foreground">{person.bio}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-6">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    EchoVerse began in 2024 with a simple yet ambitious goal: to reimagine education for the AI era.
                  </p>
                  <p>
                    Founded by a team of educators, technologists, and lifelong learners, we recognized that traditional educational models weren't adapting quickly enough to individual needs and learning styles.
                  </p>
                  <p>
                    By leveraging cutting-edge AI technology, we've created a platform that truly understands how each person learns and adapts content delivery accordingly—making education more effective, engaging, and accessible for everyone.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl"></div>
                <Card className="relative z-10 p-8 border-primary/20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">Company Founded</h3>
                        <p className="text-muted-foreground">February 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">First 1,000 Users</h3>
                        <p className="text-muted-foreground">May 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">Educational Innovation Award</h3>
                        <p className="text-muted-foreground">June 2024</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-2xl max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Be part of the educational revolution. Together, we're building the future of learning.
              </p>
              <Button size="lg" className="gap-2">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}