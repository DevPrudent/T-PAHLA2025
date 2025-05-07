
const AboutSection = () => {
  return (
    <section id="about" className="section-container">
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="section-title relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-tpahla-gold">
          About TPAHLA
        </h2>
        <p className="section-subtitle text-gray-600">
          Celebrating Excellence in Humanitarian Leadership Across Africa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1526536626146-8b9f1ed3a1c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
              alt="TPAHLA Event" 
              className="rounded-lg shadow-lg object-cover w-full h-[400px]"
            />
            <div className="absolute -bottom-4 -right-4 bg-tpahla-gold text-white p-4 rounded shadow-lg">
              <p className="text-lg font-serif">Est. 2020</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-gray-800">Our Purpose</h3>
            <p className="text-gray-600">
              The Pan-African Humanitarian Leadership Award (TPAHLA) recognizes and celebrates outstanding leaders, organizations, and institutions making significant contributions to humanitarian service, social development, and sustainable change across Africa. By highlighting exceptional humanitarian work, TPAHLA inspires a new generation of African leaders committed to positive transformation.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-gray-800">The Organizers</h3>
            <p className="text-gray-600">
              TPAHLA is jointly organized by the Institute for Humanitarian Studies and Social Development (IHSSD) and Hempawa Consult, two leading organizations committed to advancing humanitarian excellence and sustainable development across the African continent.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-gray-800">Our Vision</h3>
            <p className="text-gray-600">
              To create a unified platform that identifies, celebrates, and amplifies the impact of humanitarian leaders working tirelessly to address Africa's most pressing challenges. Through TPAHLA, we aim to foster collaboration, inspire innovation, and accelerate sustainable development across the continent.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-16 bg-gray-50 p-8 rounded-lg border-l-4 border-tpahla-purple">
        <h3 className="text-2xl font-serif font-bold mb-4 text-center">The Impact of TPAHLA</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-tpahla-purple rounded-full text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h4 className="text-xl font-serif font-bold mb-2">Recognition</h4>
            <p className="text-gray-600">Acknowledging the tireless efforts of individuals and organizations making a difference in African communities.</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-tpahla-purple rounded-full text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h4 className="text-xl font-serif font-bold mb-2">Connection</h4>
            <p className="text-gray-600">Building networks among humanitarian leaders to foster collaboration and knowledge sharing.</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-tpahla-purple rounded-full text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-serif font-bold mb-2">Inspiration</h4>
            <p className="text-gray-600">Inspiring the next generation of humanitarian leaders to drive positive change across Africa.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
