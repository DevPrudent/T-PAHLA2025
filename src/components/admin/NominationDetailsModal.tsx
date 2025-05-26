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
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Printer, Download, Edit, ExternalLink } from 'lucide-react';
import { getCategoryTitleById, getAwardNameByValue } from '@/lib/awardCategories';
import { getCountryNameByCode, africanCountries } from '@/lib/africanCountries'; // Assuming africanCountries includes names for flags if we add them later
import { useNavigate } from 'react-router-dom';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
// Ensure these types correctly represent the JSONB structure or can be null/undefined
type NominationStepAData = NominationRow['form_section_a'] extends Record<string, any> ? NominationRow['form_section_a'] : null;
type NominationStepBData = NominationRow['form_section_b'] extends Record<string, any> ? NominationRow['form_section_b'] : null;
type NominationStepCData = NominationRow['form_section_c'] extends Record<string, any> ? NominationRow['form_section_c'] : null;
type NominationStepDData = NominationRow['form_section_d'] extends Record<string, any> ? NominationRow['form_section_d'] : null;
type NominationStepEData = NominationRow['form_section_e'] extends Record<string, any> ? NominationRow['form_section_e'] : null;

interface NominationDetailsModalProps {
  nomination: NominationRow | null;
  isOpen: boolean;
  onClose: () => void;
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

const renderSectionAContent = (data: NominationStepAData) => {
  if (!data || typeof data !== 'object') return <p className="text-sm text-gray-500 dark:text-gray-400">No data provided for this section.</p>;
  
  // Explicitly type data to allow property access safely
  const sectionAData = data as {
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
  };

  return (
    <div className="space-y-3 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <DetailItem label="Full Name" value={sectionAData.nominee_full_name} />
        <DetailItem label="Gender" value={sectionAData.nominee_gender ? sectionAData.nominee_gender.charAt(0).toUpperCase() + sectionAData.nominee_gender.slice(1) : 'N/A'} />
        <DetailItem label="Date of Birth" value={sectionAData.nominee_dob ? format(parseISO(sectionAData.nominee_dob), 'PPP') : 'N/A'} />
        <DetailItem label="Nationality" value={sectionAData.nominee_nationality ? getCountryNameByCode(sectionAData.nominee_nationality) : 'N/A'} />
        <DetailItem label="Country of Residence" value={sectionAData.nominee_country_of_residence ? getCountryNameByCode(sectionAData.nominee_country_of_residence) : 'N/A'} />
        <DetailItem label="Organization/Institution" value={sectionAData.nominee_organization} />
        <DetailItem label="Title/Position" value={sectionAData.nominee_title_position} />
        <DetailItem label="Email Address" value={sectionAData.nominee_email} isLink={!!sectionAData.nominee_email} />
        <DetailItem label="Phone Number" value={sectionAData.nominee_phone} />
        <DetailItem label="Social Media Handles" value={sectionAData.nominee_social_media} isLink={!!sectionAData.nominee_social_media} fullWidth={true}/>
      </div>
    </div>
  );
};

const renderGenericSectionContent = (data: any | null, sectionTitle: string) => {
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0 && !Array.isArray(data))) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No data provided for this section.</p>;
  }
  if (typeof data !== 'object') {
     return <DetailItem label={sectionTitle} value={String(data)} />;
  }

  // Simplified rendering for other sections for now
  return Object.entries(data).map(([key, value]) => {
    const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // Handle files specifically if they appear in other sections
     if (['cv_resume', 'photos_media', 'other_documents'].includes(key) && value) {
        const fileArray = Array.isArray(value) ? value : (value && typeof value === 'object' && (('file_name' in value && 'storage_path' in value) || ('name' in value && 'url' in value)) ? [value] : []);
        const validFiles = fileArray.filter(
            (file: any) => file && typeof file === 'object' && 
                           (('file_name' in file && 'storage_path' in file) || ('name' in file && 'url' in file))
        );

        if (validFiles.length > 0) {
          return (
            <DetailItem
              key={key}
              label={formattedKey}
              value={
                <ul className="list-disc list-inside pl-1">
                  {validFiles.map((fileData: any, index: number) => {
                    let publicUrl = '#';
                    let fileName = 'Download/View File';

                    if (fileData.storage_path && fileData.file_name) {
                      fileName = fileData.file_name;
                      const { data: publicUrlData } = supabase.storage
                        .from(NOMINATION_FILES_BUCKET)
                        .getPublicUrl(fileData.storage_path, { download: fileName });
                      publicUrl = publicUrlData?.publicUrl ?? '#';
                    } else if (fileData.url && fileData.name) {
                       fileName = fileData.name;
                       publicUrl = fileData.url;
                    }

                    return (
                      <li key={index} className="text-sm flex items-center">
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" download={fileName} className="text-blue-600 dark:text-blue-400 hover:underline print:text-blue-600">
                          {fileName}
                        </a>
                        <a href={publicUrl} download={fileName} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 print:hidden" title={`Download ${fileName}`}>
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
        return (
          <div key={key} className="mb-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formattedKey}:</p>
            {value.length > 0 ? (
              <ul className="list-disc list-inside pl-4">
                {value.map((link: any, index: number) => (
                  link && typeof link.value === 'string' ? (
                    <li key={index} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      <a href={link.value.startsWith('http') ? link.value : `https://${link.value}`} target="_blank" rel="noopener noreferrer">{link.value}</a>
                    </li>
                  ) : null
                ))}
              </ul>
            ) : <p className="text-sm text-gray-900 dark:text-gray-100">N/A</p>}
          </div>
        );
    }
    if (key === 'date_signed' && typeof value === 'string') {
        try {
            const dateValue = parseISO(value);
            return <DetailItem key={key} label={formattedKey} value={!isNaN(dateValue.getTime()) ? format(dateValue, 'PPP') : String(value)} />;
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

    return <DetailItem key={key} label={formattedKey} value={value !== null && value !== undefined ? String(value) : 'N/A'} />;
  });
};

const NominationDetailsModal: React.FC<NominationDetailsModalProps> = ({ nomination, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!nomination) return null;

  const sectionA = nomination.form_section_a as NominationStepAData | null;
  const sectionB = nomination.form_section_b as NominationStepBData | null;
  const sectionC = nomination.form_section_c as NominationStepCData | null; 
  const sectionD = nomination.form_section_d as NominationStepDData | null;
  const sectionE = nomination.form_section_e as NominationStepEData | null;

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
          body { margin: 20px !important; font-family: sans-serif; }
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
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.body.innerHTML = originalContents;
      style.remove();
      nonPrintable.forEach(el => (el as HTMLElement).style.display = ''); // Restore display
      // Re-attach event listeners or re-initialize components if necessary, though usually not needed for modals
      // This is a simple way, for complex apps, a more robust printing solution might be needed
    }
  };

  const handleEdit = () => {
    onClose(); // Close the modal
    navigate(`/nominate/edit/${nomination.id}`);
  };
  
  const statusVariant = (status: string | null | undefined) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        id="nomination-details-modal-content" 
        className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl dark:bg-gray-800 print-hidden-override" // Modal itself should be hidden for print
      >
        {/* This div is what gets printed */}
        <div id="nomination-details-printable-area" className="print-visible"> 
          {/* Header for Print */}
          <div className="hidden print:block mb-4 print:mb-2 p-4 print:p-0">
              <h1 className="text-xl font-bold text-black">Nomination Details: {nomination.nominee_name}</h1>
              <p className="text-xs text-gray-600">
                Nomination ID: {nomination.id} <br />
                Submitted on: {nomination.submitted_at ? format(parseISO(nomination.submitted_at), 'PPPp') : (nomination.status === 'draft' ? 'Draft (Not Submitted)' : 'N/A')}
              </p>
              <hr className="my-2 print:my-1"/>
          </div>

          {/* Header for Screen */}
          <DialogHeader className="print:hidden">
            <DialogTitle className="text-2xl font-serif text-tpahla-darkgreen dark:text-tpahla-gold">
              Nomination: {nomination.nominee_name || 'N/A'}
            </DialogTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm mt-2">
              <DetailItem label="Status" value={
                <Badge variant={statusVariant(nomination.status)} className="text-xs">
                  {nomination.status ? nomination.status.charAt(0).toUpperCase() + nomination.status.slice(1) : 'N/A'}
                </Badge>} 
              />
              <DetailItem label="Nomination ID" value={nomination.id} />
              <DetailItem label="Date Submitted" value={nomination.submitted_at ? format(parseISO(nomination.submitted_at), 'PPP') : (nomination.status === 'draft' ? 'Draft' : 'N/A')} />
              <DetailItem label="Award Category" value={awardCategoryTitle} />
              <DetailItem label="Specific Award" value={specificAwardName} />
            </div>
            <DialogDescription className="dark:text-gray-400 mt-1">
              Review the full details of this nomination.
            </DialogDescription>
          </DialogHeader>
        
          <ScrollArea className="h-[60vh] pr-4 mt-4 print:h-auto print:overflow-visible print:border-none print:shadow-none">
            <div className="py-4 print:py-0 print:h-auto print:overflow-visible print:p-0 print:m-0">
              <Tabs defaultValue="sectionA" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 print:hidden">
                  <TabsTrigger value="sectionA">Section A</TabsTrigger>
                  <TabsTrigger value="sectionB">Section B</TabsTrigger>
                  <TabsTrigger value="sectionC">Section C</TabsTrigger>
                  <TabsTrigger value="sectionD">Section D</TabsTrigger>
                  <TabsTrigger value="sectionE">Section E</TabsTrigger>
                </TabsList>

                {/* Content for Print - all sections visible */}
                <div className="hidden print:block space-y-4 mt-4">
                    <h4 className="text-md font-semibold mt-3 text-tpahla-darkgreen dark:text-tpahla-gold print:text-black">Section A: Nominee Information</h4>
                    {renderSectionAContent(sectionA)}
                    <h4 className="text-md font-semibold mt-3 text-tpahla-darkgreen dark:text-tpahla-gold print:text-black">Section B: Award Category</h4>
                    {renderGenericSectionContent(sectionB, "Section B: Award Category")}
                    <h4 className="text-md font-semibold mt-3 text-tpahla-darkgreen dark:text-tpahla-gold print:text-black">Section C: Justification & Supporting Materials</h4>
                    {renderGenericSectionContent(sectionC, "Section C: Justification")}
                    {nomination.form_section_c_notes && <DetailItem label="Section C Notes" value={nomination.form_section_c_notes}/>}
                    <h4 className="text-md font-semibold mt-3 text-tpahla-darkgreen dark:text-tpahla-gold print:text-black">Section D: Nominator Information</h4>
                    {renderGenericSectionContent(sectionD, "Section D: Nominator Information")}
                    <h4 className="text-md font-semibold mt-3 text-tpahla-darkgreen dark:text-tpahla-gold print:text-black">Section E: Declaration & Signature</h4>
                    {renderGenericSectionContent(sectionE, "Section E: Declaration")}
                </div>

                {/* Content for Screen - tabbed */}
                <div className="print:hidden">
                  <TabsContent value="sectionA" className="mt-4">
                    <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold">Section A: Nominee Information</h4>
                    {renderSectionAContent(sectionA)}
                  </TabsContent>
                  <TabsContent value="sectionB" className="mt-4">
                    <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold">Section B: Award Category</h4>
                    {renderGenericSectionContent(sectionB, "Section B: Award Category")}
                  </TabsContent>
                  <TabsContent value="sectionC" className="mt-4">
                    <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold">Section C: Justification & Supporting Materials</h4>
                    {renderGenericSectionContent(sectionC, "Section C: Justification")}
                    {nomination.form_section_c_notes && <DetailItem label="Section C Notes" value={nomination.form_section_c_notes}/>}
                  </TabsContent>
                  <TabsContent value="sectionD" className="mt-4">
                    <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold">Section D: Nominator Information</h4>
                    {renderGenericSectionContent(sectionD, "Section D: Nominator Information")}
                  </TabsContent>
                  <TabsContent value="sectionE" className="mt-4">
                    <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold">Section E: Declaration & Signature</h4>
                    {renderGenericSectionContent(sectionE, "Section E: Declaration")}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ScrollArea>
        </div> {/* End of nomination-details-printable-area */}

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
