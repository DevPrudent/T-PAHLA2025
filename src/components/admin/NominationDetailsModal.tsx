
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
// Assuming these types are correctly defined in your validators or elsewhere
// If not, they would need to be defined or imported
type NominationStepAData = Database['public']['Tables']['nominations']['Row']['form_section_a'];
type NominationStepBData = Database['public']['Tables']['nominations']['Row']['form_section_b'];
type NominationStepCData = Database['public']['Tables']['nominations']['Row']['form_section_c'];
type NominationStepDData = Database['public']['Tables']['nominations']['Row']['form_section_d'];
type NominationStepEData = Database['public']['Tables']['nominations']['Row']['form_section_e'];


interface NominationDetailsModalProps {
  nomination: NominationRow | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="mb-2">
    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}:</p>
    <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value ?? 'N/A'}
    </p>
  </div>
);

const renderSection = (title: string, data: any | null) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <DetailItem label={title} value="No data provided for this section." />;
  }
  // Ensure data is not an array or primitive before mapping
  if (Array.isArray(data)) {
    return <DetailItem label={title} value={JSON.stringify(data, null, 2)} />;
  }

  return (
    <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50">
      <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold">{title}</h4>
      {Object.entries(data).map(([key, value]) => {
        // Pretty print keys
        const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        if (key === 'media_links' && Array.isArray(value)) {
          return (
            <div key={key} className="mb-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formattedKey}:</p>
              {value.length > 0 ? (
                <ul className="list-disc list-inside pl-4">
                  {value.map((link: any, index: number) => (
                    <li key={index} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      <a href={link.value} target="_blank" rel="noopener noreferrer">{link.value}</a>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-900 dark:text-gray-100">N/A</p>}
            </div>
          );
        }
         if (key === 'date_signed' && value) {
            try {
              return <DetailItem key={key} label={formattedKey} value={format(new Date(value as string), 'PPP')} />;
            } catch (e) {
              return <DetailItem key={key} label={formattedKey} value={String(value)} />;
            }
        }
        return <DetailItem key={key} label={formattedKey} value={String(value)} />;
      })}
    </div>
  );
};

const NominationDetailsModal: React.FC<NominationDetailsModalProps> = ({ nomination, isOpen, onClose }) => {
  if (!nomination) return null;

  const sectionA = nomination.form_section_a as NominationStepAData | null;
  const sectionB = nomination.form_section_b as NominationStepBData | null;
  const sectionC = nomination.form_section_c as NominationStepCData | null;
  const sectionD = nomination.form_section_d as NominationStepDData | null;
  const sectionE = nomination.form_section_e as NominationStepEData | null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-tpahla-darkgreen dark:text-tpahla-gold">
            Nomination Details: {nomination.nominee_name}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Full details for the nomination submitted on {nomination.submitted_at ? format(new Date(nomination.submitted_at), 'PPPp') : 'N/A'}.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50">
                <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold">General Information</h4>
                <DetailItem label="Nomination ID" value={nomination.id} />
                <DetailItem label="Nominee Name" value={nomination.nominee_name} />
                <DetailItem label="Nominee Type" value={nomination.nominee_type} />
                <DetailItem label="Award Category ID" value={nomination.award_category_id} />
                <DetailItem label="Nominator Name" value={nomination.nominator_name} />
                <DetailItem label="Nominator Email" value={nomination.nominator_email} />
                <DetailItem label="Status">
                    <Badge variant={
                        nomination.status === "approved" ? "success" : 
                        nomination.status === "rejected" ? "destructive" :
                        nomination.status === "submitted" ? "default" :
                        "outline"
                    }>
                        {nomination.status}
                    </Badge>
                </DetailItem>
                <DetailItem label="Summary of Achievement" value={nomination.summary_of_achievement} />
                <DetailItem label="Created At" value={nomination.created_at ? format(new Date(nomination.created_at), 'PPPp') : 'N/A'} />
                <DetailItem label="Updated At" value={nomination.updated_at ? format(new Date(nomination.updated_at), 'PPPp') : 'N/A'} />
                <DetailItem label="Submitted At" value={nomination.submitted_at ? format(new Date(nomination.submitted_at), 'PPPp') : 'N/A'} />
            </div>

            {renderSection("Section A: Nominee Information", sectionA)}
            {renderSection("Section B: Award Category", sectionB)}
            {renderSection("Section C: Justification & Supporting Materials", sectionC)}
            {sectionC?.cv_resume && <DetailItem label="CV/Resume" value={"File uploaded - link/preview to be implemented"} />}
            {sectionC?.photos_media && <DetailItem label="Photos/Media" value={"Files uploaded - link/preview to be implemented"} />}
            {sectionC?.other_documents && <DetailItem label="Other Documents" value={"Files uploaded - link/preview to be implemented"} />}
            {nomination.form_section_c_notes && <DetailItem label="Section C Notes" value={nomination.form_section_c_notes}/>}
            {renderSection("Section D: Nominator Information", sectionD)}
            {renderSection("Section E: Declaration & Signature", sectionE)}
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NominationDetailsModal;
