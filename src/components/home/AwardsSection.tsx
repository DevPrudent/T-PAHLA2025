
import { Award as AwardIconLucide } from 'lucide-react'; // Renamed to avoid conflict

const AwardsSection = () => {
  const categories = [
    {
      title: "Humanitarian Leadership & Legacy",
      description: "Recognizing individuals with exceptional leadership and significant contributions to humanitarian causes over a sustained period.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-tpahla-emerald">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
    },
    {
      title: "Youth Empowerment & Gender Equality",
      description: "Honoring initiatives that promote youth development and gender equality through innovative programs and sustainable approaches.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-tpahla-emerald">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
    },
    {
      title: "Disaster Relief & Crisis Management",
      description: "Celebrating organizations demonstrating excellence in disaster response, relief efforts, and crisis management systems.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-tpahla-emerald">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
    },
    {
      title: "Health & Social Welfare Excellence",
      description: "Recognizing outstanding contributions to healthcare access, quality, and social welfare systems that improve quality of life.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-tpahla-emerald">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
    },
    {
      title: "Environmental Sustainability",
      description: "Honoring initiatives addressing climate change, environmental conservation, and sustainable resource management.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-tpahla-emerald">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
    },
    {
      title: "Education & Capacity Building",
      description: "Recognizing transformative educational initiatives and capacity-building programs that empower communities.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-tpahla-emerald">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
    },
  ];

  return (
    <section id="awards" className="py-20 bg-tpahla-neutral-light">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <AwardIconLucide size={48} className="mx-auto text-tpahla-gold mb-4" />
          <h2 className="section-title"> 
            Award Categories
          </h2>
          <p className="section-subtitle text-tpahla-text-secondary">
            TPAHLA recognizes excellence across various fields of humanitarian service and social development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-tpahla-gold/30 border border-tpahla-gold/20"
            >
              <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
              <div className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-tpahla-emerald/10 rounded-full text-tpahla-emerald mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-gold">{category.title}</h3>
                <p className="text-tpahla-text-secondary">{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto bg-tpahla-neutral p-8 rounded-lg shadow-xl border-t-4 border-tpahla-gold">
            <h3 className="text-2xl font-serif font-bold mb-4 text-tpahla-gold">Previous Winners</h3>
            <p className="text-tpahla-text-secondary mb-6">
              Our past recipients represent the brightest minds and most dedicated hearts working to transform Africa through humanitarian excellence.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-24 h-24 rounded-full overflow-hidden border-2 border-tpahla-emerald">
                  <img 
                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 20}.jpg`} 
                    alt={`Past Winner ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <a href="#" className="mt-8 inline-block font-medium text-tpahla-gold hover:text-tpahla-emerald transition-colors">
              View all past winners and their stories &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
