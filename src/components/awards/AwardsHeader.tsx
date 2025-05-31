import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, MapPin } from 'lucide-react';

const AwardsHeader: React.FC = () => {
  return (
    <div className="pt-24 pb-12 bg-tpahla-darkgreen text-tpahla-text-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/african-pattern.jpg')] bg-repeat opacity-5"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-tpahla-darkgreen to-tpahla-darkgreen/90"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Award className="h-16 w-16 text-tpahla-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-tpahla-gold">Award Categories - TPAHLA 2025</h1>
          <p className="text-xl max-w-3xl mx-auto text-tpahla-text-secondary">
            Recognizing Excellence in Various Facets of Humanitarian Leadership
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
              <Calendar className="h-4 w-4 text-tpahla-gold mr-2" />
              <span className="text-sm">October 18, 2025</span>
            </div>
            <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
              <MapPin className="h-4 w-4 text-tpahla-gold mr-2" />
              <span className="text-sm">Abuja Continental Hotel, Nigeria</span>
            </div>
            <div className="bg-tpahla-gold/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
              <Award className="h-4 w-4 text-tpahla-gold mr-2" />
              <span className="text-sm">10 Award Categories</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AwardsHeader;