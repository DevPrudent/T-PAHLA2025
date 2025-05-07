
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import CountdownTimer from "../components/home/CountdownTimer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <HeroSection />
        <CountdownTimer />
        
        {/* Featured Sections */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Preview */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-tpahla-darkgreen flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/d50cd556-9676-462a-a4d9-2b4f8db58f81.png" 
                    alt="TPAHLA Full Logo" 
                    className="h-32 object-contain" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-3">About TPAHLA</h3>
                  <p className="text-gray-600 mb-4">
                    The Pan-African Humanitarian Leadership Award recognizes outstanding leaders and organizations making significant contributions to humanitarian service across Africa.
                  </p>
                  <Link to="/about" className="btn-outline inline-block">
                    Learn More
                  </Link>
                </div>
              </div>
              
              {/* Awards Preview */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-tpahla-gold to-amber-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-3">Award Categories</h3>
                  <p className="text-gray-600 mb-4">
                    Explore our diverse range of award categories honoring excellence in humanitarian leadership across various sectors in Africa.
                  </p>
                  <Link to="/awards" className="btn-outline inline-block">
                    View Categories
                  </Link>
                </div>
              </div>
              
              {/* Registration Preview */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-tpahla-darkgreen to-tpahla-brightgreen flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-3">Join The Event</h3>
                  <p className="text-gray-600 mb-4">
                    Register to attend the prestigious awards ceremony on October 18, 2025 at the Abuja Continental Hotel, Nigeria.
                  </p>
                  <Link to="/register" className="btn-outline inline-block">
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-tpahla-darkgreen text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Nominate a Humanitarian Leader?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Recognize exceptional individuals and organizations making a difference across Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/nominations" className="btn-primary bg-tpahla-gold hover:bg-amber-600">
                Submit a Nomination
              </Link>
              <Link to="/sponsors" className="btn-outline border-white text-white hover:bg-white hover:text-tpahla-darkgreen">
                Become a Sponsor
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
