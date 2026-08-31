import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const mockRoadmap = {
  nodes: [
    { id: '1', type: 'input', position: { x: 250, y: 25 }, data: { label: 'Start' } },
    { id: '2', position: { x: 100, y: 125 }, data: { label: 'Option A' } },
    { id: '3', position: { x: 400, y: 125 }, data: { label: 'Option B' } },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
  ],
};

export default function RoadmapGeneratorPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: 'Please enter a topic',
        description: 'A topic is required to generate a roadmap',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('roadmaps')
        .insert([
          {
            topic,
            data: mockRoadmap,
            user_id: user?.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Roadmap generated!',
        description: 'Your learning roadmap has been created successfully.',
      });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate roadmap. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Roadmap Generator</h2>
        <p className="text-muted-foreground">
          Generate personalized learning roadmaps powered by AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Generate New Roadmap</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What would you like to learn?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Machine Learning, Web Development"
                  className="w-full px-4 py-2 rounded-md border bg-background"
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Roadmap'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <ScrollArea className="h-[400px]">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">Your Roadmaps</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/50">
                    <div className="flex-1">
                      <p className="font-medium">Machine Learning Basics</p>
                      <p className="text-sm text-muted-foreground">Created 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}