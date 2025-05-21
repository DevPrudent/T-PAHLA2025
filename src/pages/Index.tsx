import { Link } from "react-router-dom";
// Navbar and Footer imports are removed
import HeroSection from "../components/home/HeroSection";
import CountdownTimer from "../components/home/CountdownTimer";

const Index = () => {
  return (
    // Navbar and Footer components are removed from here
    // The outer div and min-h-screen bg-white might also be redundant if PublicLayout handles background
    // For now, let's keep bg-white on the page-specific content if needed, PublicLayout has bg-background for main
    <>
      {/* main tag is removed from here, it's now in PublicLayout */}
      <HeroSection />
      <CountdownTimer />
      
      {/* Featured Sections */}
      <section className="py-16 px-4 bg-white"> {/* Added bg-white here as Index was setting it for min-h-screen */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Preview */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-tpahla-darkgreen flex items-center justify-center">
                <img alt="About TPAHLA" className="h-full w-full object-cover" src="/lovable-uploads/d6cbd5f9-4bd4-447d-912d-aa8223a71b4f.jpg" />
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
                <img alt="Award Categories" className="h-full w-full object-cover" src="/lovable-uploads/124ea25a-f191-4796-a71f-4d95ea937e26.jpg" />
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
                <img alt="Join The Event" className="h-full w-full object-cover" src="/lovable-uploads/2c11f3df-79f0-41bc-b465-50ab1387c508.png" />
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
    </>
  );
};
export default Index;
