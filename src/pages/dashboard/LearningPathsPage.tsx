import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, Star, ArrowRight, Users, Trophy } from 'lucide-react';

const featuredPaths = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    description: 'Master modern web development from frontend to backend',
    duration: '6 months',
    level: 'Intermediate',
    students: '2.3k',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/7014766/pexels-photo-7014766.jpeg',
    categories: ['Web Development', 'JavaScript', 'React', 'Node.js']
  },
  {
    id: 2,
    title: 'Machine Learning Engineer',
    description: 'From data analysis to deploying ML models',
    duration: '8 months',
    level: 'Advanced',
    students: '1.8k',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    categories: ['AI/ML', 'Python', 'Data Science']
  },
  {
    id: 3,
    title: 'UI/UX Design Mastery',
    description: 'Create beautiful and functional user experiences',
    duration: '4 months',
    level: 'Beginner',
    students: '1.5k',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    categories: ['Design', 'Figma', 'User Research']
  }
];

const popularCategories = [
  { name: 'Web Development', count: '12 paths' },
  { name: 'Data Science', count: '8 paths' },
  { name: 'Mobile Development', count: '6 paths' },
  { name: 'Cloud Computing', count: '5 paths' },
  { name: 'Cybersecurity', count: '4 paths' },
  { name: 'DevOps', count: '4 paths' }
];

export default function LearningPathsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Learning Paths</h1>
        <p className="text-muted-foreground">
          Discover curated learning paths to master new skills and advance your career
        </p>
      </div>

      <div className="relative">
        <Card className="p-6 backdrop-blur-xl bg-background/20 border-primary/10">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search learning paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50"
            />
            <Button className="ml-2">Search</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Featured Paths</h2>
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-6">
              {featuredPaths.map((path) => (
                <motion.div
                  key={path.id}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-primary/10 transition-colors hover:border-primary/20">
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="relative h-48 md:h-auto md:w-72 rounded-lg overflow-hidden">
                        <img
                          src={path.image}
                          alt={path.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                          <p className="text-muted-foreground">{path.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {path.categories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {path.duration}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {path.students} students
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {path.rating}
                          </div>
                          <Badge variant="outline">{path.level}</Badge>
                        </div>
                        <div className="pt-4">
                          <Button className="gap-2">
                            Start Learning
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {popularCategories.map((category) => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto py-3"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.count}
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
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Your Progress</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Paths Completed</span>
                <span className="font-medium">2/5</span>
              </div>
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
              </div>
              <Button variant="outline" className="w-full">View Certificates</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}