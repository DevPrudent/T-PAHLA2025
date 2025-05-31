import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AwardCluster } from '@/hooks/useAwardCategories'; // Import the type

interface AwardClusterCardProps {
  cluster: AwardCluster;
  onClick: () => void;
}

const AwardClusterCard: React.FC<AwardClusterCardProps> = ({ cluster, onClick }) => {
  return (
    <motion.div 
      className="flex flex-col bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden border border-tpahla-gold/20 hover:shadow-tpahla-gold/30 hover:border-tpahla-gold/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
      
      <div className="w-full relative">
        <AspectRatio ratio={16 / 9} className="bg-tpahla-neutral-light">
          {cluster.imagePath ? (
            <img src={cluster.imagePath} alt={cluster.clusterTitle} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-16 h-16 text-tpahla-gold opacity-50" strokeWidth={1.5} />
            </div>
          )}
        </AspectRatio>
        <div className="absolute top-2 right-2">
          <Badge className="bg-tpahla-gold/80 text-tpahla-darkgreen text-xs">
            {cluster.awards.length} Award{cluster.awards.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <div className="p-6 flex-grow">
        <div className="flex items-center mb-3">
          <cluster.IconComponent className="text-tpahla-emerald mr-2" size={20} />
          <h3 className="text-xl font-serif font-bold text-tpahla-gold">{cluster.clusterTitle}</h3>
        </div>
        <p className="text-tpahla-text-secondary text-sm mb-4 min-h-[5rem] overflow-hidden text-ellipsis line-clamp-4">{cluster.description}</p>
        
        {cluster.awards.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {cluster.awards.slice(0, 2).map((award, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-tpahla-neutral-light">
                {award.length > 25 ? `${award.substring(0, 25)}...` : award}
              </Badge>
            ))}
            {cluster.awards.length > 2 && (
              <Badge variant="outline" className="text-xs bg-tpahla-gold/10 text-tpahla-gold">
                +{cluster.awards.length - 2} more
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-tpahla-neutral-light border-t border-tpahla-gold/10">
        <div className="text-center text-sm text-tpahla-gold font-medium group-hover:text-gradient-gold flex items-center justify-center">
          View Awards in this Cluster <ChevronRight size={18} className="ml-1 transform transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};

export default AwardClusterCard;