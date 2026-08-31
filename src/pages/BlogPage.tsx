import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CalendarDays, Clock, ArrowRight, Search, User, Tag } from 'lucide-react';

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Personalized Learning",
    excerpt: "Discover how artificial intelligence is revolutionizing education by creating tailored learning experiences for every student.",
    author: "Sarah Johnson",
    date: "June 15, 2025",
    readTime: "8 min read",
    category: "AI Education",
    image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 2,
    title: "How Deep Research Enhances Learning Outcomes",
    excerpt: "Learn how our autonomous research agent helps students develop deeper understanding and critical thinking skills.",
    author: "Michael Chen",
    date: "June 10, 2025",
    readTime: "6 min read",
    category: "Research Tools",
    image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 3,
    title: "Animation Studio: Bringing Educational Content to Life",
    excerpt: "See how dynamic visualizations can transform abstract concepts into engaging learning experiences.",
    author: "Emma Rodriguez",
    date: "June 5, 2025",
    readTime: "7 min read",
    category: "Visual Learning",
    image: "https://images.pexels.com/photos/6238066/pexels-photo-6238066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 4,
    title: "Learning Styles: Myth or Reality?",
    excerpt: "Examining the science behind learning styles and how technology can adapt to individual differences.",
    author: "David Park",
    date: "May 28, 2025",
    readTime: "10 min read",
    category: "Learning Science",
    image: "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 5,
    title: "The Role of AI in Addressing Global Education Gaps",
    excerpt: "Exploring how artificial intelligence can help bridge educational disparities worldwide.",
    author: "Priya Sharma",
    date: "May 20, 2025",
    readTime: "9 min read",
    category: "Global Education",
    image: "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 6,
    title: "From Content Consumption to Active Learning",
    excerpt: "How EchoVerse transforms passive educational content into interactive learning experiences.",
    author: "James Wilson",
    date: "May 15, 2025",
    readTime: "5 min read",
    category: "Learning Methods",
    image: "https://images.pexels.com/photos/5428826/pexels-photo-5428826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

// Categories for filtering
const categories = [
  "All Categories",
  "AI Education",
  "Research Tools",
  "Visual Learning",
  "Learning Science",
  "Global Education",
  "Learning Methods"
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
            >
              EchoVerse Blog
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              Insights, updates, and deep dives into the future of AI-powered education
            </motion.p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-5xl mx-auto mb-12">
            <Card className="p-6 bg-background/80 backdrop-blur-sm border-primary/10 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background/50"
                  />
                </div>
                <select className="p-3 border border-border rounded-lg bg-background/50">
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </Card>
          </div>

          {/* Featured Post */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <Card className="overflow-hidden border-primary/10 group hover:shadow-xl hover:border-primary/30 transition-all duration-300">
              <div className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-3 h-64 md:h-auto overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Featured blog post" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Featured</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    Revolutionizing Education: How AI Adapts to Individual Learning Styles
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Our groundbreaking research reveals how adaptive AI technology can identify and respond to individual learning preferences, creating truly personalized educational experiences.
                  </p>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>June 20, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>12 min read</span>
                    </div>
                  </div>
                  <Button className="w-fit gap-2">
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Posts */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">Recent Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50 hover:border-primary/30">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                          <Tag className="h-3 w-3 inline-block mr-1" />
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Button variant="outline" className="gap-2">
                Load More Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Newsletter Sign Up */}
          <div className="max-w-3xl mx-auto text-center">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4">Stay Up To Date</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Sign up for our newsletter to receive the latest articles, research insights, and platform updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-lg border border-border bg-background/50"
                />
                <Button className="px-6">Subscribe</Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}