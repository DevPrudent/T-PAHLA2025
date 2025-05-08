
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
                    src="/lovable-uploads/506fdaba-d5fe-4d7b-9d67-c78986d9b117.png" 
                    alt="About TPAHLA" 
                    className="h-full w-full object-cover" 
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
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/lovable-uploads/3577e299-c4bd-48c5-a254-0ee248a54f63.png"
                    alt="Award Categories" 
                    className="h-full w-full object-cover"
                  />
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
                <div className="h-48 overflow-hidden">
                  <img 
                    src="/lovable-uploads/b000f148-629a-44df-a8fb-5b95d30c253b.png"
                    alt="Join The Event" 
                    className="h-full w-full object-cover"
                  />
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
