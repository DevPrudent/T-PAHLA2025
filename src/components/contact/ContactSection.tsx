import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('contact_messages').insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });
      
      if (error) throw error;
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-container">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h2 className="section-title relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-tpahla-gold">
          Contact Us
        </h2>
        <p className="section-subtitle text-gray-600">
          Have questions about TPAHLA? Get in touch with our team for more information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Get in Touch</h3>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                    placeholder="Your email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select onValueChange={handleSelectChange} value={formData.subject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                    <SelectItem value="Nomination Question">Nomination Question</SelectItem>
                    <SelectItem value="Sponsorship Inquiry">Sponsorship Inquiry</SelectItem>
                    <SelectItem value="Media Request">Media Request</SelectItem>
                    <SelectItem value="Registration Support">Registration Support</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea 
                  id="message" 
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter your message here..."
                />
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-tpahla-purple hover:bg-tpahla-darkpurple text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tpahla-purple"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-serif font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-tpahla-purple mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Address</h4>
                  <address className="text-gray-600 not-italic mt-1">
                    Institute for Humanitarian Studies and Social Development<br />
                    123 Development Avenue<br />
                    Abuja, Nigeria
                  </address>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-tpahla-purple mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-gray-600 mt-1">
                    <a href="https://wa.me/2348104906878" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-tpahla-purple">+234-810-490-6878 (WhatsApp)</a>
                  </p>
                  <p className="text-gray-600">+234-802-368-6143</p>
                  <p className="text-gray-600">+234-706-751-9128</p>
                  <p className="text-gray-600">+234-806-039-6906</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-tpahla-purple mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600 mt-1">
                    <a href="mailto:2025@tpahla.africa" className="hover:text-tpahla-purple">2025@tpahla.africa</a>
                  </p>
                  <p className="text-gray-600">
                    <a href="mailto:tpahla@ihsd-ng.org" className="hover:text-tpahla-purple">tpahla@ihsd-ng.org</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-serif font-bold mb-6">Frequently Asked Questions</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium">When is the nomination deadline?</h4>
                <p className="text-gray-600 mt-1">All nominations must be submitted by August 15, 2025. Late submissions will not be considered.</p>
              </div>
              
              <div>
                <h4 className="font-medium">When do nominations open?</h4>
                <p className="text-gray-600 mt-1">Nominations open on June 20, 2025, and will remain open until August 15, 2025.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Is there a fee to submit a nomination?</h4>
                <p className="text-gray-600 mt-1">No, there is no cost associated with submitting a nomination for any award category.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Can I nominate myself or my organization?</h4>
                <p className="text-gray-600 mt-1">Yes, self-nominations are accepted and will be evaluated using the same criteria as other nominations.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Are accommodations included with event registration?</h4>
                <p className="text-gray-600 mt-1">No, accommodations are not included in the registration fee. However, we have negotiated special rates with partner hotels.</p>
              </div>
              
              <a href="#" className="mt-4 inline-block font-medium text-tpahla-purple hover:text-tpahla-darkpurple">
                View all FAQs &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;