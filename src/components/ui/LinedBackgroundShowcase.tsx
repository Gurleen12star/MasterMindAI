import { Card } from '@/components/ui/card';

interface LinedBackgroundShowcaseProps {
  onSelectBackground: (backgroundClass: string) => void;
}

export default function LinedBackgroundShowcase({ onSelectBackground }: LinedBackgroundShowcaseProps) {
  const patterns = [
    {
      name: 'Grid Pattern',
      class: 'bg-grid-white/[0.02]',
      description: 'Classic grid pattern with subtle white lines'
    },
    {
      name: 'Enhanced Grid',
      class: 'bg-grid-enhanced',
      description: 'Multi-layered grid with different line weights'
    },
    {
      name: 'Horizontal Lines',
      class: 'bg-lines-horizontal',
      description: 'Horizontal lines across the background'
    },
    {
      name: 'Vertical Lines',
      class: 'bg-lines-vertical',
      description: 'Vertical lines across the background'
    },
    {
      name: 'Diagonal Lines',
      class: 'bg-lines-diagonal',
      description: 'Diagonal criss-cross pattern'
    },
    {
      name: 'Dots Pattern',
      class: 'bg-dots-pattern',
      description: 'Subtle dot pattern background'
    },
    {
      name: 'Blueprint Style',
      class: 'bg-blueprint',
      description: 'Technical blueprint-style grid'
    }
  ];

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Choose Your Lined Background</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((pattern) => (
          <Card 
            key={pattern.name}
            className="relative overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-primary/50"
            onClick={() => onSelectBackground(pattern.class)}
          >
            {/* Background Preview */}
            <div className={`absolute inset-0 ${pattern.class}`} />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
            
            {/* Content */}
            <div className="relative z-10 p-4">
              <h3 className="font-semibold text-lg mb-2">{pattern.name}</h3>
              <p className="text-sm text-muted-foreground">{pattern.description}</p>
              <div className="mt-3 px-3 py-1 bg-primary/20 rounded-full text-xs text-primary font-medium inline-block">
                Click to Apply
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 