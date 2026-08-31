import { useState, useEffect, useCallback } from 'react';
import { BentoBox } from '@/components/ui/BentoBox';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    content:
      "EchoVerse has completely transformed how I consume educational content. The AI recommendations are incredibly accurate, and I love the audio transformation feature for learning on the go.",
    author: "Alex Chen",
    role: "Software Engineer",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    content:
      "As a content creator, the monetization features have been game-changing. I can now gate premium content and build a sustainable income stream while sharing my knowledge.",
    author: "Sarah Johnson",
    role: "Digital Creator",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    content:
      "The translation capability has opened up a world of content that was previously inaccessible to me. I can now learn from experts regardless of language barriers.",
    author: "Miguel Rodriguez",
    role: "Language Enthusiast",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    content:
      "The custom learning dashboard helps me track my progress and identify knowledge gaps. It's like having a personal learning coach guiding me every step of the way.",
    author: "Emma Thompson",
    role: "Medical Student",
    image: "https://images.pexels.com/photos/712521/pexels-photo-712521.jpeg?auto=compress&cs=tinysrgb&w=300"
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Join thousands of satisfied users who have transformed their learning journey.
          </p>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <BentoBox gradient="blue" className="mx-auto max-w-3xl">
                    <div className="flex flex-col items-center text-center">
                      <Quote className="h-10 w-10 text-primary/50" />
                      <p className="mt-4 text-lg md:text-xl">
                        "{testimonial.content}"
                      </p>
                      <div className="mt-6 flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-full">
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </BentoBox>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    index === activeIndex
                      ? "bg-primary"
                      : "bg-primary/20 hover:bg-primary/40"
                  )}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}