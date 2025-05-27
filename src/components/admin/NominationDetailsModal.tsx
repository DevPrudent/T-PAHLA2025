import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from '@/integrations/supabase/types';
import { 
  NominationStepAData, 
  NominationStepBData, 
  NominationStepCData, 
  NominationStepDData, 
  NominationStepEData 
} from '@/lib/validators/nominationValidators';
import { Printer } from 'lucide-react';

import NominationGeneralDetails from './modal_parts/NominationGeneralDetails';
import NominationSectionA from './modal_parts/NominationSectionA';
import NominationSectionB from './modal_parts/NominationSectionB';
import NominationSectionC from './modal_parts/NominationSectionC';
import NominationSectionD from './modal_parts/NominationSectionD';
import NominationSectionE from './modal_parts/NominationSectionE';
import { useNominationDocuments } from '@/hooks/useNominationDocuments';

// Type alias for NominationRow, as it's used frequently
type NominationRow = Database['public']['Tables']['nominations']['Row'];

interface NominationDetailsModalProps {
  nomination: NominationRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NominationDetailsModal: React.FC<NominationDetailsModalProps> = ({ nomination, isOpen, onClose }) => {
  const { 
    data: uploadedDocuments, 
    isLoading: isLoadingDocuments, 
    error: documentsError 
  } = useNominationDocuments(nomination?.id);

  if (!nomination) return null;

  const sectionA = nomination.form_section_a as NominationStepAData | null;
  const sectionB = nomination.form_section_b as NominationStepBData | null;
  const sectionC = nomination.form_section_c as NominationStepCData | null;
  const sectionD = nomination.form_section_d as NominationStepDData | null;
  const sectionE = nomination.form_section_e as NominationStepEData | null;

  const handlePrint = () => {
    // Ensure modal content is fully rendered before printing
    // This timeout can sometimes help with race conditions in rendering for print
    setTimeout(() => {
        window.print();
    }, 100); // Small delay
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl dark:bg-gray-900 print:p-4 print:m-4 print:border print:border-gray-300 dark:print:bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-tpahla-gold">Nomination Details: {nomination.nominee_name}</DialogTitle>
          <DialogDescription>
            Reviewing nomination ID: {nomination.id}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] p-1 pr-4 print:max-h-none print:overflow-visible print:h-auto">
          <div className="print:p-2">
            <NominationGeneralDetails nomination={nomination} />
            <NominationSectionA sectionA={sectionA} />
            <NominationSectionB sectionB={sectionB} />
            <NominationSectionC 
              sectionC={sectionC} 
              summaryOfAchievement={nomination.summary_of_achievement} 
              formSectionCNotes={nomination.form_section_c_notes}
              uploadedDocuments={uploadedDocuments || []}
              isLoadingDocuments={isLoadingDocuments}
              documentsError={documentsError}
            />
            <NominationSectionD sectionD={sectionD} />
            <NominationSectionE sectionE={sectionE} />
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4 print:hidden">
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
