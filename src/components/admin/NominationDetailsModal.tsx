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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from '@/integrations/supabase/types';
import { format, parseISO, isValid } from 'date-fns';
// Supabase client might not be needed directly here if FileDisplayRenderer handles it
// import { supabase } from '@/integrations/supabase/client'; 
import { Printer, Edit } from 'lucide-react'; // Removed Download, ExternalLink as they are in sub-components
import { getCategoryTitleById, getAwardNameByValue } from '@/lib/awardCategories';
// getCountryNameByCode is used in SectionAContentRenderer
import { useNavigate } from 'react-router-dom';

// Import new components
import ModalDetailItem from './nomination-modal/ModalDetailItem'; // This is the one we are using in the header part
import SectionAContentRenderer from './nomination-modal/renderers/SectionAContentRenderer';
import SectionBContentRenderer from './nomination-modal/renderers/SectionBContentRenderer';
import SectionCContentRenderer from './nomination-modal/renderers/SectionCContentRenderer';
import SectionDContentRenderer from './nomination-modal/renderers/SectionDContentRenderer';
import SectionEContentRenderer from './nomination-modal/renderers/SectionEContentRenderer';


type NominationRow = Database['public']['Tables']['nominations']['Row'];

// Define the props interface for NominationDetailsModal
interface NominationDetailsModalProps {
  nomination: NominationRow | null;
  isOpen: boolean;
  onClose: () => void;
}

// Define interfaces for the expected structure of each section's data
// These are now also used by the renderer components by importing from this file.
// Consider moving these to a central types file in a follow-up.
export interface FileInfo { // Exporting for FileDisplayRenderer
  file_name: string;
  storage_path: string;
  name?: string; 
  url?: string;
}

export interface MediaLink { // Exporting for MediaLinksRenderer
  value: string;
}

export interface SectionAData { // Exporting for SectionAContentRenderer
  nominee_full_name?: string;
  nominee_gender?: string;
  nominee_dob?: string;
  nominee_nationality?: string;
  nominee_country_of_residence?: string;
  nominee_organization?: string;
  nominee_title_position?: string;
  nominee_email?: string;
  nominee_phone?: string;
  nominee_social_media?: string;
  [key: string]: any;
}

export interface SectionBData { // Exporting for SectionBContentRenderer
  award_category?: string;
  specific_award?: string;
  [key: string]: any;
}

export interface SectionCData { // Exporting for SectionCContentRenderer
  justification_statement?: string;
  achievements_and_impact?: string;
  leadership_and_innovation?: string;
  sustainability_and_scalability?: string;
  cv_resume?: FileInfo[] | FileInfo | null;
  photos_media?: FileInfo[] | FileInfo | null;
  other_documents?: FileInfo[] | FileInfo | null;
  media_links?: MediaLink[];
  [key: string]: any;
}

export interface SectionDData { // Exporting for SectionDContentRenderer
  nominator_full_name?: string;
  nominator_relationship_to_nominee?: string;
  nominator_organization?: string;
  nominator_email?: string;
  nominator_phone?: string;
  nominator_reason?: string;
  [key: string]: any;
}

export interface SectionEData { // Exporting for SectionEContentRenderer
  confirm_accuracy?: boolean;
  confirm_nominee_contact?: boolean;
  confirm_data_use?: boolean;
  nominator_signature?: string;
  date_signed?: string; 
  [key: string]: any;
}

export const NOMINATION_FILES_BUCKET = 'nomination-files'; // Exporting for FileDisplayRenderer

// The inline DetailItem component is now removed and replaced by ModalDetailItem.tsx

// renderSectionAContent is now SectionAContentRenderer.tsx
// renderGenericSectionContent is now split into SectionB/C/D/E ContentRenderer.tsx

const NominationDetailsModal: React.FC<NominationDetailsModalProps> = ({ nomination, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!nomination) return null;

  const sectionA = nomination.form_section_a as SectionAData | null;
  const sectionB = nomination.form_section_b as SectionBData | null;
  const sectionC = nomination.form_section_c as SectionCData | null; 
  const sectionD = nomination.form_section_d as SectionDData | null;
  const sectionE = nomination.form_section_e as SectionEData | null;

  const handlePrint = () => {
    const printContents = document.getElementById("nomination-details-printable-area")?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
      // Temporarily hide non-printable elements more aggressively
      const nonPrintable = document.querySelectorAll('.print-hidden-override');
      nonPrintable.forEach(el => (el as HTMLElement).style.display = 'none');
      
      document.body.innerHTML = `<div class="print-container p-4">${printContents}</div>`;
      // Add print-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body { margin: 20px !important; font-family: sans-serif; color: black; }
          .print-container { padding: 0 !important; margin: 0 !important; }
          .print-mb-1 { margin-bottom: 0.25rem !important; }
          .print-text-black { color: black !important; }
          .print-bg-white { background-color: white !important; }
          .print-p-0 { padding: 0 !important; }
          .print-border-none { border: none !important; }
          .print-shadow-none { box-shadow: none !important; }
          .grid { display: block !important; } /* Simplify grid for print */
          .sm\\:col-span-2 { display:block !important; width: 100% !important; }
          a { text-decoration: none !important; color: #0000EE !important; }
          a[href]:after { content: " (" attr(href) ")"; font-size: 0.8em; }
          .print-hidden { display: none !important; }
          .print-block { display: block !important; }
          .print-text-xs { font-size: 0.75rem !important; }
          .print-text-sm { font-size: 0.875rem !important; }
          .print-text-md { font-size: 1rem !important; } /* For section titles */
          .print-text-lg { font-size: 1.125rem !important; }
          .print-text-xl { font-size: 1.25rem !important; } /* For main title */
          .print-font-bold { font-weight: bold !important; }
          .print-font-semibold { font-weight: 600 !important; }
          .print-my-1 { margin-top: 0.25rem !important; margin-bottom: 0.25rem !important; }
          .print-my-2 { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
          .print-mt-3 { margin-top: 0.75rem !important; }
          .print-mb-2 { margin-bottom: 0.5rem !important; }
          .print-mb-4 { margin-bottom: 1rem !important; }
          hr { border-color: #ccc !important; }
          ul.list-disc { margin-left: 1.5rem !important; } /* Ensure lists are visible */
          li { margin-bottom: 0.1rem !important; }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.body.innerHTML = originalContents;
      style.remove();
      nonPrintable.forEach(el => (el as HTMLElement).style.display = ''); // Restore display
    }
  };

  const handleEdit = () => {
    onClose(); 
    navigate(`/nominate/edit/${nomination.id}`);
  };
  
  const statusVariant = (status: string | null | undefined): "default" | "success" | "destructive" | "outline" => {
    switch (status) {
      case 'submitted': return 'default';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'draft':
      case 'incomplete': 
      default: return 'outline';
    }
  };
  
  const awardCategoryTitle = sectionB?.award_category ? getCategoryTitleById(sectionB.award_category) : 'N/A';
  const specificAwardName = (sectionB?.award_category && sectionB?.specific_award) ? getAwardNameByValue(sectionB.award_category, sectionB.specific_award) : 'N/A';
  const submittedAtDate = nomination.submitted_at ? parseISO(nomination.submitted_at) : null;
  const createdAtDate = nomination.created_at ? parseISO(nomination.created_at) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        id="nomination-details-modal-content" 
        className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl dark:bg-gray-800 print-hidden-override"
      >
        <div id="nomination-details-printable-area" className="print-visible print-bg-white"> 
          <div className="hidden print:block print:p-0 print:m-0">
              <h1 className="print-text-xl print-font-bold print-text-black print-mb-2">Nomination Details: {nomination.nominee_name || 'N/A'}</h1>
              <p className="print-text-xs print-text-black">
                Nomination ID: {nomination.id} <br />
                Status: <span className="print-font-semibold">{nomination.status ? nomination.status.charAt(0).toUpperCase() + nomination.status.slice(1) : 'N/A'}</span> <br/>
                {nomination.status === 'submitted' && submittedAtDate && isValid(submittedAtDate) && 
                  `Submitted on: ${format(submittedAtDate, 'PPPp')}`
                }
                {nomination.status !== 'submitted' && createdAtDate && isValid(createdAtDate) &&
                  `Created on: ${format(createdAtDate, 'PPPp')}`
                }
                {(nomination.status === 'draft' && (!submittedAtDate || !isValid(submittedAtDate))) && '(Draft - Not Submitted)'}
              </p>
              {awardCategoryTitle !== 'N/A' && <p className="print-text-xs print-text-black">Award Category: {awardCategoryTitle}</p>}
              {specificAwardName !== 'N/A' && <p className="print-text-xs print-text-black">Specific Award: {specificAwardName}</p>}
              <hr className="print-my-2"/>
          </div>

          <DialogHeader className="print:hidden">
            <DialogTitle className="text-2xl font-serif text-tpahla-darkgreen dark:text-tpahla-gold">
              Nomination: {nomination.nominee_name || 'N/A'}
            </DialogTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm mt-2">
              <div className="mb-2"><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status:</p><Badge variant={statusVariant(nomination.status)} className="text-xs">{nomination.status ? nomination.status.charAt(0).toUpperCase() + nomination.status.slice(1) : 'N/A'}</Badge></div>
              <div className="mb-2"><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nomination ID:</p><p className="text-sm text-gray-900 dark:text-gray-100">{nomination.id}</p></div>
              <div className="mb-2"><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{nomination.status === 'submitted' ? "Date Submitted" : "Date Created"}:</p><p className="text-sm text-gray-900 dark:text-gray-100">{nomination.status === 'submitted' ? (submittedAtDate && isValid(submittedAtDate) ? format(submittedAtDate, 'PPP') : 'N/A') : (createdAtDate && isValid(createdAtDate) ? format(createdAtDate, 'PPP') : 'N/A')}</p></div>
              <div className="mb-2"><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Award Category:</p><p className="text-sm text-gray-900 dark:text-gray-100">{awardCategoryTitle}</p></div>
              <div className="mb-2"><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Specific Award:</p><p className="text-sm text-gray-900 dark:text-gray-100">{specificAwardName}</p></div>
            </div>
            <DialogDescription className="dark:text-gray-400 mt-1 print:hidden">
              Review the full details of this nomination. Use the tabs to navigate sections.
            </DialogDescription>
          </DialogHeader>
        
          <ScrollArea className="h-[60vh] pr-4 mt-4 print:h-auto print:overflow-visible print:border-none print:shadow-none print:p-0 print:m-0">
            <div className="py-4 print:py-0 print:h-auto print:overflow-visible print:p-0 print:m-0">
              <Tabs defaultValue="sectionA" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 print:hidden">
                  <TabsTrigger value="sectionA">Section A</TabsTrigger>
                  <TabsTrigger value="sectionB">Section B</TabsTrigger>
                  <TabsTrigger value="sectionC">Section C</TabsTrigger>
                  <TabsTrigger value="sectionD">Section D</TabsTrigger>
                  <TabsTrigger value="sectionE">Section E</TabsTrigger>
                </TabsList>

                <div className="hidden print:block space-y-4 print:mt-3">
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section A: Nominee Information</h4>
                    <SectionAContentRenderer data={sectionA} />
                    <hr className="print-my-1"/>
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section B: Award Category</h4>
                    <SectionBContentRenderer data={sectionB} />
                    <hr className="print-my-1"/>
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section C: Justification & Supporting Materials</h4>
                    <SectionCContentRenderer data={sectionC} />
                    {nomination.form_section_c_notes && <ModalDetailItem label="Section C Notes" value={nomination.form_section_c_notes}/>}
                    <hr className="print-my-1"/>
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section D: Nominator Information</h4>
                    <SectionDContentRenderer data={sectionD} />
                    <hr className="print-my-1"/>
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section E: Declaration & Signature</h4>
                    <SectionEContentRenderer data={sectionE} />
                </div>

                <div className="print:hidden">
                  <TabsContent value="sectionA" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section A: Nominee Information</h4>
                    <SectionAContentRenderer data={sectionA} />
                  </TabsContent>
                  <TabsContent value="sectionB" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section B: Award Category</h4>
                    <SectionBContentRenderer data={sectionB} />
                  </TabsContent>
                  <TabsContent value="sectionC" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section C: Justification & Supporting Materials</h4>
                    <SectionCContentRenderer data={sectionC} />
                    {nomination.form_section_c_notes && <ModalDetailItem label="Section C Notes" value={nomination.form_section_c_notes} fullWidth />}
                  </TabsContent>
                  <TabsContent value="sectionD" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section D: Nominator Information</h4>
                    <SectionDContentRenderer data={sectionD} />
                  </TabsContent>
                  <TabsContent value="sectionE" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section E: Declaration & Signature</h4>
                    <SectionEContentRenderer data={sectionE} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ScrollArea>
        </div> 

        <DialogFooter className="sm:justify-between print:hidden pt-4">
          <div>
            <Button type="button" variant="tpahla-primary" onClick={handleEdit}>
              <Edit size={16} className="mr-2" />
              Edit Nomination
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer size={16} className="mr-2" />
              Print / PDF
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NominationDetailsModal;
