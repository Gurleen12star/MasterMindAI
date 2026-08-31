import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, GripVertical, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  duration: string;
}

export default function RoadmapBuilder() {
  const [topic, setTopic] = useState('');
  const [nodes, setNodes] = useState<RoadmapNode[]>([
    {
      id: '1',
      title: 'Fundamentals',
      description: 'Master the basic concepts and principles',
      status: 'completed',
      duration: '2 weeks'
    },
    {
      id: '2',
      title: 'Advanced Concepts',
      description: 'Deep dive into advanced topics',
      status: 'in-progress',
      duration: '3 weeks'
    },
    {
      id: '3',
      title: 'Practical Projects',
      description: 'Build real-world applications',
      status: 'pending',
      duration: '4 weeks'
    }
  ]);

  const addNode = () => {
    const newNode: RoadmapNode = {
      id: Date.now().toString(),
      title: 'New Milestone',
      description: 'Describe this milestone',
      status: 'pending',
      duration: '1 week'
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

  const updateNode = (id: string, updates: Partial<RoadmapNode>) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, ...updates } : node
    ));
  };

  const getStatusIcon = (status: RoadmapNode['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Learning Roadmap Builder</span>
            <Badge variant="outline" className="ml-2">Beta</Badge>
          </div>
          <Button onClick={addNode} size="sm" className="bg-primary/10 hover:bg-primary/20 text-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </CardTitle>
        <div className="flex gap-4 mt-4">
          <Input
            placeholder="Enter learning topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {nodes.map((node, index) => (
              <div
                key={node.id}
                className="group relative flex items-start gap-4 rounded-lg border border-border/50 p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-[32px]">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                  {getStatusIcon(node.status)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <Input
                    value={node.title}
                    onChange={(e) => updateNode(node.id, { title: e.target.value })}
                    className="font-medium bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                  />
                  <Input
                    value={node.description}
                    onChange={(e) => updateNode(node.id, { description: e.target.value })}
                    className="text-sm text-muted-foreground bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <Input
                      value={node.duration}
                      onChange={(e) => updateNode(node.id, { duration: e.target.value })}
                      className="w-24 bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const nextStatus: Record<RoadmapNode['status'], RoadmapNode['status']> = {
                        pending: 'in-progress',
                        'in-progress': 'completed',
                        completed: 'pending'
                      };
                      updateNode(node.id, { status: nextStatus[node.status] });
                    }}
                  >
                    {node.status}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeNode(node.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {index < nodes.length - 1 && (
                  <div className="absolute left-6 bottom-0 top-12 w-px bg-border/50 translate-y-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}