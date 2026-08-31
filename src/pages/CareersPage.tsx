import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Building, Users, Briefcase, ArrowRight, Clock, MapPin, Monitor } from 'lucide-react';

// Sample job listings data
const jobListings = [
  {
    id: 1,
    title: "AI Learning Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: true,
    postedDate: "June 15, 2025",
    description: "Design and implement AI algorithms for personalized learning experiences."
  },
  {
    id: 2,
    title: "Frontend Developer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    remote: true,
    postedDate: "June 10, 2025",
    description: "Build beautiful, responsive interfaces for our educational platform."
  },
  {
    id: 3,
    title: "UX Researcher",
    department: "Design",
    location: "Seattle, WA",
    type: "Full-time",
    remote: true,
    postedDate: "June 5, 2025",
    description: "Research and understand user needs to improve learning experiences."
  },
  {
    id: 4,
    title: "Content Strategist",
    department: "Content",
    location: "Austin, TX",
    type: "Full-time",
    remote: true,
    postedDate: "May 30, 2025",
    description: "Develop strategies for creating engaging educational content."
  },
  {
    id: 5,
    title: "Educational Psychologist",
    department: "Research",
    location: "Boston, MA",
    type: "Part-time",
    remote: true,
    postedDate: "May 25, 2025",
    description: "Apply cognitive psychology principles to improve learning outcomes."
  },
  {
    id: 6,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Full-time",
    remote: false,
    postedDate: "May 20, 2025",
    description: "Lead marketing efforts to promote our educational platform."
  }
];

// Team values
const values = [
  {
    icon: Users,
    title: "Collaborative Innovation",
    description: "We believe the best ideas come from diverse teams working together toward a common goal."
  },
  {
    icon: Building,
    title: "Education First",
    description: "Every decision we make puts learners and educational outcomes at the center."
  },
  {
    icon: Briefcase,
    title: "Growth Mindset",
    description: "We embrace challenges and see effort as a path to mastery, both for ourselves and our users."
  }
];

export default function CareersPage() {
  const [filter, setFilter] = React.useState("All Departments");
  
  // Filtered job listings based on department selection
  const filteredJobs = filter === "All Departments" 
    ? jobListings 
    : jobListings.filter(job => job.department === filter);

  // Unique departments for filter
  const departments = ["All Departments", ...new Set(jobListings.map(job => job.department))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
            >
              Join Our Mission
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              Help us transform education through AI-powered personalized learning
            </motion.p>
          </div>

          {/* Company Culture */}
          <div className="mb-24">
            <Card className="overflow-hidden border-primary/10">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">Life at EchoVerse</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    At EchoVerse, we're building the future of education. Our team is passionate about 
                    creating innovative solutions that make learning more accessible, effective, and enjoyable.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Collaborative Environment</h3>
                        <p className="text-muted-foreground">Work alongside talented professionals who are passionate about education</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Monitor className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Flexible Work Arrangements</h3>
                        <p className="text-muted-foreground">Remote-friendly culture with flexible hours and work-life balance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Growth Opportunities</h3>
                        <p className="text-muted-foreground">Continuous learning and career development in a rapidly growing startup</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-full min-h-[400px]">
                  <img
                    src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Team working together"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Our Values */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The principles that guide our work and company culture
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-8 h-full flex flex-col border-primary/10 hover:border-primary/30 transition-all duration-300">
                    <div className="bg-primary/10 p-4 rounded-lg w-fit mb-6">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Open Positions */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join our team and help shape the future of education
              </p>
              
              {/* Department filter */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {departments.map(dept => (
                  <Button 
                    key={dept} 
                    variant={filter === dept ? "default" : "outline"}
                    onClick={() => setFilter(dept)}
                    className="rounded-full"
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="p-6 hover:border-primary/30 transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {job.department}
                          </span>
                          {job.remote && (
                            <span className="text-sm bg-muted text-muted-foreground px-2 py-1 rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground mt-2">{job.description}</p>
                      </div>
                      <div className="flex flex-col md:items-end gap-4">
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Posted {job.postedDate}
                          </span>
                        </div>
                        <Button className="gap-2">
                          Apply Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No open positions in this department currently.</p>
              </div>
            )}
          </section>

          {/* Hiring Process */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                What to expect when applying to EchoVerse
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[22px] top-10 bottom-10 w-1 bg-primary/20 rounded-full"></div>
                
                <div className="space-y-12">
                  {[
                    { step: 1, title: "Application Review", description: "Our team reviews your application and resume." },
                    { step: 2, title: "Initial Conversation", description: "A brief call to discuss your background and interest in EchoVerse." },
                    { step: 3, title: "Technical/Skills Assessment", description: "Complete a relevant assignment based on the role you're applying for." },
                    { step: 4, title: "Team Interviews", description: "Meet with several team members to discuss your experience and fit." },
                    { step: 5, title: "Decision & Offer", description: "We'll get back to you with our decision as quickly as possible." }
                  ].map((item) => (
                    <motion.div 
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: item.step * 0.1 }}
                      className="flex items-start gap-6"
                    >
                      <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 border-4 border-background text-primary font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="pt-2">
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-2xl max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Don't See a Perfect Fit?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're always looking for talented individuals. Send us your resume and tell us how you can contribute to our mission.
              </p>
              <Button size="lg" className="gap-2">
                Send Open Application
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}