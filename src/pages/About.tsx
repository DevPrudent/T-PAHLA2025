import NotificationBanner from "../components/common/NotificationBanner"; // Import the new banner
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"; // Import Carousel components

const About = () => {
  const collaborators = [
    { name: "UNITAR", logo: "/lovable-uploads/01936239-bdc7-43a5-ad09-bdcfb83947ff.png" },
    { name: "CIFAL Nigeria", logo: "/lovable-uploads/8ea19e05-52d6-4650-9471-65ed89feae3b.png" },
    { name: "PROSE Integrated Limited", logo: "/lovable-uploads/9ba7c8d4-aa76-4598-b81c-22e333db53c9.png" },
    { name: "OSHAssociation UK", logo: "/lovable-uploads/09c6397d-a397-4af8-a2eb-3bb509308043.png" },
    { name: "National Youth Service Corps", logo: "/lovable-uploads/d01f6a31-21df-4d3a-88b9-1b12c0b36c56.png" },
    { name: "National Emergency Management Agency", logo: "/lovable-uploads/34745fc8-b570-4d19-b5e6-18724cedba6a.png" },
    { name: "National Boundary Commission", logo: "/lovable-uploads/c245cabe-1bd6-41fc-b80f-b4d5e8c7ade2.png" },
    { name: "National Orientation Agency", logo: "/lovable-uploads/23d63c6b-74e0-43bb-98ef-92e814d38474.png" },
    { name: "Federal Ministry of Budget and National Planning", logo: "/lovable-uploads/f3ddb519-011f-4ccf-ac4f-923fddac87ca.png" }, // Inferred name
    { name: "Federal Ministry of Humanitarian Affairs and Poverty Alleviation", logo: "/lovable-uploads/89a62900-1e6d-4424-a5af-3f501b261019.png" }, // Inferred name
    { name: "Vision FM", logo: "/lovable-uploads/57592dd5-79e6-4989-8ab7-77f963046b46.png" }, // Inferred name
    { name: "HFC Hope For Children", logo: "/lovable-uploads/27dfe56f-8a11-4237-8a63-f1220770ad15.png" } // Inferred name
  ];
  return <div className="min-h-screen bg-background">
      {/* Navbar and Footer are removed as they are handled by PublicLayout */}
      
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-tpahla-text-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-tpahla-gold">About TPAHLA 2025</h1>
          <p className="text-lg max-w-3xl mx-auto text-tpahla-text-secondary">
            Celebrating Excellence in Humanitarian Leadership Across Africa
          </p>
        </div>
      </div>

      <NotificationBanner /> {/* Add the banner here */}
      
      <main className="py-12">
        {/* Mission Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">Our Mission</h2>
              <p className="text-tpahla-text-secondary mb-4">
                The Pan-African Humanitarian Leadership Award (TPAHLA) was established with a clear mission: to recognize, celebrate, and amplify the impact of exceptional individuals and organizations driving positive change across Africa.
              </p>
              <p className="text-tpahla-text-secondary mb-4">
                Our awards program seeks to highlight humanitarian excellence, inspire the next generation of leaders, and create a network of changemakers who can collaborate to address Africa's most pressing challenges.
              </p>
              <p className="text-tpahla-text-secondary">
                By shining a spotlight on outstanding humanitarian work, TPAHLA aims to encourage greater investment in sustainable development initiatives that transform lives and communities throughout the continent.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-xl border-2 border-tpahla-gold/30">
                <img alt="TPAHLA Mission" className="w-full h-auto" src="/lovable-uploads/73cabd00-698a-4407-8cbb-b158dc3fa958.png" />
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 bg-tpahla-gold text-tpahla-darkgreen rounded shadow-lg">
                <p className="text-lg font-serif">Est. 2025</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Vision Section */}
        <section className="py-16 bg-tpahla-neutral">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">Our Vision</h2>
              <p className="text-xl text-tpahla-text-secondary">
                To create a unified platform that identifies, celebrates, and amplifies the impact of humanitarian leaders working tirelessly to address Africa's most pressing challenges.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg shadow-md border border-tpahla-gold/20">
                <div className="w-16 h-16 bg-tpahla-emerald rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-center text-tpahla-gold">Inspiration</h3>
                <p className="text-tpahla-text-secondary text-center">
                  Inspiring the next generation of humanitarian leaders to drive positive change across Africa.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-md border border-tpahla-gold/20">
                <div className="w-16 h-16 bg-tpahla-emerald rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-center text-tpahla-gold">Connection</h3>
                <p className="text-tpahla-text-secondary text-center">
                  Building networks among humanitarian leaders to foster collaboration and knowledge sharing.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-md border border-tpahla-gold/20">
                <div className="w-16 h-16 bg-tpahla-emerald rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-center text-tpahla-gold">Recognition</h3>
                <p className="text-tpahla-text-secondary text-center">
                  Acknowledging the tireless efforts of individuals and organizations making a difference in African communities.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Organizers Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center text-tpahla-gold">The Organizers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"> {/* Changed to lg:grid-cols-3 */}
            <div className="bg-tpahla-neutral rounded-lg shadow-md overflow-hidden border border-tpahla-gold/20">
              <a href="https://ihsd-ng.org/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
                <div className="h-48 bg-tpahla-darkgreen flex items-center justify-center p-4">
                  <img alt="IHSD Logo" className="h-32 object-contain" src="/lovable-uploads/b97e6de0-72fd-47c6-8429-8d3be85dd2af.png" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-gold">Institute for Humanitarian Studies and Social Development</h3>
                  <p className="text-tpahla-text-secondary">
                    The IHSSD is a leading research and advocacy organization dedicated to advancing humanitarian principles and sustainable development across Africa. With a network of experts and partners, IHSSD provides thought leadership, conducts research, and implements programs that address social development challenges.
                  </p>
                </div>
              </a>
            </div>
            
            {/* New Third Organizer Card - Moved to second position */}
            <div className="bg-tpahla-neutral rounded-lg shadow-md overflow-hidden border border-tpahla-gold/20">
              <div className="h-48 flex items-center justify-center p-4 bg-tpahla-darkgreen">
                 {/* Placeholder for logo, you can replace src with actual logo path */}
                <img alt="Third Organizer Logo" className="h-32 object-contain" src="/lovable-uploads/21c9e800-6f9a-41fb-bbd9-085e95469934.png" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-gold">African Refugee Foundation (AREF)</h3>
                <p className="text-tpahla-text-secondary">AREF stands as a pioneering Pan-African organization committed to the protection, empowerment, and dignified resettlement of refugees, internally displaced persons (IDPs), and other vulnerable populations across the continent. Established as a beacon of advocacy and innovation, AREF has spent over two decades at the forefront of humanitarian intervention, policy influence, and community resilience-building in Africa.</p>
              </div>
            </div>
            
            <div className="bg-tpahla-neutral rounded-lg shadow-md overflow-hidden border border-tpahla-gold/20">
              <div className="h-48 flex items-center justify-center p-4 bg-tpahla-darkgreen">
                <img alt="Hempawa Consult Logo" className="h-32 object-contain" src="/lovable-uploads/c8a15bae-860c-4927-9901-dfe7459b6a8e.png" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-gold">Hempawa Consult</h3>
                <p className="text-tpahla-text-secondary">
                  Hempawa Consult is a premier consulting firm specializing in event management, strategic communications, and project implementation across Africa. With extensive experience organizing high-profile events, Hempawa brings a wealth of expertise to ensure TPAHLA achieves its goals of recognizing and celebrating humanitarian excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Collaborators Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center text-tpahla-gold">Strategic Collaborators</h2>
            <Carousel opts={{
            align: "start",
            loop: true
          }} className="w-full max-w-6xl mx-auto"> {/* Increased max-width for more items */}
              <CarouselContent>
                {collaborators.map((collaborator, index) => <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"> {/* Adjusted basis for more items */}
                    <div className="p-1">
                      <div className="bg-tpahla-neutral p-6 rounded-lg shadow-md border border-tpahla-gold/20 flex flex-col items-center justify-center h-48"> {/* Increased height */}
                        <img src={collaborator.logo} alt={collaborator.name} className="max-h-24 object-contain mb-2" /> {/* Adjusted max-height and added margin */}
                        <p className="mt-2 text-sm text-center text-tpahla-text-secondary">{collaborator.name}</p>
                      </div>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="text-tpahla-gold hover:bg-tpahla-gold/10 border-tpahla-gold" />
              <CarouselNext className="text-tpahla-gold hover:bg-tpahla-gold/10 border-tpahla-gold" />
            </Carousel>
          </div>
        </section>
      </main>
      
      {/* Footer is removed as it's handled by PublicLayout */}
    </div>;
};
export default About;