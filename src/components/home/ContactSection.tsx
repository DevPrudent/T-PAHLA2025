
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactSection = () => {
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
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                    placeholder="Your email address"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Subject of your message"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter your message here..."
                ></textarea>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="w-full bg-tpahla-purple hover:bg-tpahla-darkpurple text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tpahla-purple"
                >
                  Send Message
                </button>
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
                  <p className="text-gray-600 mt-1">+234 (0) 123 456 7890</p>
                  <p className="text-gray-600">+234 (0) 987 654 3210</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-tpahla-purple mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600 mt-1">info@tpahla.org</p>
                  <p className="text-gray-600">nominations@tpahla.org</p>
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
