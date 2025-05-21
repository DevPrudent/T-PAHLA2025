import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award, ChevronRight, Users, ShieldCheck, Leaf, Lightbulb, Home, Users2, Landmark, Scale, BookOpen, Search } from "lucide-react"; // Replaced SearchHeart with Search

// Define placeholder icons, could be actual components later
const PlaceholderIcon = ({ className = "" }: { className?: string }) => (
  <div className={`w-16 h-16 bg-tpahla-neutral-light rounded-md flex items-center justify-center border-2 border-tpahla-gold/50 ${className}`}>
    <Award className="text-tpahla-gold opacity-70" size={28} />
  </div>
);


const awardClusters = [
  {
    clusterTitle: "PAN-AFRICAN HUMANITARIAN LEADERSHIP & LEGACY",
    IconComponent: Users,
    description: "Recognizing individuals and organizations with exceptional leadership and significant, lasting contributions to humanitarian causes across Africa.",
    awards: [
      "African Humanitarian Hero (Highest Honor)",
      "Pan-African Icon of Humanitarian Leadership",
      "Humanitarian Lifetime Achievement Award",
      "Distinguished Traditional Leadership for Humanitarian Support",
      "Outstanding Humanitarian Organization of the Year"
    ]
  },
  {
    clusterTitle: "EXEMPLARY GOVERNANCE FOR HUMANITARIAN IMPACT",
    IconComponent: ShieldCheck,
    description: "Honoring public officials and governance structures that have demonstrably fostered environments conducive to humanitarian progress and development.",
    awards: [
      "Humanitarian Leadership in Governance Award",
      "Best Humanitarian-Friendly President/Head of State Award",
      "Best Humanitarian-Friendly First Lady Award",
      "Best Humanitarian-Friendly Governor Award",
      "Best Humanitarian-Friendly Minister of Education Award"
    ]
  },
  {
    clusterTitle: "YOUTH EMPOWERMENT & GENDER EQUALITY LEADERSHIP",
    IconComponent: Users2,
    description: "Celebrating leaders and initiatives that champion youth development and advance gender equality throughout the African continent.",
    awards: [
      "Humanitarian Youth Leadership Award",
      "Gender Equity & Women Empowerment Award",
      "Outstanding Public Office Holder for Gender Equality & Women’s Empowerment Award",
      "Future Humanitarian Leaders Award"
    ]
  },
  {
    clusterTitle: "SUSTAINABLE DEVELOPMENT & ENVIRONMENTAL STEWARDSHIP",
    IconComponent: Leaf,
    description: "Recognizing efforts towards environmental protection, sustainable resource management, and climate action in Africa.",
    awards: [
      "Sustainable Development & Environmental Stewardship Award",
      "Climate Change Leadership Award",
      "Renewable Energy & Humanitarian Infrastructure Award",
      "Clean Water, Sanitation & Hygiene (WASH) Award"
    ]
  },
  {
    clusterTitle: "HUMANITARIAN INNOVATION & TECHNOLOGY",
    IconComponent: Lightbulb,
    description: "Highlighting innovative solutions and technological advancements that enhance humanitarian effectiveness and outreach.",
    awards: [
      "Humanitarian Innovation & Technology Award",
      "Corporate Social Responsibility (CSR) Excellence Award",
      "Media & Advocacy for Humanitarian Excellence Award"
    ]
  },
  {
    clusterTitle: "DISASTER RELIEF & CRISIS MANAGEMENT",
    IconComponent: Home, 
    description: "Acknowledging exceptional response and management in disaster situations and humanitarian crises.",
    awards: [
      "Disaster Relief & Emergency Response Award",
      "Excellence in Disaster Relief & National Emergency Management Award",
      "Humanitarian Food Security & Nutrition Award"
    ]
  },
  {
    clusterTitle: "PUBLIC SECTOR AND INSTITUTIONAL RECOGNITION",
    IconComponent: Landmark,
    description: "Honoring public sector bodies and institutions for their significant contributions to humanitarian development and good governance.",
    awards: [
      "Best Minister for Infrastructure & Humanitarian Development Award",
      "Best Humanitarian-Friendly Minister of Finance Award",
      "Best Humanitarian-Friendly Law Maker Award",
      "Excellence in Anti-Corruption Leadership for Humanitarian Development Award"
    ]
  },
  {
    clusterTitle: "HUMANITARIAN, SOCIAL & CULTURAL CONTRIBUTIONS",
    IconComponent: BookOpen,
    description: "Recognizing impactful work in arts, culture, social initiatives, and education that promote humanitarian values.",
    awards: [
      "Arts, Culture & Humanitarian Storytelling Award",
      "Social Impact Award",
      "Humanitarian Education & Capacity-Building Award",
      "Excellence in Humanitarian Advocacy Award"
    ]
  },
  {
    clusterTitle: "HUMAN RIGHTS & SOCIAL JUSTICE",
    IconComponent: Scale,
    description: "Celebrating champions of human rights, social justice, and support for vulnerable populations.",
    awards: [
      "Human Rights & Social Justice Award",
      "Migration & Humanitarian Border Assistance Award"
    ]
  },
  {
    clusterTitle: "HUMANITARIAN RESEARCH & DEVELOPMENT",
    IconComponent: Search, // Changed from SearchHeart
    description: "Honoring contributions to research, policy development, and public health that advance humanitarian goals.",
    awards: [
      "Humanitarian Scientific Research & Policy Development Award",
      "Excellence in Public Health & Crisis Management Leadership Award"
    ]
  }
];


const Awards = () => {
  const [selectedCluster, setSelectedCluster] = useState<(typeof awardClusters[0]) | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-tpahla-text-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-tpahla-gold">Award Categories - TPAHLA 2025</h1>
          <p className="text-lg max-w-3xl mx-auto text-tpahla-text-secondary">
            Recognizing Excellence in Various Facets of Humanitarian Leadership
          </p>
        </div>
      </div>
      
      <main className="py-12">
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-tpahla-text-secondary">
              The Pan-African Humanitarian Leadership Award celebrates excellence across diverse areas of humanitarian work. Each category recognizes unique contributions to the development and wellbeing of African communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awardClusters.map((cluster, index) => (
              <div 
                key={index} 
                className="bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden border border-tpahla-gold/20 hover:shadow-tpahla-gold/30 hover:border-tpahla-gold/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={() => setSelectedCluster(cluster)}
              >
                <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
                <div className="p-6">
                  <div className="flex items-center justify-center mb-6">
                    {/* Using PlaceholderIcon which internally uses a generic Award icon */}
                    {/* If specific icons per cluster are desired later, cluster.IconComponent could be used here */}
                    <PlaceholderIcon />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-gold text-center h-16 flex items-center justify-center">{cluster.clusterTitle}</h3>
                  <p className="text-tpahla-text-secondary text-sm mb-4 h-20 overflow-hidden">{cluster.description}</p>
                </div>
                <div className="px-6 py-4 bg-tpahla-neutral-light border-t border-tpahla-gold/10">
                  <div className="text-center text-sm text-tpahla-gold font-medium group-hover:text-gradient-gold flex items-center justify-center">
                    View Awards in this Cluster <ChevronRight size={18} className="ml-1 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Unveiling of Humanitarian Ambassadors Section */}
        <section className="py-16 bg-tpahla-neutral-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-tpahla-emerald">
                Unveiling of Humanitarian Ambassadors
              </h2>
              <p className="text-xl text-tpahla-text-secondary mb-8">
                A Key Highlight of the TPAHLA 2025 Programme
              </p>
              <div className="bg-tpahla-neutral p-8 rounded-lg shadow-xl border-t-4 border-tpahla-gold">
                <p className="text-tpahla-text-secondary text-left leading-relaxed">
                  As part of the Pan-African Humanitarian Leadership Award (TPAHLA) programme, the unveiling of Humanitarian Ambassadors will be a key highlight. These ambassadors are outstanding individuals selected for their unwavering commitment to humanitarian service and their ability to advocate for and drive change across the continent. Their leadership qualities, impactful work in various humanitarian causes, and influence will serve as an inspiration to others and reinforce the spirit of altruism across Africa.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center text-tpahla-gold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-tpahla-emerald">Past Award Recipients</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-tpahla-neutral rounded-lg shadow-xl p-8 border border-tpahla-gold/20">
                <p className="text-center text-tpahla-text-secondary italic mb-6">
                  Information about past award recipients will be available after the inaugural ceremony on October 18, 2025.
                </p>
                <div className="flex justify-center">
                  <img 
                    src="/lovable-uploads/0782cd19-ebc3-4e7c-8099-2ffc6e08289e.png" 
                    alt="TPAHLA Logo" 
                    className="h-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Dialog open={selectedCluster !== null} onOpenChange={() => setSelectedCluster(null)}>
        <DialogContent className="max-w-2xl bg-tpahla-neutral border-tpahla-gold text-tpahla-text-primary">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-3 text-tpahla-gold">
              {/* Conditionally render IconComponent if it exists on selectedCluster */}
              {selectedCluster && selectedCluster.IconComponent && <selectedCluster.IconComponent className="text-tpahla-emerald" size={28} />}
              <span>{selectedCluster?.clusterTitle}</span>
            </DialogTitle>
            <DialogDescription className="text-base text-tpahla-text-secondary mt-2 pt-2 border-t border-tpahla-gold/20">
              {selectedCluster?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            <h3 className="text-lg font-medium text-tpahla-gold border-b border-tpahla-gold/20 pb-2">Awards in this Cluster</h3>
            <ul className="space-y-3">
              {selectedCluster?.awards.map((award, i) => (
                <li key={i} className="p-3 bg-tpahla-neutral-light rounded-md flex items-start shadow">
                  <Award className="text-tpahla-gold mr-3 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-tpahla-text-primary">{award}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Awards;
