
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button as ShadButton } from '@/components/ui/button'; // Renamed to avoid conflict

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        });

      if (error) {
        throw error;
      }
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' }); // Reset form
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Get in Touch with The Pan-African Humanitarian Leadership Award Team
          </p>
        </div>
      </div>
      
      <main className="py-12">
        {/* Contact Information & Form */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen">Get In Touch</h2>
                <p className="text-gray-700 mb-8">
                  Have questions about The Pan-African Humanitarian Leadership Award? Our team is here to help. Please feel free to contact us using the information below or by filling out the contact form.
                </p>
                
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-tpahla-gold mt-1 mr-4" />
                      <div>
                        <h3 className="font-bold text-gray-800 mb-1">Address</h3>
                        <p className="text-gray-600">
                          TPAHLA Secretariat<br />
                          Plot 701 Ahmadu Bello Way<br />
                          Central Business District<br />
                          Abuja, FCT, Nigeria
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-6 w-6 text-tpahla-gold mt-1 mr-4" />
                      <div>
                        <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                        <p className="text-gray-600">
                          Main: +234 123 456 7890<br />
                          Nominations: +234 123 456 7891<br />
                          Sponsorships: +234 123 456 7892
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 text-tpahla-gold mt-1 mr-4" />
                      <div>
                        <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                        <p className="text-gray-600">
                          General Inquiries: info@tpahla.org<br />
                          Nominations: nominations@tpahla.org<br />
                          Sponsorships: sponsors@tpahla.org
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-serif font-bold mb-4 text-tpahla-darkgreen">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-tpahla-darkgreen text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tpahla-brightgreen transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="bg-tpahla-darkgreen text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tpahla-brightgreen transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="bg-tpahla-darkgreen text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tpahla-brightgreen transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="bg-tpahla-darkgreen text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-tpahla-brightgreen transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name*</label>
                      <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name*</label>
                      <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email*</label>
                      <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
                      <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject*</label>
                    <select id="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required>
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="nominations">Nominations</option>
                      <option value="sponsorship">Sponsorship</option>
                      <option value="registration">Registration</option>
                      <option value="media">Media & Press</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message*</label>
                    <textarea id="message" rows={6} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required></textarea>
                  </div>
                  
                  <ShadButton type="submit" className="w-full py-3 px-4 bg-tpahla-darkgreen text-white font-medium rounded-md hover:bg-tpahla-brightgreen transition-colors" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </ShadButton>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    * Required fields
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center text-tpahla-darkgreen">Frequently Asked Questions</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">When and where will the award ceremony take place?</h3>
                  <p className="text-gray-700">
                    The Pan-African Humanitarian Leadership Award ceremony will take place on October 18, 2025, at the Abuja Continental Hotel in Nigeria. The main event will be preceded by several days of related activities starting from October 15.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">How can I nominate someone for an award?</h3>
                  <p className="text-gray-700">
                    You can submit nominations through our online nomination form on the Nominations page. Be sure to review the eligibility criteria and provide all required documentation before the submission deadline of August 15, 2025.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Can I attend just the award ceremony without participating in other events?</h3>
                  <p className="text-gray-700">
                    Yes, we offer an "Awards Ceremony Only" registration option that includes access to the ceremony and gala dinner on October 18, 2025. See the Registration page for details.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Are there sponsorship opportunities available?</h3>
                  <p className="text-gray-700">
                    Yes, we offer various sponsorship packages that provide excellent visibility and networking opportunities. Please visit our Sponsors page for details or contact sponsors@tpahla.org to discuss custom sponsorship options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
