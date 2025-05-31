import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Award, 
  CheckCircle, 
  Calendar, 
  FileText, 
  Users, 
  ArrowRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const Nominations = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 bg-tpahla-darkgreen text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/african-pattern.jpg')] bg-repeat opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-tpahla-darkgreen to-tpahla-darkgreen/90"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Award className="h-16 w-16 text-tpahla-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-tpahla-gold">
              Nominations
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-tpahla-text-secondary mb-8">
              Submit Your Nominations for The Pan-African Humanitarian Leadership Award
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Calendar className="h-4 w-4 text-tpahla-gold mr-2" />
                <span className="text-sm">Deadline: August 15, 2025</span>
              </div>
              <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <CheckCircle className="h-4 w-4 text-tpahla-gold mr-2" />
                <span className="text-sm">10 Award Categories</span>
              </div>
              <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <FileText className="h-4 w-4 text-tpahla-gold mr-2" />
                <span className="text-sm">Simple 5-Step Process</span>
              </div>
            </div>
            
            <Link to="/nomination-form">
              <Button size="lg" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                Start Your Nomination
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      <main className="bg-background dark:bg-gray-900">
        {/* Nomination Process Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">
              Nomination Process
            </h2>
            <p className="text-lg text-tpahla-text-secondary">
              Nominate outstanding leaders, organizations, and institutions making significant humanitarian impact across Africa
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[24px] top-8 bottom-0 w-0.5 bg-tpahla-gold/30 hidden md:block"></div>
              
              {/* Timeline Steps */}
              <div className="space-y-12 relative">
                {[
                  {
                    number: "01",
                    title: "Review Eligibility Criteria",
                    description: "Ensure your nominee meets all the requirements for their chosen award category.",
                    icon: CheckCircle,
                    color: "bg-tpahla-emerald"
                  },
                  {
                    number: "02",
                    title: "Complete Nomination Form",
                    description: "Fill out the detailed nomination form with accurate information about the nominee.",
                    icon: FileText,
                    color: "bg-tpahla-gold"
                  },
                  {
                    number: "03",
                    title: "Submit Supporting Documents",
                    description: "Upload all required evidence and documentation to strengthen the nomination.",
                    icon: FileText,
                    color: "bg-tpahla-purple"
                  },
                  {
                    number: "04",
                    title: "Verification Process",
                    description: "Our team reviews and verifies all submitted information for accuracy.",
                    icon: CheckCircle,
                    color: "bg-tpahla-emerald"
                  },
                  {
                    number: "05",
                    title: "Judging & Selection",
                    description: "Nominations are evaluated by our panel of judges based on established criteria.",
                    icon: Users,
                    color: "bg-tpahla-gold"
                  }
                ].map((step, index) => (
                  <motion.div 
                    key={index} 
                    className="flex flex-col md:flex-row gap-6"
                    variants={itemVariants}
                  >
                    <div className="flex-shrink-0 flex md:block">
                      <div className={`w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center font-bold text-lg z-10`}>
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-grow bg-tpahla-neutral p-6 rounded-lg shadow-md border border-tpahla-gold/20">
                      <div className="flex items-center mb-3">
                        <step.icon className="h-5 w-5 text-tpahla-gold mr-2" />
                        <h3 className="text-xl font-serif font-bold text-tpahla-gold">{step.title}</h3>
                      </div>
                      <p className="text-tpahla-text-secondary">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Eligibility Criteria Section */}
        <section className="py-16 bg-tpahla-neutral-light">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">
                Eligibility Criteria
              </h2>
              <p className="text-lg text-tpahla-text-secondary">
                To be considered for a TPAHLA award, nominees must meet the following criteria
              </p>
            </motion.div>
            
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="individuals" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="individuals" className="data-[state=active]:bg-tpahla-gold data-[state=active]:text-tpahla-darkgreen">Individuals</TabsTrigger>
                  <TabsTrigger value="organizations" className="data-[state=active]:bg-tpahla-gold data-[state=active]:text-tpahla-darkgreen">Organizations</TabsTrigger>
                  <TabsTrigger value="institutions" className="data-[state=active]:bg-tpahla-gold data-[state=active]:text-tpahla-darkgreen">Institutions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="individuals" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Demonstrated leadership in humanitarian service within Africa for at least 3 years</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Measurable impact on communities or social issues with documented evidence</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Innovative approaches to addressing humanitarian challenges</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Ethical conduct and reputation in professional activities</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Commitment to sustainable development goals and principles</p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="organizations" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Legally registered entity with at least 5 years of operation in Africa</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Demonstrated excellence in humanitarian service delivery with measurable outcomes</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Transparent governance and financial management practices</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Significant and measurable impact on target communities</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Collaborative approach with other stakeholders in the humanitarian ecosystem</p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="institutions" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Established academic, research, or public institution with humanitarian focus</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Significant contributions to humanitarian knowledge, policy, or practice</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Demonstrated commitment to capacity building in humanitarian sectors</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Innovative programs or initiatives with measurable humanitarian impact</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                          <p className="text-tpahla-text-secondary">Recognition within the humanitarian community for excellence</p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-tpahla-text-secondary">
                Find answers to common questions about the nomination process
              </p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "When is the nomination deadline?",
                    answer: "All nominations must be submitted by August 15, 2025. Late submissions will not be considered."
                  },
                  {
                    question: "Is there a fee to submit a nomination?",
                    answer: "No, there is no cost associated with submitting a nomination for any award category."
                  },
                  {
                    question: "Can I nominate myself or my organization?",
                    answer: "Yes, self-nominations are accepted and will be evaluated using the same criteria as other nominations."
                  },
                  {
                    question: "How many nominations can I submit?",
                    answer: "You may submit up to three nominations across different categories. Please ensure each nomination is complete and meets all requirements."
                  },
                  {
                    question: "What supporting documents are required?",
                    answer: "Required documents include the nominee's CV/resume, high-resolution photographs or media files showcasing their work, and any additional supporting materials that demonstrate their impact and achievements."
                  },
                  {
                    question: "How will I know if my nomination has been received?",
                    answer: "You will receive an email confirmation once your nomination has been successfully submitted. You can also check the status of your nomination by logging into your account."
                  },
                  {
                    question: "When will finalists be announced?",
                    answer: "Finalists will be announced on September 15, 2025. All nominators and nominees will be notified by email."
                  }
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-tpahla-gold/20">
                    <AccordionTrigger className="text-tpahla-text-primary hover:text-tpahla-gold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-tpahla-text-secondary">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-16 bg-tpahla-neutral-light">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">
                Nomination Timeline
              </h2>
              <p className="text-lg text-tpahla-text-secondary">
                Key dates for the TPAHLA 2025 nomination and selection process
              </p>
            </motion.div>
            
            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-tpahla-gold/30 transform md:translate-x-px hidden md:block"></div>
                
                {/* Timeline Events */}
                <div className="space-y-12 relative">
                  {[
                    {
                      date: "June 1, 2025",
                      title: "Nominations Open",
                      description: "The nomination portal opens for all categories.",
                      icon: Calendar,
                      align: "right"
                    },
                    {
                      date: "August 15, 2025",
                      title: "Nominations Close",
                      description: "Final deadline for all nomination submissions.",
                      icon: Clock,
                      align: "left"
                    },
                    {
                      date: "August 16 - September 14, 2025",
                      title: "Judging Period",
                      description: "Panel of judges reviews all nominations.",
                      icon: Users,
                      align: "right"
                    },
                    {
                      date: "September 15, 2025",
                      title: "Finalists Announced",
                      description: "Shortlisted nominees are notified and announced.",
                      icon: Award,
                      align: "left"
                    },
                    {
                      date: "October 18, 2025",
                      title: "Awards Ceremony",
                      description: "Winners announced at the gala ceremony in Abuja.",
                      icon: Award,
                      align: "right"
                    }
                  ].map((event, index) => (
                    <div key={index} className={`flex flex-col ${event.align === "left" ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}>
                      <motion.div 
                        className="md:w-1/2 text-right"
                        initial={{ opacity: 0, x: event.align === "left" ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className={`inline-block md:${event.align === "left" ? "ml-auto" : "mr-auto"}`}>
                          <Badge className="mb-2 bg-tpahla-gold text-tpahla-darkgreen">{event.date}</Badge>
                          <h3 className="text-xl font-serif font-bold text-tpahla-gold mb-2">{event.title}</h3>
                          <p className="text-tpahla-text-secondary">{event.description}</p>
                        </div>
                      </motion.div>
                      
                      <div className="relative flex items-center justify-center">
                        <motion.div 
                          className={`w-12 h-12 rounded-full bg-tpahla-gold flex items-center justify-center z-10`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          <event.icon className="h-6 w-6 text-tpahla-darkgreen" />
                        </motion.div>
                      </div>
                      
                      <div className="md:w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-tpahla-darkgreen text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-tpahla-gold mb-6">
                Ready to Nominate an African Hero?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Your nomination can shine a light on extraordinary individuals and organizations making a significant impact.
                Click the button below to start the nomination process.
              </p>
              <Link to="/nomination-form">
                <Button size="lg" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90 group">
                  START A NOMINATION NOW
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Nominations;