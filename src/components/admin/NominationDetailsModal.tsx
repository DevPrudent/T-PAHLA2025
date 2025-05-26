
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
import { supabase } from '@/integrations/supabase/client';
import { Printer, Download, Edit, ExternalLink } from 'lucide-react';
import { getCategoryTitleById, getAwardNameByValue } from '@/lib/awardCategories';
import { getCountryNameByCode } from '@/lib/africanCountries';
import { useNavigate } from 'react-router-dom';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

// Define the props interface for NominationDetailsModal
interface NominationDetailsModalProps {
  nomination: NominationRow | null;
  isOpen: boolean;
  onClose: () => void;
}

// Define interfaces for the expected structure of each section's data
// These allow for properties to be optional, as data might be incomplete.

interface FileInfo {
  file_name: string;
  storage_path: string;
  // For files that might already have a direct URL (e.g. from older system or direct links)
  name?: string; 
  url?: string;
}

interface MediaLink {
  value: string;
}

interface SectionAData {
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
  [key: string]: any; // Allow other properties
}

interface SectionBData {
  award_category?: string;
  specific_award?: string;
  [key: string]: any; // Allow other properties
}

interface SectionCData {
  justification_statement?: string;
  achievements_and_impact?: string;
  leadership_and_innovation?: string;
  sustainability_and_scalability?: string;
  cv_resume?: FileInfo[] | FileInfo | null;
  photos_media?: FileInfo[] | FileInfo | null;
  other_documents?: FileInfo[] | FileInfo | null;
  media_links?: MediaLink[];
  [key: string]: any; // Allow other properties
}

interface SectionDData {
  nominator_full_name?: string;
  nominator_relationship_to_nominee?: string;
  nominator_organization?: string;
  nominator_email?: string;
  nominator_phone?: string;
  nominator_reason?: string;
  [key: string]: any; // Allow other properties
}

interface SectionEData {
  confirm_accuracy?: boolean;
  confirm_nominee_contact?: boolean;
  confirm_data_use?: boolean;
  nominator_signature?: string;
  date_signed?: string; // Stored as string, will be parsed
  [key: string]: any; // Allow other properties
}

const NOMINATION_FILES_BUCKET = 'nomination-files'; 

const DetailItem: React.FC<{ label: string; value: React.ReactNode; isLink?: boolean; fullWidth?: boolean }> = ({ label, value, isLink, fullWidth }) => (
  <div className={`mb-2 print:mb-1 ${fullWidth ? 'sm:col-span-2' : ''}`}>
    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 print:text-black">{label}:</p>
    <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words print:text-black">
      {isLink && typeof value === 'string' ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
          {value} <ExternalLink size={12} className="inline ml-1" />
        </a>
      ) : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value ?? 'N/A'}
    </div>
  </div>
);

const renderSectionAContent = (data: SectionAData | null) => {
  if (!data || typeof data !== 'object') return <p className="text-sm text-gray-500 dark:text-gray-400">No data provided for this section.</p>;
  
  const dob = data.nominee_dob ? parseISO(data.nominee_dob) : null;

  return (
    <div className="space-y-3 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <DetailItem label="Full Name" value={data.nominee_full_name} />
        <DetailItem label="Gender" value={data.nominee_gender ? data.nominee_gender.charAt(0).toUpperCase() + data.nominee_gender.slice(1) : 'N/A'} />
        <DetailItem label="Date of Birth" value={dob && isValid(dob) ? format(dob, 'PPP') : 'N/A'} />
        <DetailItem label="Nationality" value={data.nominee_nationality ? getCountryNameByCode(data.nominee_nationality) : 'N/A'} />
        <DetailItem label="Country of Residence" value={data.nominee_country_of_residence ? getCountryNameByCode(data.nominee_country_of_residence) : 'N/A'} />
        <DetailItem label="Organization/Institution" value={data.nominee_organization} />
        <DetailItem label="Title/Position" value={data.nominee_title_position} />
        <DetailItem label="Email Address" value={data.nominee_email} isLink={!!data.nominee_email && data.nominee_email.includes('@')} />
        <DetailItem label="Phone Number" value={data.nominee_phone} />
        <DetailItem label="Social Media Handles" value={data.nominee_social_media} isLink={!!data.nominee_social_media} fullWidth={true}/>
      </div>
    </div>
  );
};

const renderGenericSectionContent = (data: Record<string, any> | null, sectionTitle: string) => {
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0 && !Array.isArray(data))) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No data provided for this section.</p>;
  }
  if (typeof data !== 'object' || data === null) { // Ensure data is an object
     return <DetailItem label={sectionTitle} value={String(data)} />;
  }

  return Object.entries(data).map(([key, value]) => {
    const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
     if (['cv_resume', 'photos_media', 'other_documents'].includes(key) && value) {
        const fileArrayInput = Array.isArray(value) ? value : [value]; // Ensure it's an array
        const validFiles: FileInfo[] = fileArrayInput.filter(
            (file: any): file is FileInfo => file && typeof file === 'object' && 
                           (('file_name' in file && 'storage_path' in file) || ('name' in file && 'url' in file))
        );

        if (validFiles.length > 0) {
          return (
            <DetailItem
              key={key}
              label={formattedKey}
              value={
                <ul className="list-disc list-inside pl-1">
                  {validFiles.map((fileData, index: number) => {
                    let publicUrl = '#';
                    let fileName = 'Download/View File';

                    if (fileData.storage_path && fileData.file_name) {
                      fileName = fileData.file_name;
                      const { data: publicUrlData } = supabase.storage
                        .from(NOMINATION_FILES_BUCKET)
                        .getPublicUrl(fileData.storage_path, { download: fileName }); // Ensure download attribute for non-viewable files
                      publicUrl = publicUrlData?.publicUrl ?? '#';
                    } else if (fileData.url && fileData.name) { // Case for pre-existing URLs
                       fileName = fileData.name;
                       publicUrl = fileData.url;
                    }


                    return (
                      <li key={index} className="text-sm flex items-center">
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" download={fileName.includes('.') ? fileName : undefined} className="text-blue-600 dark:text-blue-400 hover:underline print:text-blue-600">
                          {fileName}
                        </a>
                        <a href={publicUrl} download={fileName.includes('.') ? fileName : undefined} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 print:hidden" title={`Download ${fileName}`}>
                          <Download size={16} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              }
            />
          );
        }
        return <DetailItem key={key} label={formattedKey} value="No files or invalid file data." />;
    }
    if (key === 'media_links' && Array.isArray(value)) {
        const validLinks = value.filter((link): link is MediaLink => link && typeof link.value === 'string' && link.value.trim() !== '');
        return (
          <div key={key} className="mb-2 sm:col-span-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formattedKey}:</p>
            {validLinks.length > 0 ? (
              <ul className="list-disc list-inside pl-4">
                {validLinks.map((link, index: number) => (
                    <li key={index} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      <a href={link.value.startsWith('http') ? link.value : `https://${link.value}`} target="_blank" rel="noopener noreferrer">
                        {link.value} <ExternalLink size={12} className="inline ml-1" />
                      </a>
                    </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-900 dark:text-gray-100">N/A</p>}
          </div>
        );
    }
    if (key === 'date_signed' && typeof value === 'string') {
        try {
            const dateValue = parseISO(value);
            return <DetailItem key={key} label={formattedKey} value={isValid(dateValue) ? format(dateValue, 'PPP') : String(value)} />;
        } catch (e) { return <DetailItem key={key} label={formattedKey} value={String(value)} />; }
    }
    if (typeof value === 'boolean') {
        return <DetailItem key={key} label={formattedKey} value={value ? 'Yes' : 'No'} />;
    }
    if (key === 'award_category' && sectionTitle === "Section B: Award Category" && typeof value === 'string') {
        return <DetailItem key={key} label="Award Category" value={getCategoryTitleById(value) || value} />;
    }
    if (key === 'specific_award' && sectionTitle === "Section B: Award Category" && typeof value === 'string' && typeof data.award_category === 'string') {
        return <DetailItem key={key} label="Specific Award" value={getAwardNameByValue(data.award_category, value) || value} />;
    }

    // Fallback for other string, number, or simple values
    const displayValue = (value !== null && value !== undefined && typeof value !== 'object') ? String(value) : 
                         (typeof value === 'object' ? JSON.stringify(value) : 'N/A'); // Basic object stringification as last resort.
    return <DetailItem key={key} label={formattedKey} value={displayValue} />;
  });
};

const NominationDetailsModal: React.FC<NominationDetailsModalProps> = ({ nomination, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!nomination) return null;

  // Use the new interfaces for casting
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
      case 'submitted': return 'default'; // Using 'default' for submitted as per Badge typical usage, can be 'success' too
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
              <DetailItem label="Status" value={
                <Badge variant={statusVariant(nomination.status)} className="text-xs">
                  {nomination.status ? nomination.status.charAt(0).toUpperCase() + nomination.status.slice(1) : 'N/A'}
                </Badge>} 
              />
              <DetailItem label="Nomination ID" value={nomination.id} />
              <DetailItem 
                label={nomination.status === 'submitted' ? "Date Submitted" : "Date Created"} 
                value={
                  nomination.status === 'submitted' 
                  ? (submittedAtDate && isValid(submittedAtDate) ? format(submittedAtDate, 'PPP') : 'N/A')
                  : (createdAtDate && isValid(createdAtDate) ? format(createdAtDate, 'PPP') : 'N/A')
                } 
              />
              <DetailItem label="Award Category" value={awardCategoryTitle} />
              <DetailItem label="Specific Award" value={specificAwardName} />
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
                    {renderSectionAContent(sectionA)}
                    <hr className="print-my-1"/>
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section B: Award Category</h4>
                    {renderGenericSectionContent(sectionB, "Section B: Award Category")}
                    <hr className="print-my-1"/>
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section C: Justification & Supporting Materials</h4>
                    {renderGenericSectionContent(sectionC, "Section C: Justification")}
                    {nomination.form_section_c_notes && <DetailItem label="Section C Notes" value={nomination.form_section_c_notes}/>}
                    <hr className="print-my-1"/>
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section D: Nominator Information</h4>
                    {renderGenericSectionContent(sectionD, "Section D: Nominator Information")}
                    <hr className="print-my-1"/>
                    <h4 className="print-text-md print-font-semibold print-mt-3 print-text-black">Section E: Declaration & Signature</h4>
                    {renderGenericSectionContent(sectionE, "Section E: Declaration")}
                </div>

                <div className="print:hidden">
                  <TabsContent value="sectionA" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section A: Nominee Information</h4>
                    {renderSectionAContent(sectionA)}
                  </TabsContent>
                  <TabsContent value="sectionB" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section B: Award Category</h4>
                    {renderGenericSectionContent(sectionB, "Section B: Award Category")}
                  </TabsContent>
                  <TabsContent value="sectionC" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section C: Justification & Supporting Materials</h4>
                    {renderGenericSectionContent(sectionC, "Section C: Justification")}
                    {nomination.form_section_c_notes && <DetailItem label="Section C Notes" value={nomination.form_section_c_notes}/>}
                  </TabsContent>
                  <TabsContent value="sectionD" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section D: Nominator Information</h4>
                    {renderGenericSectionContent(sectionD, "Section D: Nominator Information")}
                  </TabsContent>
                  <TabsContent value="sectionE" className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-tpahla-darkgreen dark:text-tpahla-gold">Section E: Declaration & Signature</h4>
                    {renderGenericSectionContent(sectionE, "Section E: Declaration")}
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
