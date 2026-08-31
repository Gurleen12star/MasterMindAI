import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, GraduationCap, Briefcase, Code, Palette } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    institution: "Stanford University",
    avatar: "SC",
    icon: GraduationCap,
    content: "EchoVerse's AI personalization is incredible. The platform adapted to my learning style and helped me master machine learning concepts 3x faster than traditional methods. The animated explanations made complex algorithms finally click!",
    rating: 5,
    highlight: "3x faster learning",
    badge: "AI/ML Focus"
  },
  {
    name: "Marcus Rodriguez",
    role: "Data Scientist",
    institution: "Google",
    avatar: "MR",
    icon: Briefcase,
    content: "The deep research feature is a game-changer for my work. It conducts thorough research with source attribution that would take me hours to do manually. The AI-generated learning paths helped me transition into advanced data science roles.",
    rating: 5,
    highlight: "Hours of work → Minutes",
    badge: "Professional Growth"
  },
  {
    name: "Emily Watson",
    role: "High School Teacher",
    institution: "Lincoln High School",
    avatar: "EW",
    icon: GraduationCap,
    content: "I use EchoVerse to create engaging animations for my physics classes. Students are more engaged and understand complex concepts better. The platform's ability to adapt explanations to different learning styles is remarkable.",
    rating: 5,
    highlight: "Increased student engagement",
    badge: "Education Innovation"
  },
  {
    name: "David Kim",
    role: "Software Engineer",
    institution: "Microsoft",
    avatar: "DK",
    icon: Code,
    content: "The roadmap generator helped me transition from frontend to full-stack development. The AI created a perfect learning sequence with hands-on projects. I landed my dream job in 6 months thanks to the structured learning approach.",
    rating: 5,
    highlight: "Career transition in 6 months",
    badge: "Career Change"
  },
  {
    name: "Priya Patel",
    role: "UX Designer",
    institution: "Adobe",
    avatar: "PP",
    icon: Palette,
    content: "As a visual learner, the interactive roadmaps and AI animations were perfect for me. The personalized content helped me master design thinking and user psychology. It's like having a personal AI tutor available 24/7.",
    rating: 5,
    highlight: "Perfect for visual learners",
    badge: "Design Mastery"
  },
  {
    name: "Alex Thompson",
    role: "Graduate Student",
    institution: "MIT",
    avatar: "AT",
    icon: GraduationCap,
    content: "The AI research agent helped me conduct comprehensive literature reviews for my thesis in record time. The quality of insights and source compilation exceeded my expectations. It's revolutionizing how I approach academic research.",
    rating: 5,
    highlight: "Research efficiency breakthrough",
    badge: "Academic Excellence"
  }
];

const stats = [
  { number: "50,000+", label: "Active Learners" },
  { number: "95%", label: "Success Rate" },
  { number: "4.9/5", label: "User Rating" },
  { number: "200+", label: "Learning Paths" }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">Trusted by Learners Worldwide</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Transforming Learning Experiences
            <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              One Student at a Time
            </span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Join thousands of learners who have revolutionized their education with AI-powered 
            personalization, achieving remarkable results and reaching their goals faster than ever.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="ring-2 ring-primary/20">
                        <AvatarImage src={`/avatars/${testimonial.avatar.toLowerCase()}.jpg`} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <testimonial.icon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Badge & Institution */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.badge}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {testimonial.institution}
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="relative flex-1 mb-4">
                    <Quote className="absolute top-0 left-0 h-4 w-4 text-primary/30 -translate-x-1 -translate-y-1" />
                    <p className="text-sm leading-relaxed pl-4">
                      {testimonial.content}
                    </p>
                  </div>

                  {/* Highlight */}
                  <div className="p-3 bg-primary/5 rounded-lg mb-4">
                    <p className="text-sm font-medium text-primary">
                      ✨ {testimonial.highlight}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({testimonial.rating}.0)
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 border border-primary/20">
            <h3 className="text-2xl font-bold mb-2">Join the Learning Revolution</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Experience the same transformative results. Start your personalized AI learning journey today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Start Your Free Trial
              <Star className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}