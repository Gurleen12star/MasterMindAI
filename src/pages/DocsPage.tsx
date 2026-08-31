import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookOpen, Search, ArrowRight, FileText, Code, Video, FileCode, Lightbulb, PanelLeft, ChevronRight } from 'lucide-react';

export default function DocsPage() {
  // Sample data for documentation categories
  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      articles: [
        { id: "introduction", title: "Introduction to EchoVerse" },
        { id: "quickstart", title: "Quickstart Guide" },
        { id: "account-setup", title: "Setting Up Your Account" },
        { id: "dashboard-overview", title: "Dashboard Overview" }
      ]
    },
    {
      id: "features",
      title: "Platform Features",
      icon: Lightbulb,
      articles: [
        { id: "deep-research", title: "Deep Research Agent" },
        { id: "learning-paths", title: "Learning Paths" },
        { id: "animation-studio", title: "Animation Studio" },
        { id: "personalized-learning", title: "Personalized Learning" }
      ]
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: Code,
      articles: [
        { id: "authentication", title: "Authentication" },
        { id: "endpoints", title: "Endpoints" },
        { id: "error-handling", title: "Error Handling" },
        { id: "rate-limits", title: "Rate Limits" }
      ]
    },
    {
      id: "tutorials",
      title: "Tutorials",
      icon: Video,
      articles: [
        { id: "creating-roadmap", title: "Creating Your First Roadmap" },
        { id: "research-project", title: "Conducting Deep Research" },
        { id: "custom-animations", title: "Generating Educational Animations" },
        { id: "personalized-teaching", title: "Setting Up Personalized Learning" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Documentation Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
            >
              Documentation
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Everything you need to know about using the EchoVerse platform
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search documentation..." 
                className="w-full pl-10 py-6 pr-4 rounded-lg border border-primary/20 focus-visible:ring-primary"
              />
            </motion.div>
          </div>

          {/* Documentation Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <Card className="lg:w-64 shrink-0 lg:sticky lg:top-32 lg:self-start h-fit border-primary/10">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentation
                </h3>
              </div>
              
              <div className="p-2">
                {categories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
                      <category.icon className="h-4 w-4 text-primary" />
                      <span>{category.title}</span>
                    </div>
                    <div className="mt-1 ml-4 pl-2 border-l border-border space-y-1">
                      {category.articles.map((article) => (
                        <a 
                          key={article.id}
                          href={`#${article.id}`}
                          className="flex items-center text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {article.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
              <Tabs defaultValue="getting-started">
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                  <TabsTrigger value="features">Platform Features</TabsTrigger>
                  <TabsTrigger value="api-reference">API Reference</TabsTrigger>
                  <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
                </TabsList>

                <TabsContent value="getting-started" className="pt-6 space-y-8">
                  {/* Introduction Article */}
                  <Card className="p-6 md:p-8 border-primary/10" id="introduction">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Introduction to EchoVerse</h2>
                    </div>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p>
                        EchoVerse is an AI-powered learning platform designed to transform how you discover, consume, and create educational content. Our platform adapts to your unique learning style, helping you master any subject more effectively.
                      </p>
                      
                      <h3>What Makes EchoVerse Different</h3>
                      <p>
                        Unlike traditional learning platforms, EchoVerse uses advanced AI to:
                      </p>
                      <ul>
                        <li>Personalize content based on your learning style and preferences</li>
                        <li>Generate dynamic learning paths tailored to your goals</li>
                        <li>Create visual explanations with our Animation Studio</li>
                        <li>Conduct deep research on any topic with autonomous AI agents</li>
                      </ul>

                      <h3>Key Components</h3>
                      <p>
                        The EchoVerse platform consists of several integrated components:
                      </p>
                      <ul>
                        <li><strong>Personalized Learning:</strong> AI-powered teaching tailored to your style</li>
                        <li><strong>Deep Research Agent:</strong> Comprehensive research on any topic</li>
                        <li><strong>Roadmap Generator:</strong> Visual learning paths for any subject</li>
                        <li><strong>Animation Studio:</strong> Turn concepts into educational animations</li>
                        <li><strong>Convo AI:</strong> Interactive video conversations about content</li>
                      </ul>

                      <div className="not-prose">
                        <Button className="mt-4 gap-2">
                          Continue to Quickstart Guide
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Quickstart Guide */}
                  <Card className="p-6 md:p-8 border-primary/10" id="quickstart">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Quickstart Guide</h2>
                    </div>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p>
                        Get up and running with EchoVerse in just a few minutes. This guide will walk you through the basics of setting up your account and starting your first learning session.
                      </p>
                      
                      <h3>Step 1: Create Your Account</h3>
                      <p>
                        Sign up using your email or social media accounts. Complete the quick onboarding process to help us understand your learning preferences.
                      </p>
                      <div className="not-prose bg-muted/30 p-4 rounded-lg">
                        <code className="text-sm whitespace-pre-wrap">
{`// Visit the signup page
https://echoverse.ai/signup`}
                        </code>
                      </div>

                      <h3>Step 2: Complete Your Profile</h3>
                      <p>
                        Provide information about your education level, learning style, and interests. This helps our AI personalize your experience.
                      </p>

                      <h3>Step 3: Explore the Dashboard</h3>
                      <p>
                        Familiarize yourself with the main dashboard, which provides access to all platform features.
                      </p>

                      <h3>Step 4: Start Your First Learning Session</h3>
                      <p>
                        Choose a topic you're interested in and start a personalized learning session. Our AI will adapt to your pace and style as you progress.
                      </p>

                      <div className="not-prose bg-primary/5 p-6 rounded-lg border border-primary/10 mt-6">
                        <h4 className="font-bold text-lg mb-2">Quick Tips</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/20 p-1 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span>Use the search function to quickly find topics</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/20 p-1 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span>Bookmark content to revisit later</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/20 p-1 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span>Try different AI personalities for varied learning experiences</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="pt-6 space-y-8">
                  {/* Deep Research Agent */}
                  <Card className="p-6 md:p-8 border-primary/10" id="deep-research">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Deep Research Agent</h2>
                    </div>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p>
                        The Deep Research Agent is an autonomous AI tool that conducts comprehensive research on any topic, combining information from multiple sources to create in-depth reports.
                      </p>
                      
                      <h3>Key Features</h3>
                      <ul>
                        <li><strong>Multi-depth Research:</strong> Explore topics from surface level to deep analysis</li>
                        <li><strong>Source Verification:</strong> Cross-reference information across multiple sources</li>
                        <li><strong>Citation Management:</strong> Properly attribute all sources in your research</li>
                        <li><strong>Structured Reports:</strong> Get well-organized reports with executive summaries</li>
                        <li><strong>Audio Conversion:</strong> Convert research reports to audio for learning on the go</li>
                      </ul>

                      <h3>Using the Deep Research Agent</h3>
                      <p>
                        To generate a research report:
                      </p>
                      <ol>
                        <li>Navigate to the Deep Research page in your dashboard</li>
                        <li>Enter your topic in the search field</li>
                        <li>Select the research depth (1-5)</li>
                        <li>Click "Start Deep Research"</li>
                        <li>Wait as the agent analyzes and synthesizes information</li>
                        <li>Review the comprehensive report, sources, and summaries</li>
                      </ol>

                      <div className="not-prose bg-muted/30 p-4 rounded-lg">
                        <code className="text-sm whitespace-pre-wrap">
{`// Example research query
Topic: "Quantum Computing Applications in Medicine"
Depth: 3
// This will generate a comprehensive report with verified sources`}
                        </code>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="api-reference" className="pt-6 space-y-8">
                  {/* API Authentication */}
                  <Card className="p-6 md:p-8 border-primary/10" id="authentication">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileCode className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">API Authentication</h2>
                    </div>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p>
                        The EchoVerse API uses API keys to authenticate requests. You can view and manage your API keys in the Dashboard.
                      </p>
                      
                      <h3>Authentication Methods</h3>
                      <p>
                        We support two authentication methods:
                      </p>
                      <ul>
                        <li><strong>API Key Authentication:</strong> For server-to-server communication</li>
                        <li><strong>JWT Authentication:</strong> For client-side applications</li>
                      </ul>

                      <h3>API Key Authentication</h3>
                      <p>
                        Include your API key in all requests as a header:
                      </p>
                      <div className="not-prose bg-muted/30 p-4 rounded-lg">
                        <code className="text-sm whitespace-pre-wrap">
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Keep your API keys secure! Do not expose them in browser code or share them publicly.
                      </p>

                      <h3>JWT Authentication</h3>
                      <p>
                        For client-side applications, use our SDK to handle JWT authentication:
                      </p>
                      <div className="not-prose bg-muted/30 p-4 rounded-lg">
                        <code className="text-sm whitespace-pre-wrap">
{`import { EchoVerseClient } from '@echoverse/client';

const client = new EchoVerseClient({
  environment: 'production'
});

const login = async () => {
  await client.auth.signIn({
    email: 'user@example.com',
    password: 'password'
  });
};`}
                        </code>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="tutorials" className="pt-6 space-y-8">
                  {/* Creating Roadmap Tutorial */}
                  <Card className="p-6 md:p-8 border-primary/10" id="creating-roadmap">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Creating Your First Roadmap</h2>
                    </div>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p>
                        This tutorial will guide you through creating your first learning roadmap with EchoVerse's Roadmap Generator.
                      </p>
                      
                      <h3>What You'll Learn</h3>
                      <ul>
                        <li>How to use the Roadmap Generator interface</li>
                        <li>Customizing your learning path</li>
                        <li>Saving and sharing your roadmap</li>
                        <li>Integrating roadmaps with your learning journey</li>
                      </ul>

                      <h3>Step-by-Step Guide</h3>
                      <ol>
                        <li>
                          <strong>Navigate to the Roadmap Generator</strong>
                          <p className="text-sm">
                            From your dashboard, click on "Roadmap Generator" in the sidebar navigation.
                          </p>
                        </li>
                        <li>
                          <strong>Enter Your Topic</strong>
                          <p className="text-sm">
                            Type the subject you want to learn in the topic field. For example: "Machine Learning", "Web Development", or "Digital Marketing".
                          </p>
                        </li>
                        <li>
                          <strong>Select Your Level</strong>
                          <p className="text-sm">
                            Choose from beginner, intermediate, or advanced to tailor the roadmap to your current knowledge level.
                          </p>
                        </li>
                        <li>
                          <strong>Generate Your Roadmap</strong>
                          <p className="text-sm">
                            Click "Generate" and wait while our AI creates your personalized learning path.
                          </p>
                        </li>
                        <li>
                          <strong>Review and Customize</strong>
                          <p className="text-sm">
                            Review both the text and visual representations of your roadmap. You can regenerate specific sections if needed.
                          </p>
                        </li>
                        <li>
                          <strong>Save Your Roadmap</strong>
                          <p className="text-sm">
                            Your roadmap will be automatically saved to your account for future reference.
                          </p>
                        </li>
                      </ol>

                      <div className="not-prose rounded-lg overflow-hidden border border-primary/10 mt-6">
                        <div className="bg-muted/30 p-3">
                          <h4 className="font-semibold">Video Tutorial</h4>
                        </div>
                        <div className="p-4 flex items-center justify-center h-64 bg-gradient-to-br from-black to-gray-900">
                          <Button className="gap-2">
                            <Video className="h-4 w-4" />
                            Play Video Tutorial
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}