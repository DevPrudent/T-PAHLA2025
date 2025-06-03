import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, CheckCircle, AlertCircle, HelpCircle, MessageSquare, Globe, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define form schema with Zod
const contactFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // React Hook Form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        });

      if (error) {
        throw error;
      }
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setIsSubmitted(true);
      form.reset();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
            <MessageSquare className="h-16 w-16 text-tpahla-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-tpahla-gold">
              Contact Us
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-tpahla-text-secondary">
              Get in Touch with The Pan-African Humanitarian Leadership Award Team
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Mail className="h-4 w-4 text-tpahla-gold mr-2" />
                <span className="text-sm">2025@tpahla.africa</span>
              </div>
              <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Phone className="h-4 w-4 text-tpahla-gold mr-2" />
                <span className="text-sm">
                  <a href="https://wa.me/2348104906878" target="_blank" rel="noopener noreferrer" className="font-bold">+234-810-490-6878 (WhatsApp)</a>
                </span>
              </div>
              <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Globe className="h-4 w-4 text-tpahla-gold mr-2" />
                <span className="text-sm">www.tpahla.org</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="py-16">
        {/* Contact Information & Form */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Contact Information */}
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">Get In Touch</h2>
                <p className="text-tpahla-text-secondary mb-8">
                  Have questions about The Pan-African Humanitarian Leadership Award? Our team is here to help. Please feel free to contact us using the information below or by filling out the contact form.
                </p>
                
                <Card className="mb-8 border-tpahla-gold/20 bg-tpahla-neutral">
                  <CardContent className="pt-6 space-y-6">
                    <motion.div 
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="bg-tpahla-gold/20 p-3 rounded-full mr-4">
                        <Globe className="h-6 w-6 text-tpahla-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tpahla-text-primary mb-1">Website</h3>
                        <p className="text-tpahla-text-secondary">
                          <a href="https://www.tpahla.org" target="_blank" rel="noopener noreferrer" className="hover:text-tpahla-gold transition-colors">www.tpahla.org</a><br />
                          <a href="https://www.ihsd-ng.org/TPAHLA" target="_blank" rel="noopener noreferrer" className="hover:text-tpahla-gold transition-colors">www.ihsd-ng.org/TPAHLA</a>
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="bg-tpahla-gold/20 p-3 rounded-full mr-4">
                        <Phone className="h-6 w-6 text-tpahla-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tpahla-text-primary mb-1">Phone</h3>
                        <p className="text-tpahla-text-secondary">
                          <a href="https://wa.me/2348104906878" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-tpahla-gold">+234-810-490-6878 (WhatsApp)</a><br />
                          +234-802-368-6143<br />
                          +234-706-751-9128<br />
                          +234-806-039-6906
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="bg-tpahla-gold/20 p-3 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-tpahla-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tpahla-text-primary mb-1">Email</h3>
                        <p className="text-tpahla-text-secondary">
                          <a href="mailto:2025@tpahla.africa" className="hover:text-tpahla-gold transition-colors">2025@tpahla.africa</a><br />
                          <a href="mailto:tpahla@ihsd-ng.org" className="hover:text-tpahla-gold transition-colors">tpahla@ihsd-ng.org</a>
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="bg-tpahla-gold/20 p-3 rounded-full mr-4">
                        <Clock className="h-6 w-6 text-tpahla-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-tpahla-text-primary mb-1">Office Hours</h3>
                        <p className="text-tpahla-text-secondary">
                          Monday - Friday: 9:00 AM - 5:00 PM (WAT)<br />
                          Saturday: 10:00 AM - 2:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
                
                <Card className="border-tpahla-gold/20 bg-tpahla-neutral">
                  <CardHeader>
                    <CardTitle className="text-tpahla-gold">Follow Us</CardTitle>
                    <CardDescription>Connect with us on social media</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <motion.a 
                        href="#" 
                        className="bg-tpahla-darkgreen text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tpahla-emerald transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </motion.a>
                      <motion.a 
                        href="#" 
                        className="bg-tpahla-darkgreen text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tpahla-emerald transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </motion.a>
                      <motion.a 
                        href="#" 
                        className="bg-tpahla-darkgreen text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tpahla-emerald transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </motion.a>
                      <motion.a 
                        href="#" 
                        className="bg-tpahla-darkgreen text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tpahla-emerald transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                        </svg>
                      </motion.a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Contact Form */}
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-tpahla-neutral rounded-lg shadow-md p-8 border border-tpahla-gold/20 text-center"
                  >
                    <CheckCircle className="h-16 w-16 text-tpahla-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-tpahla-gold mb-4">Message Sent Successfully!</h3>
                    <p className="text-tpahla-text-secondary mb-6">
                      Thank you for reaching out to us. Our team will review your message and get back to you as soon as possible.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)} 
                      className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <Card className="border-tpahla-gold/20 bg-tpahla-neutral">
                    <CardContent className="pt-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-tpahla-text-primary">First Name*</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter your first name" 
                                      {...field} 
                                      className="bg-tpahla-neutral-light border-tpahla-gold/20 text-tpahla-text-primary focus:border-tpahla-gold" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-tpahla-text-primary">Last Name*</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter your last name" 
                                      {...field} 
                                      className="bg-tpahla-neutral-light border-tpahla-gold/20 text-tpahla-text-primary focus:border-tpahla-gold" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-tpahla-text-primary">Email*</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="email" 
                                      placeholder="Enter your email address" 
                                      {...field} 
                                      className="bg-tpahla-neutral-light border-tpahla-gold/20 text-tpahla-text-primary focus:border-tpahla-gold" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-tpahla-text-primary">Phone (Optional)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="tel" 
                                      placeholder="Enter your phone number" 
                                      {...field} 
                                      className="bg-tpahla-neutral-light border-tpahla-gold/20 text-tpahla-text-primary focus:border-tpahla-gold" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-tpahla-text-primary">Subject*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-tpahla-neutral-light border-tpahla-gold/20 text-tpahla-text-primary focus:border-tpahla-gold">
                                      <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-tpahla-neutral border-tpahla-gold/20">
                                    <SelectItem value="general">General Inquiry</SelectItem>
                                    <SelectItem value="nominations">Nominations</SelectItem>
                                    <SelectItem value="sponsorship">Sponsorship</SelectItem>
                                    <SelectItem value="registration">Registration</SelectItem>
                                    <SelectItem value="media">Media & Press</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-tpahla-text-primary">Message*</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter your message here..." 
                                    rows={6} 
                                    {...field} 
                                    className="bg-tpahla-neutral-light border-tpahla-gold/20 text-tpahla-text-primary focus:border-tpahla-gold" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              type="submit" 
                              className="w-full bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90 py-6 text-lg" 
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-tpahla-darkgreen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-5 w-5" />
                                  Send Message
                                </>
                              )}
                            </Button>
                          </motion.div>
                          
                          <p className="text-center text-sm text-tpahla-text-secondary">
                            * Required fields
                          </p>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Help
Circle className="h-12 w-12 text-tpahla-gold mx-auto mb-4" />
              <h2 className="text-3xl font-serif font-bold mb-4 text-tpahla-gold">Frequently Asked Questions</h2>
              <p className="text-tpahla-text-secondary">
                Find answers to common questions about TPAHLA 2025
              </p>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="general" className="data-[state=active]:bg-tpahla-gold data-[state=active]:text-tpahla-darkgreen">General</TabsTrigger>
                <TabsTrigger value="nominations" className="data-[state=active]:bg-tpahla-gold data-[state=active]:text-tpahla-darkgreen">Nominations</TabsTrigger>
                <TabsTrigger value="event" className="data-[state=active]:bg-tpahla-gold data-[state=active]:text-tpahla-darkgreen">Event</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <Card className="border-tpahla-gold/20 bg-tpahla-neutral">
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {[
                        {
                          question: "What is TPAHLA?",
                          answer: "The Pan-African Humanitarian Leadership Award (TPAHLA) is a prestigious recognition program that celebrates outstanding leaders, organizations, and institutions making significant contributions to humanitarian service, social development, and sustainable change across Africa."
                        },
                        {
                          question: "Who organizes TPAHLA?",
                          answer: "TPAHLA is jointly organized by the Institute for Humanitarian Studies and Social Development (IHSSD), African Refugee Foundation (AREF), and Hempawa Consult, leading organizations committed to advancing humanitarian excellence and sustainable development across the African continent."
                        },
                        {
                          question: "How can I contact the TPAHLA team?",
                          answer: "You can reach us through email at 2025@tpahla.africa, by phone at +234-810-490-6878 (WhatsApp), +234-802-368-6143, +234-706-751-9128, or +234-806-039-6906, or by filling out the contact form on this page. We aim to respond to all inquiries within 48 hours."
                        },
                        {
                          question: "Is TPAHLA affiliated with any government or international organization?",
                          answer: "While TPAHLA operates independently, we collaborate with various governmental bodies, international organizations, and NGOs to advance our mission of recognizing humanitarian excellence across Africa."
                        }
                      ].map((faq, index) => (
                        <AccordionItem key={index} value={`general-${index}`} className="border-b border-tpahla-gold/20">
                          <AccordionTrigger className="text-tpahla-text-primary hover:text-tpahla-gold">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-tpahla-text-secondary">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="nominations">
                <Card className="border-tpahla-gold/20 bg-tpahla-neutral">
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {[
                        {
                          question: "When is the nomination deadline?",
                          answer: "All nominations must be submitted by August 15, 2025. Late submissions will not be considered."
                        },
                        {
                          question: "When do nominations open?",
                          answer: "Nominations open on June 20, 2025, and will remain open until August 15, 2025."
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
                        }
                      ].map((faq, index) => (
                        <AccordionItem key={index} value={`nominations-${index}`} className="border-b border-tpahla-gold/20">
                          <AccordionTrigger className="text-tpahla-text-primary hover:text-tpahla-gold">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-tpahla-text-secondary">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="event">
                <Card className="border-tpahla-gold/20 bg-tpahla-neutral">
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {[
                        {
                          question: "When and where will the award ceremony take place?",
                          answer: "The TPAHLA 2025 award ceremony will take place on October 18, 2025, at the Abuja Continental Hotel in Nigeria. The main event will be preceded by several days of related activities starting from October 15."
                        },
                        {
                          question: "How can I register to attend the event?",
                          answer: "You can register for the event through our website's Registration page. Various registration packages are available to suit different needs and budgets."
                        },
                        {
                          question: "Are accommodations included with event registration?",
                          answer: "No, accommodations are not included in the registration fee. However, we have negotiated special rates with partner hotels, including the venue hotel. Details are available on the Registration page."
                        },
                        {
                          question: "Is there a dress code for the awards ceremony?",
                          answer: "Yes, the awards gala dinner is a formal event. Traditional formal attire or black tie is recommended. Other events during the week have varying dress codes, which will be communicated to registered attendees."
                        }
                      ].map((faq, index) => (
                        <AccordionItem key={index} value={`event-${index}`} className="border-b border-tpahla-gold/20">
                          <AccordionTrigger className="text-tpahla-text-primary hover:text-tpahla-gold">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-tpahla-text-secondary">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </section>
        
        {/* Call to Action */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-tpahla-gold bg-tpahla-darkgreen text-white">
              <CardContent className="pt-8 pb-8 px-8 text-center">
                <Globe className="h-12 w-12 text-tpahla-gold mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold mb-4 text-tpahla-gold">Join the TPAHLA Community</h3>
                <p className="text-lg mb-6 text-tpahla-text-light">
                  Be part of Africa's premier humanitarian recognition platform. Stay updated with the latest news, events, and opportunities.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                      Subscribe to Newsletter
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="border-white text-white hover:bg-white/20">
                      Follow on Social Media
                    </Button>
                  </motion.div>
                </div>
                <div className="mt-6 text-gray-300">
                  <p>For inquiries: <a href="https://wa.me/2348104906878" target="_blank" rel="noopener noreferrer" className="text-tpahla-gold hover:underline font-bold">+234-810-490-6878 (WhatsApp)</a></p>
                  <p>Email: <a href="mailto:2025@tpahla.africa" className="text-tpahla-gold hover:underline">2025@tpahla.africa</a></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Contact;