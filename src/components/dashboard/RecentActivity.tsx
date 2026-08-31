import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Video, FileText, MessageSquare } from 'lucide-react';

const activities = [
  {
    type: 'course',
    title: 'Machine Learning Basics',
    description: 'Completed Chapter 3: Neural Networks',
    icon: BookOpen,
    time: '2 hours ago',
  },
  {
    type: 'video',
    title: 'Introduction to Python',
    description: 'Watched 15 minutes',
    icon: Video,
    time: '4 hours ago',
  },
  {
    type: 'article',
    title: 'Web Development Best Practices',
    description: 'Read 5 minute article',
    icon: FileText,
    time: '6 hours ago',
  },
  {
    type: 'discussion',
    title: 'React Hooks Discussion',
    description: 'Posted a reply',
    icon: MessageSquare,
    time: '1 day ago',
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your learning activities from the past 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-accent/50"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{activity.title}</p>
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