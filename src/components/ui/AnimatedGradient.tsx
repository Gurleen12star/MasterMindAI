import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedGradient({
  className,
  children,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });

    resizeObserver.observe(canvas);

    // Animation parameters
    const circles: Circle[] = [];
    const maxRadius = Math.max(canvas.width, canvas.height) * 0.4;
    const colors = [
      [99, 102, 241, 0.05], // indigo
      [79, 70, 229, 0.05], // purple
      [45, 212, 191, 0.05], // teal
    ];

    class Circle {
      x: number;
      y: number;
      radius: number;
      color: number[];
      vx: number;
      vy: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = maxRadius * (0.3 + Math.random() * 0.7);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.05;
        this.vy = (Math.random() - 0.5) * 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius)
          this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius)
          this.y = -this.radius;
      }

      draw() {
        if (!ctx) return;
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        gradient.addColorStop(
          0,
          `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.color[3]})`
        );
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create initial circles
    for (let i = 0; i < 5; i++) {
      circles.push(new Circle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach((circle) => {
        circle.update();
        circle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-80"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}