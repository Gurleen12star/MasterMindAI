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
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Join thousands of satisfied users who have transformed their learning journey.
          </p>
          
          <div className="overflow-hidden mt-12">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <BentoBox gradient="blue" className="mx-auto max-w-4xl backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/30 transition-all duration-500 bento-modern shadow-inner-modern rounded-3xl">
                    <div className="flex flex-col items-center text-center p-8">
                      <div className="relative mb-6">
                        <Quote className="h-12 w-12 text-primary/60" />
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary/20 animate-pulse" />
                      </div>
                      <p className="mt-4 text-lg md:text-xl leading-relaxed text-foreground font-medium">
                        "{testimonial.content}"
                      </p>
                      <div className="mt-8 flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-primary/20 shadow-lg">
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground">{testimonial.author}</p>
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
          
          <div className="mt-8 flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-3 w-3 rounded-full transition-all duration-300 shadow-sm",
                    index === activeIndex
                      ? "bg-primary scale-125 shadow-lg shadow-primary/30"
                      : "bg-primary/30 hover:bg-primary/50 hover:scale-110"
                  )}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}