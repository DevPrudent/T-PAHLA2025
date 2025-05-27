
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award as AwardIcon } from "lucide-react";
import type { AwardCluster } from '@/hooks/useAwardCategories'; // Import the type

interface AwardClusterDialogProps {
  selectedCluster: AwardCluster | null;
  onOpenChange: (open: boolean) => void;
}

const AwardClusterDialog: React.FC<AwardClusterDialogProps> = ({ selectedCluster, onOpenChange }) => {
  const IconComponent = selectedCluster?.IconComponent;

  return (
    <Dialog open={selectedCluster !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-tpahla-neutral border-tpahla-gold text-tpahla-text-primary">
        {selectedCluster && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif flex items-center gap-3 text-tpahla-gold">
                {IconComponent && <IconComponent className="text-tpahla-emerald" size={28} />}
                <span>{selectedCluster.clusterTitle}</span>
              </DialogTitle>
              <DialogDescription className="text-base text-tpahla-text-secondary mt-2 pt-2 border-t border-tpahla-gold/20">
                {selectedCluster.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
              <h3 className="text-lg font-medium text-tpahla-gold border-b border-tpahla-gold/20 pb-2">Awards in this Cluster</h3>
              {selectedCluster.awards.length > 0 ? (
                <ul className="space-y-3">
                  {selectedCluster.awards.map((award, i) => (
                    <li key={i} className="p-3 bg-tpahla-neutral-light rounded-md flex items-start shadow">
                      <AwardIcon className="text-tpahla-gold mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-medium text-tpahla-text-primary">{award}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-tpahla-text-secondary">No specific awards listed for this cluster yet.</p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AwardClusterDialog;

