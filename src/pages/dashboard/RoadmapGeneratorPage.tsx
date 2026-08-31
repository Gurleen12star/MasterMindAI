import { useState } from 'react';
import { GitBranch, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export default function RoadmapGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const { toast } = useToast();

  const generateRoadmap = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with Gemini API
      const mockRoadmap = {
        nodes: [
          { id: '1', title: 'Getting Started', description: 'Introduction to the topic' },
          { id: '2', title: 'Fundamentals', description: 'Core concepts and basics' },
          { id: '3', title: 'Advanced Topics', description: 'Deep dive into complex areas' },
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
        ],
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('roadmaps')
        .insert([
          {
            topic,
            data: mockRoadmap,
            user_id: 'user_id', // TODO: Get from Clerk
          },
        ])
        .select();

      if (error) throw error;

      setRoadmap(mockRoadmap);
      toast({
        title: 'Success',
        description: 'Roadmap generated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate roadmap',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <GitBranch className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Roadmap Generator</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Learning Roadmap</CardTitle>
          <CardDescription>
            Enter a topic to generate a personalized learning roadmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter a topic (e.g., 'Machine Learning', 'Web Development')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1"
            />
            <Button onClick={generateRoadmap} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </div>

          {roadmap && (
            <ScrollArea className="h-[400px] mt-6 rounded-md border p-4">
              <pre className="text-sm">
                {JSON.stringify(roadmap, null, 2)}
              </pre>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}