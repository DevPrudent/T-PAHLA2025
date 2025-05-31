import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award, ExternalLink, Download, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import type { AwardCluster } from '@/hooks/useAwardCategories'; // Import the type

interface AwardClusterDialogProps {
  selectedCluster: AwardCluster | null;
  onOpenChange: (open: boolean) => void;
}

const AwardClusterDialog: React.FC<AwardClusterDialogProps> = ({ selectedCluster, onOpenChange }) => {
  const IconComponent = selectedCluster?.IconComponent;

  return (
    <Dialog open={selectedCluster !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-tpahla-neutral border-tpahla-gold text-tpahla-text-primary">
        <AnimatePresence>
          {selectedCluster && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  {IconComponent && <IconComponent className="text-tpahla-emerald\" size={28} />}
                  <DialogTitle className="text-2xl font-serif text-tpahla-gold">
                    {selectedCluster.clusterTitle}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base text-tpahla-text-secondary">
                  {selectedCluster.description}
                </DialogDescription>
              </DialogHeader>
              
              {selectedCluster.imagePath && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img 
                    src={selectedCluster.imagePath} 
                    alt={selectedCluster.clusterTitle} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <Award className="text-tpahla-gold mr-2" size={20} />
                  <h3 className="text-xl font-medium text-tpahla-gold">Awards in this Category</h3>
                </div>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {selectedCluster.awards.length > 0 ? (
                    selectedCluster.awards.map((award, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <div className="p-4 bg-tpahla-neutral-light rounded-md flex items-start shadow-sm border border-tpahla-gold/10 hover:border-tpahla-gold/30 transition-colors">
                          <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 flex-shrink-0">
                            <Award className="h-4 w-4 text-tpahla-gold" />
                          </div>
                          <div>
                            <p className="font-medium text-tpahla-text-primary">{award}</p>
                            <p className="text-xs text-tpahla-text-secondary mt-1">
                              Recognizing excellence in {award.toLowerCase().includes('award') ? award.split(' ')[0].toLowerCase() : 'humanitarian'} leadership
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-tpahla-text-secondary text-center py-4">No specific awards listed for this category yet.</p>
                  )}
                </div>
              </div>
              
              <Separator className="my-6 bg-tpahla-gold/20" />
              
              <div className="bg-tpahla-gold/10 p-4 rounded-lg">
                <h4 className="font-medium text-tpahla-gold mb-3">Event Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-tpahla-gold mr-2" />
                    <span className="text-tpahla-text-secondary">October 18, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-tpahla-gold mr-2" />
                    <span className="text-tpahla-text-secondary">Abuja Continental Hotel</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-tpahla-gold mr-2" />
                    <span className="text-tpahla-text-secondary">500+ Attendees</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-tpahla-gold/10 text-tpahla-gold">
                    {selectedCluster.awards.length} Award{selectedCluster.awards.length !== 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="outline" className="bg-tpahla-emerald/10 text-tpahla-emerald">
                    Nominations Open
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Link to="/nominations">
                    <Button size="sm" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                      Nominate Now
                    </Button>
                  </Link>
                  <a href="https://zrutcdhfqahfduxppudv.supabase.co/storage/v1/object/public/documents/TPAHLA%202025%20BROCHURE%2033" target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="border-tpahla-gold text-tpahla-gold hover:bg-tpahla-gold/10">
                      <Download className="mr-1 h-3 w-3" /> Brochure
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AwardClusterDialog;