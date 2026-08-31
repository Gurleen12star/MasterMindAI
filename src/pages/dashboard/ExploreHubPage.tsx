import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Sparkles, TrendingUp, Clock, BookOpen, Star } from 'lucide-react';

const trendingTopics = [
  { id: 1, name: 'Machine Learning', count: '2.3k learners' },
  { id: 2, name: 'Web Development', count: '1.8k learners' },
  { id: 3, name: 'Data Science', count: '1.5k learners' },
  { id: 4, name: 'UI/UX Design', count: '1.2k learners' },
  { id: 5, name: 'Blockchain', count: '950 learners' },
];

const featuredCourses = [
  {
    id: 1,
    title: 'Advanced Machine Learning',
    author: 'Dr. Sarah Chen',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    rating: 4.8,
    duration: '8 weeks',
  },
  {
    id: 2,
    title: 'Full-Stack Web Development',
    author: 'Michael Johnson',
    image: 'https://images.pexels.com/photos/7014766/pexels-photo-7014766.jpeg',
    rating: 4.9,
    duration: '12 weeks',
  },
  {
    id: 3,
    title: 'Data Science Fundamentals',
    author: 'Emily Rodriguez',
    image: 'https://images.pexels.com/photos/7376/startup-photos.jpg',
    rating: 4.7,
    duration: '10 weeks',
  },
];

const recentlyViewed = [
  {
    id: 1,
    title: 'Introduction to Python',
    progress: 65,
    lastViewed: '2 hours ago',
  },
  {
    id: 2,
    title: 'React Hooks Masterclass',
    progress: 30,
    lastViewed: '5 hours ago',
  },
  {
    id: 3,
    title: 'UI Design Principles',
    progress: 85,
    lastViewed: 'Yesterday',
  },
];

export default function ExploreHubPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Explore Hub</h1>
        <p className="text-muted-foreground">
          Discover personalized learning content tailored to your interests
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl" />
        <Card className="p-6 backdrop-blur-xl bg-background/20 border-primary/10">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for topics, courses, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50"
            />
            <Button className="ml-2 gap-2">
              <Sparkles className="h-4 w-4" />
              Search
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Featured Content</h2>
              <Button variant="ghost" className="gap-2">
                <Star className="h-4 w-4" />
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -5 }}
                  className="group relative rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 z-10" />
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-white font-medium">{course.title}</h3>
                    <p className="text-white/80 text-sm">{course.author}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/90 text-sm flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> {course.rating}
                      </span>
                      <span className="text-white/90 text-sm">{course.duration}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <Tabs defaultValue="trending">
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="trending" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Recent
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm">View All</Button>
              </div>

              <TabsContent value="trending" className="mt-0">
                <div className="space-y-4">
                  {trendingTopics.map((topic) => (
                    <motion.div
                      key={topic.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{topic.name}</h4>
                          <p className="text-sm text-muted-foreground">{topic.count}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Explore</Button>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-0">
                <div className="space-y-4">
                  {recentlyViewed.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.lastViewed}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-1 rounded-full bg-primary/20">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <Button variant="ghost" size="sm">Continue</Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recommended Topics</h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto py-3"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Topic {i + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 1000)} learners
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">AI Recommendations</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your learning history and interests, we think you'll enjoy:
            </p>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Recommended Course {i + 1}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 100)}% match
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}