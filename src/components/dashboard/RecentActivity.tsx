import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Video, FileText, MessageSquare, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const activities = [
  {
    type: 'course',
    title: 'Machine Learning Basics',
    description: 'Completed Chapter 3: Neural Networks',
    icon: BookOpen,
    time: '2 hours ago',
    status: 'completed'
  },
  {
    type: 'video',
    title: 'Introduction to Python',
    description: 'Watched 15 minutes',
    icon: Video,
    time: '4 hours ago',
    status: 'in-progress'
  },
  {
    type: 'article',
    title: 'Web Development Best Practices',
    description: 'Read 5 minute article',
    icon: FileText,
    time: '6 hours ago',
    status: 'completed'
  },
  {
    type: 'discussion',
    title: 'React Hooks Discussion',
    description: 'Posted a reply',
    icon: MessageSquare,
    time: '1 day ago',
    status: 'new'
  },
];

export default function RecentActivity() {
  return (
    <Card className="backdrop-blur-sm bg-[#2A2B32] border-0 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your learning activities from the past 24 hours</CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
                  <activity.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.title}</p>
                    <Badge
                      variant={activity.status === 'completed' ? 'default' : 'secondary'}
                      className={
                        activity.status === 'in-progress'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : activity.status === 'new'
                          ? 'bg-green-500/10 text-green-500'
                          : ''
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}