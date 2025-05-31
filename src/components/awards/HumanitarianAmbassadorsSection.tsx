import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Globe, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const HumanitarianAmbassadorsSection: React.FC = () => {
  return (
    <section className="py-16 bg-tpahla-neutral-light">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-tpahla-emerald">
            Unveiling of Humanitarian Ambassadors
          </h2>
          <p className="text-xl text-tpahla-text-secondary mb-8">
            A Key Highlight of the TPAHLA 2025 Programme
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-tpahla-neutral p-8 rounded-lg shadow-xl border-t-4 border-tpahla-gold text-left"
            >
              <p className="text-tpahla-text-secondary leading-relaxed mb-6">
                As part of the Pan-African Humanitarian Leadership Award (TPAHLA) programme, the unveiling of Humanitarian Ambassadors will be a key highlight. These ambassadors are outstanding individuals selected for their unwavering commitment to humanitarian service and their ability to advocate for and drive change across the continent.
              </p>
              <p className="text-tpahla-text-secondary leading-relaxed">
                Their leadership qualities, impactful work in various humanitarian causes, and influence will serve as an inspiration to others and reinforce the spirit of altruism across Africa.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-tpahla-neutral p-8 rounded-lg shadow-xl h-full">
                <h3 className="text-xl font-serif font-bold mb-6 text-tpahla-gold">Ambassador Responsibilities</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Users className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                    <span className="text-tpahla-text-secondary">Represent TPAHLA at key humanitarian events across Africa</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                    <span className="text-tpahla-text-secondary">Advocate for humanitarian causes aligned with TPAHLA's mission</span>
                  </li>
                  <li className="flex items-start">
                    <Globe className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                    <span className="text-tpahla-text-secondary">Participate in humanitarian initiatives and campaigns</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                    <span className="text-tpahla-text-secondary">Mentor emerging humanitarian leaders across the continent</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-tpahla-gold/10 p-6 rounded-lg border border-tpahla-gold/30 max-w-2xl mx-auto">
              <h4 className="font-bold text-tpahla-gold mb-3">Become a Humanitarian Ambassador</h4>
              <p className="text-tpahla-text-secondary mb-4">
                Distinguished individuals with a proven track record in humanitarian work can be nominated or apply to become TPAHLA Humanitarian Ambassadors.
              </p>
              <Link to="/nominations">
                <Button className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                  Learn More About the Ambassador Program
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HumanitarianAmbassadorsSection;