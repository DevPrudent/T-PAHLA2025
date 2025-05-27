
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
import { Badge } from "@/components/ui/badge";
import { Database } from '@/integrations/supabase/types';
import { 
  NominationStepAData, 
  NominationStepBData, 
  NominationStepCData, 
  NominationStepDData, 
  NominationStepEData 
} from '@/lib/validators/nominationValidators';
import { format } from 'date-fns';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

interface NominationDetailsModalProps {
  nomination: NominationRow | null;
  isOpen: boolean;
  onClose: () => void;
}

const DataPair: React.FC<{ label: string; value?: string | number | null | React.ReactNode; isBadge?: boolean; badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" }> = ({ label, value, isBadge, badgeVariant }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="mb-2">
      <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">{label}:</span>{' '}
      {isBadge ? (
        <Badge variant={badgeVariant || "secondary"}>{String(value)}</Badge>
      ) : (
        <span className="text-sm text-gray-800 dark:text-gray-200">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
      )}
    </div>
  );
};

const SectionRenderer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
    <h3 className="text-lg font-semibold mb-3 text-tpahla-gold border-b pb-2">{title}</h3>
    {children}
  </div>
);

export const NominationDetailsModal: React.FC<NominationDetailsModalProps> = ({ nomination, isOpen, onClose }) => {
  if (!nomination) return null;

  const sectionA = nomination.form_section_a as NominationStepAData | null;
  const sectionB = nomination.form_section_b as NominationStepBData | null;
  const sectionC = nomination.form_section_c as NominationStepCData | null;
  const sectionD = nomination.form_section_d as NominationStepDData | null;
  const sectionE = nomination.form_section_e as NominationStepEData | null;

  const submissionDate = nomination.submitted_at || nomination.created_at;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl text-tpahla-gold">Nomination Details: {nomination.nominee_name}</DialogTitle>
          <DialogDescription>
            Reviewing nomination ID: {nomination.id}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] p-1 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <DataPair label="Nominee Name" value={nomination.nominee_name} />
            <DataPair label="Status" value={nomination.status} isBadge badgeVariant={
                nomination.status === "approved" ? "success" : 
                nomination.status === "rejected" ? "destructive" :
                nomination.status === "submitted" ? "default" : 
                "outline"
              }/>
            <DataPair label="Award Category ID" value={nomination.award_category_id} />
            <DataPair label="Submitted At" value={submissionDate ? format(new Date(submissionDate), 'PPpp') : 'N/A'} />
            <DataPair label="Nominator Email" value={nomination.nominator_email} />
            <DataPair label="Nominator Name" value={nomination.nominator_name} />
          </div>

          {sectionA && (
            <SectionRenderer title="Section A: Nominee Information">
              <DataPair label="Full Name" value={sectionA.nominee_full_name} />
              <DataPair label="Gender" value={sectionA.nominee_gender} />
              <DataPair label="Date of Birth" value={sectionA.nominee_dob} />
              <DataPair label="Nationality" value={sectionA.nominee_nationality} />
              <DataPair label="Country of Residence" value={sectionA.nominee_country_of_residence} />
              <DataPair label="Organization" value={sectionA.nominee_organization} />
              <DataPair label="Title/Position" value={sectionA.nominee_title_position} />
              <DataPair label="Email" value={sectionA.nominee_email} />
              <DataPair label="Phone" value={sectionA.nominee_phone} />
              <DataPair label="Social Media" value={sectionA.nominee_social_media} />
            </SectionRenderer>
          )}

          {sectionB && (
            <SectionRenderer title="Section B: Award Category">
              <DataPair label="Award Category" value={sectionB.award_category} />
              <DataPair label="Specific Award" value={sectionB.specific_award} />
            </SectionRenderer>
          )}

          {sectionC && (
            <SectionRenderer title="Section C: Achievements and Justification">
              <DataPair label="Justification" value={<p className="whitespace-pre-wrap text-sm">{sectionC.justification}</p>} />
              <DataPair label="Notable Recognitions" value={<p className="whitespace-pre-wrap text-sm">{sectionC.notable_recognitions}</p>} />
              {sectionC.media_links && sectionC.media_links.length > 0 && (
                <div>
                  <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">Media Links:</span>
                  <ul className="list-disc list-inside ml-4">
                    {sectionC.media_links.map((link, index) => (
                      <li key={index} className="text-sm">
                        <a href={link.value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {link.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* File uploads would be handled here if data structure supported it */}
            </SectionRenderer>
          )}
          
          <DataPair label="Summary of Achievement (from Nomination)" value={nomination.summary_of_achievement ? <p className="whitespace-pre-wrap text-sm">{nomination.summary_of_achievement}</p> : 'N/A'} />
          <DataPair label="Section C Notes (from Nomination)" value={nomination.form_section_c_notes ? <p className="whitespace-pre-wrap text-sm">{nomination.form_section_c_notes}</p> : 'N/A'} />


          {sectionD && (
            <SectionRenderer title="Section D: Nominator Information">
              <DataPair label="Nominator Full Name" value={sectionD.nominator_full_name} />
              <DataPair label="Relationship to Nominee" value={sectionD.nominator_relationship_to_nominee} />
              <DataPair label="Nominator Organization" value={sectionD.nominator_organization} />
              <DataPair label="Nominator Email" value={sectionD.nominator_email} />
              <DataPair label="Nominator Phone" value={sectionD.nominator_phone} />
              <DataPair label="Reason for Nomination" value={<p className="whitespace-pre-wrap text-sm">{sectionD.nominator_reason}</p>} />
            </SectionRenderer>
          )}

          {sectionE && (
            <SectionRenderer title="Section E: Declaration and Consent">
              <DataPair label="Confirmed Accuracy" value={sectionE.confirm_accuracy} />
              <DataPair label="Confirmed Nominee Contact" value={sectionE.confirm_nominee_contact} />
              <DataPair label="Confirmed Data Use" value={sectionE.confirm_data_use} />
              <DataPair label="Nominator Signature" value={sectionE.nominator_signature} />
              <DataPair label="Date Signed" value={format(new Date(sectionE.date_signed), 'PPpp')} />
            </SectionRenderer>
          )}

        </ScrollArea>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
          {/* Add Print or other actions here later if needed */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

