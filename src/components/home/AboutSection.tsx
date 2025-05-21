
import { Button } from "../ui/button"; // Assuming you might want to use themed buttons
import { Users, Zap, BarChart } from "lucide-react"; // Example icons

const AboutSection = () => {
  return (
    <section id="about" className="section-container bg-background">
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="section-title">
          About TPAHLA 2025
        </h2>
        <p className="section-subtitle text-tpahla-text-secondary">
          Celebrating Excellence in Humanitarian Leadership Across Africa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1526536626146-8b9f1ed3a1c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
              alt="TPAHLA Event" 
              className="rounded-lg shadow-xl object-cover w-full h-[400px] border-2 border-tpahla-gold/30"
            />
            <div className="absolute -bottom-4 -right-4 bg-tpahla-gold text-tpahla-darkgreen p-4 rounded shadow-lg">
              <p className="text-lg font-serif">Est. 2025</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-tpahla-gold">Our Purpose</h3>
            <p className="text-tpahla-text-secondary">
              The Pan-African Humanitarian Leadership Award (TPAHLA) recognizes and celebrates outstanding leaders, organizations, and institutions making significant contributions to humanitarian service, social development, and sustainable change across Africa. By highlighting exceptional humanitarian work, TPAHLA inspires a new generation of African leaders committed to positive transformation.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-tpahla-gold">The Organizers</h3>
            <p className="text-tpahla-text-secondary">
              TPAHLA is jointly organized by the Institute for Humanitarian Studies and Social Development (IHSSD) and Hempawa Consult, two leading organizations committed to advancing humanitarian excellence and sustainable development across the African continent.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-tpahla-gold">Our Vision</h3>
            <p className="text-tpahla-text-secondary">
              To create a unified platform that identifies, celebrates, and amplifies the impact of humanitarian leaders working tirelessly to address Africa's most pressing challenges. Through TPAHLA, we aim to foster collaboration, inspire innovation, and accelerate sustainable development across the continent.
            </p>
            <Button variant="tpahla-outline-gold" size="lg" className="mt-6">Learn More About Us</Button>
          </div>
        </div>
      </div>
      
      <div className="mt-20 bg-tpahla-neutral p-8 rounded-lg border-l-4 border-tpahla-emerald shadow-xl">
        <h3 className="text-2xl font-serif font-bold mb-8 text-center text-tpahla-gold">The Impact of TPAHLA</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Recognition", text: "Acknowledging the tireless efforts of individuals and organizations making a difference in African communities.", Icon: Users },
            { title: "Connection", text: "Building networks among humanitarian leaders to foster collaboration and knowledge sharing.", Icon: Zap },
            { title: "Inspiration", text: "Inspiring the next generation of humanitarian leaders to drive positive change across Africa.", Icon: BarChart }
          ].map(item => (
            <div key={item.title} className="text-center p-4 bg-background rounded-md border border-tpahla-gold/20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-tpahla-emerald rounded-full text-white mb-4 shadow-md">
                <item.Icon size={32} />
              </div>
              <h4 className="text-xl font-serif font-bold mb-2 text-tpahla-gold">{item.title}</h4>
              <p className="text-tpahla-text-secondary text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
