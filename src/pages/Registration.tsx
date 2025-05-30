import { Link } from 'react-router-dom';
import MultiStepRegistration from "@/components/registration/MultiStepRegistration";
import { Button } from "@/components/ui/button";

const Registration = () => {
  return (
    <>
      {/* Page Header */}
      <div className="pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Registration</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Register to Attend The Pan-African Humanitarian Leadership Award Ceremony
          </p>
        </div>
      </div>
      
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">Join Us for TPAHLA 2025</h2>
            <p className="text-tpahla-text-secondary mb-8">
              The Pan-African Humanitarian Leadership Award ceremony will take place on October 18, 2025, at the Abuja Continental Hotel in Nigeria. Register now to secure your spot at this prestigious event.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <div className="text-2xl mb-3">🗓️</div>
                <h3 className="text-lg font-medium mb-2">October 15-19, 2025</h3>
                <p className="text-sm text-muted-foreground">Five days of inspiration, recognition, and celebration</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <div className="text-2xl mb-3">📍</div>
                <h3 className="text-lg font-medium mb-2">Abuja Continental Hotel</h3>
                <p className="text-sm text-muted-foreground">Nigeria's premier venue for international events</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <div className="text-2xl mb-3">👥</div>
                <h3 className="text-lg font-medium mb-2">500+ Attendees</h3>
                <p className="text-sm text-muted-foreground">Leaders from across Africa and beyond</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link to="/new-registration">
                <Button size="lg" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                  Start New Registration
                </Button>
              </Link>
              <Link to="/event">
                <Button variant="outline" size="lg">
                  View Event Details
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-20 p-8 bg-tpahla-neutral rounded-lg border border-tpahla-gold/20">
            <h3 className="text-2xl font-serif font-bold mb-4 text-tpahla-gold text-center">Registration Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-3 text-tpahla-text-primary">What's Included</h4>
                <ul className="space-y-2">
                  {[
                    "Access to all conference sessions and workshops",
                    "Welcome reception on October 15",
                    "Cultural evening on October 16",
                    "Pre-award gala dinner on October 17",
                    "Awards ceremony and gala dinner on October 18",
                    "Conference materials and delegate badge",
                    "Networking opportunities with humanitarian leaders"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-tpahla-gold mr-2">✓</span>
                      <span className="text-tpahla-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-3 text-tpahla-text-primary">Important Dates</h4>
                <div className="space-y-3">
                  <div className="border-l-2 border-tpahla-gold pl-3">
                    <p className="font-medium text-tpahla-text-primary">Early Bird Registration</p>
                    <p className="text-sm text-tpahla-text-secondary">Ends June 30, 2025</p>
                  </div>
                  <div className="border-l-2 border-tpahla-gold pl-3">
                    <p className="font-medium text-tpahla-text-primary">Standard Registration</p>
                    <p className="text-sm text-tpahla-text-secondary">July 1 - October 1, 2025</p>
                  </div>
                  <div className="border-l-2 border-tpahla-gold pl-3">
                    <p className="font-medium text-tpahla-text-primary">Late Registration</p>
                    <p className="text-sm text-tpahla-text-secondary">October 2 - 10, 2025 (subject to availability)</p>
                  </div>
                  <div className="border-l-2 border-tpahla-gold pl-3">
                    <p className="font-medium text-tpahla-text-primary">Registration Closes</p>
                    <p className="text-sm text-tpahla-text-secondary">October 10, 2025</p>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-tpahla-gold/10 rounded-md">
                  <p className="text-sm text-tpahla-text-secondary">
                    <strong className="text-tpahla-gold">Note:</strong> Registration fees are non-refundable but transferable up to September 15, 2025.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/new-registration">
                <Button size="lg" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;