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
import { Printer, File as FileIcon, Download } from 'lucide-react';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

interface NominationDetailsModalProps {
  nomination: NominationRow | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to format file sizes
function formatFileSize(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const DataPair: React.FC<{ label: string; value?: string | number | null | React.ReactNode; isBadge?: boolean; badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" }> = ({ label, value, isBadge, badgeVariant }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="mb-2 break-inside-avoid">
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
  <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 break-inside-avoid print:border-gray-300 print:shadow-none">
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl text-tpahla-gold">Nomination Details: {nomination.nominee_name}</DialogTitle>
          <DialogDescription>
            Reviewing nomination ID: {nomination.id}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] p-1 pr-4 print:max-h-none print:overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:grid-cols-2">
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
              <DataPair label="Date of Birth" value={sectionA.nominee_dob ? format(new Date(sectionA.nominee_dob), 'PPP') : 'N/A'} />
              <DataPair label="Nationality" value={sectionA.nominee_nationality} />
              <DataPair label="Country of Residence" value={sectionA.nominee_country_of_residence} />
              <DataPair label="Organization" value={sectionA.nominee_organization} />
              <DataPair label="Title/Position" value={sectionA.nominee_title_position} />
              <DataPair label="Email" value={sectionA.nominee_email} />
              <DataPair label="Phone" value={sectionA.nominee_phone} />
              <DataPair label="Social Media" value={sectionA.nominee_social_media ? <a href={sectionA.nominee_social_media} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{sectionA.nominee_social_media}</a> : 'N/A'} />
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
                <div className="mt-3">
                  <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">Media Links:</span>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {sectionC.media_links.map((link, index) => (
                      <li key={index} className="text-sm">
                        <a href={link.value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                          {link.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sectionC.file_uploads && sectionC.file_uploads.length > 0 && (
                <div className="mt-4">
                  <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">Supporting Documents:</span>
                  <ul className="list-none pl-0 mt-1 space-y-2">
                    {sectionC.file_uploads.map((file, index) => (
                      <li key={index} className="text-sm p-2 border rounded-md bg-gray-50 dark:bg-gray-700 print:border-gray-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileIcon className="mr-2 h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium truncate" title={file.file_name}>{file.file_name}</span>
                            {typeof file.file_size === 'number' && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({formatFileSize(file.file_size)})</span>
                            )}
                          </div>
                          <a
                            href={file.file_url}
                            download={file.file_name || true}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 print:hidden"
                          >
                            <Button size="sm" variant="ghost">
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </Button>
                          </a>
                        </div>
                         <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="hidden print:inline-block text-xs text-blue-500 hover:underline break-all mt-1">
                           {file.file_url} (Link for print)
                         </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              <DataPair label="Confirmed Accuracy" value={sectionE.confirm_accuracy ? 'Yes' : 'No'} />
              <DataPair label="Confirmed Nominee Contact" value={sectionE.confirm_nominee_contact ? 'Yes' : 'No'} />
              <DataPair label="Confirmed Data Use" value={sectionE.confirm_data_use ? 'Yes' : 'No'} />
              <DataPair label="Nominator Signature" value={sectionE.nominator_signature} />
              <DataPair label="Date Signed" value={sectionE.date_signed ? format(new Date(sectionE.date_signed), 'PPpp') : 'N/A'} />
            </SectionRenderer>
          )}

        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handlePrint} className="print:hidden">
            <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="print:hidden">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
