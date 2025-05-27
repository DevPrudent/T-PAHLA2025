
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import type { AwardCluster } from '@/hooks/useAwardCategories'; // Import the type

interface AwardClusterCardProps {
  cluster: AwardCluster;
  onClick: () => void;
}

const AwardClusterCard: React.FC<AwardClusterCardProps> = ({ cluster, onClick }) => {
  return (
    <div 
      className="flex flex-col bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden border border-tpahla-gold/20 hover:shadow-tpahla-gold/30 hover:border-tpahla-gold/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      onClick={onClick}
    >
      <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
      
      <div className="w-full">
        <AspectRatio ratio={16 / 9} className="bg-tpahla-neutral-light">
          {cluster.imagePath ? (
            <img src={cluster.imagePath} alt={cluster.clusterTitle} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-16 h-16 text-tpahla-gold opacity-50" strokeWidth={1.5} />
            </div>
          )}
        </AspectRatio>
      </div>

      <div className="p-6 flex-grow">
        <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-gold text-center">{cluster.clusterTitle}</h3>
        <p className="text-tpahla-text-secondary text-sm mb-4 min-h-[5rem] overflow-hidden text-ellipsis line-clamp-4">{cluster.description}</p>
      </div>

      <div className="px-6 py-4 bg-tpahla-neutral-light border-t border-tpahla-gold/10">
        <div className="text-center text-sm text-tpahla-gold font-medium group-hover:text-gradient-gold flex items-center justify-center">
          View Awards in this Cluster <ChevronRight size={18} className="ml-1 transform transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default AwardClusterCard;

