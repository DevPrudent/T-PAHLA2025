
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">About TPAHLA</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Celebrating Excellence in Humanitarian Leadership Across Africa
          </p>
        </div>
      </div>
      
      <main className="py-12">
        {/* Mission Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                The Pan-African Humanitarian Leadership Award (TPAHLA) was established with a clear mission: to recognize, celebrate, and amplify the impact of exceptional individuals and organizations driving positive change across Africa.
              </p>
              <p className="text-gray-700 mb-4">
                Our awards program seeks to highlight humanitarian excellence, inspire the next generation of leaders, and create a network of changemakers who can collaborate to address Africa's most pressing challenges.
              </p>
              <p className="text-gray-700">
                By shining a spotlight on outstanding humanitarian work, TPAHLA aims to encourage greater investment in sustainable development initiatives that transform lives and communities throughout the continent.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1541971297127-c4e7c90e704e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                  alt="TPAHLA Mission" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 p-6 bg-tpahla-gold text-white rounded shadow-lg">
                <p className="text-2xl font-serif">Est. 2020</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Vision Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen">Our Vision</h2>
              <p className="text-xl text-gray-700">
                To create a unified platform that identifies, celebrates, and amplifies the impact of humanitarian leaders working tirelessly to address Africa's most pressing challenges.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-center">Inspiration</h3>
                <p className="text-gray-600 text-center">
                  Inspiring the next generation of humanitarian leaders to drive positive change across Africa.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-center">Connection</h3>
                <p className="text-gray-600 text-center">
                  Building networks among humanitarian leaders to foster collaboration and knowledge sharing.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-center">Recognition</h3>
                <p className="text-gray-600 text-center">
                  Acknowledging the tireless efforts of individuals and organizations making a difference in African communities.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Organizers Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center text-tpahla-darkgreen">The Organizers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-tpahla-darkgreen flex items-center justify-center">
                <img 
                  src="/lovable-uploads/25dfd870-49b9-4a52-b0b4-5b02ea568e1c.png" 
                  alt="TPAHLA Logo" 
                  className="h-32 object-contain" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold mb-3">Institute for Humanitarian Studies and Social Development</h3>
                <p className="text-gray-600">
                  The IHSSD is a leading research and advocacy organization dedicated to advancing humanitarian principles and sustainable development across Africa. With a network of experts and partners, IHSSD provides thought leadership, conducts research, and implements programs that address social development challenges.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-tpahla-gold flex items-center justify-center">
                <img 
                  src="/lovable-uploads/e9b4d7bd-47bb-4b51-955b-f0d915a73119.png" 
                  alt="TPAHLA Logo" 
                  className="h-32 object-contain" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold mb-3">Hempawa Consult</h3>
                <p className="text-gray-600">
                  Hempawa Consult is a premier consulting firm specializing in event management, strategic communications, and project implementation across Africa. With extensive experience organizing high-profile events, Hempawa brings a wealth of expertise to ensure TPAHLA achieves its goals of recognizing and celebrating humanitarian excellence.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
