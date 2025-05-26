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
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Printer, Download } from 'lucide-react';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
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

const NOMINATION_FILES_BUCKET = 'nomination-files'; 

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="mb-2 print:mb-1">
    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 print:text-black">{label}:</p>
    <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words print:text-black">
      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value ?? 'N/A'}
    </div>
  </div>
);

const renderSection = (title: string, data: any | null) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <DetailItem label={title} value="No data provided for this section." />;
  }
  if (Array.isArray(data)) {
    // For arrays that are not files or media_links, stringify them.
    // This avoids issues if an unexpected array structure is encountered.
    if (title.toLowerCase().includes("media links") || title.toLowerCase().includes("files")) {
        // Handle specific array types below if necessary, otherwise this is a generic array.
    } else {
        return <DetailItem label={title} value={JSON.stringify(data, null, 2)} />;
    }
  }

  return (
    <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50 print:border-gray-300 print:bg-white">
      <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold print:text-black">{title}</h4>
      {Object.entries(data).map(([key, value]) => {
        const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        if (key === 'media_links' && Array.isArray(value)) {
          return (
            <div key={key} className="mb-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formattedKey}:</p>
              {value.length > 0 ? (
                <ul className="list-disc list-inside pl-4">
                  {value.map((link: any, index: number) => (
                    link && typeof link.value === 'string' ? (
                      <li key={index} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        <a href={link.value} target="_blank" rel="noopener noreferrer">{link.value}</a>
                      </li>
                    ) : null
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-900 dark:text-gray-100">N/A</p>}
            </div>
          );
        } 
        else if (['cv_resume', 'photos_media', 'other_documents'].includes(key) && value) {
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
                        // Use { download: fileName } to suggest filename and force Content-Disposition header
                        const { data: publicUrlData } = supabase.storage
                          .from(NOMINATION_FILES_BUCKET)
                          .getPublicUrl(fileData.storage_path, { download: fileData.file_name });
                        
                        if (!publicUrlData || !publicUrlData.publicUrl) {
                          console.error(`Could not retrieve public URL for ${fileData.storage_path}`);
                          return (
                            <li key={index} className="text-sm text-red-500">
                              Could not retrieve link for {fileName}.
                            </li>
                          );
                        }
                        publicUrl = publicUrlData.publicUrl;
                      } else if (fileData.url && fileData.name) {
                         fileName = fileData.name;
                         publicUrl = fileData.url;
                         // For external URLs or URLs not from Supabase Storage, we rely on the 'download' attribute on <a>
                      } else {
                         return (
                            <li key={index} className="text-sm text-gray-500">
                              Invalid file data for an item.
                            </li>
                          );
                      }

                      return (
                        <li key={index} className="text-sm flex items-center">
                          <a
                            href={publicUrl}
                            target="_blank" // Opens in new tab, download attribute might still work depending on browser/headers
                            rel="noopener noreferrer"
                            download={fileName} // Instruct browser to download
                            className="text-blue-600 dark:text-blue-400 hover:underline print:text-blue-600"
                          >
                            {fileName}
                          </a>
                          <a
                            href={publicUrl}
                            download={fileName} // Reinforce download instruction
                            target="_blank" // Helps avoid navigation issues if direct click doesn't download
                            rel="noopener noreferrer"
                            className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 print:hidden"
                            title={`Download ${fileName}`}
                          >
                            <Download size={16} />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                }
              />
            );
          } else {
            return <DetailItem key={key} label={formattedKey} value="No files uploaded or data is in an unexpected format." />;
          }
        }
        else if (key === 'date_signed' && value && typeof value === 'string') {
            try {
              const dateValue = parseISO(value); 
              if (!isNaN(dateValue.getTime())) {
                return <DetailItem key={key} label={formattedKey} value={format(dateValue, 'PPP')} />;
              } else {
                // Fallback for dates not parsable by parseISO but still provided as strings
                return <DetailItem key={key} label={formattedKey} value={String(value)} />;
              }
            } catch (e) {
              // Fallback if parseISO throws an error
              return <DetailItem key={key} label={formattedKey} value={String(value)} />;
            }
        }
        
        else if (typeof value === 'boolean') {
          return <DetailItem key={key} label={formattedKey} value={value ? 'Yes' : 'No'} />;
        }
        
        // Default rendering for other value types
        return <DetailItem key={key} label={formattedKey} value={value !== null && value !== undefined ? String(value) : 'N/A'} />;
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

  const handlePrint = () => {
    // CSS print styles handle hiding/showing elements.
    // No dynamic style changes needed here usually.
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        id="nomination-details-modal-content" 
        className="sm:max-w-2xl md:max-w-3xl dark:bg-gray-800 print:shadow-none print:border-none print:max-w-full print:w-full print:h-auto print:overflow-visible print:bg-white print:static print:inset-auto print:translate-x-0 print:translate-y-0"
      >
        <DialogHeader className="print:hidden">
          <DialogTitle className="text-2xl font-serif text-tpahla-darkgreen dark:text-tpahla-gold">
            Nomination Details: {nomination.nominee_name}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Full details for the nomination submitted on {nomination.submitted_at ? format(parseISO(nomination.submitted_at), 'PPPp') : 'N/A'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="print:text-black print:bg-white print:h-auto"> {/* Ensure this wrapper also allows auto height */}
            <div className="hidden print:block mb-4">
                <h1 className="text-2xl font-bold text-black">Nomination Details: {nomination.nominee_name}</h1>
                <p className="text-sm text-gray-600">
                  Submitted on: {nomination.submitted_at ? format(parseISO(nomination.submitted_at), 'PPPp') : 'N/A'}
                </p>
                <hr className="my-2"/>
            </div>

            <ScrollArea className="h-[60vh] pr-4 print:h-auto print:overflow-visible">
              <div className="space-y-4 py-4">
                <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50 print:border-gray-300 print:bg-white">
                    <h4 className="text-md font-semibold mb-2 text-tpahla-darkgreen dark:text-tpahla-gold print:text-black">General Information</h4>
                    <DetailItem label="Nomination ID" value={nomination.id} />
                    <DetailItem label="Nominee Name" value={nomination.nominee_name} />
                    <DetailItem label="Nominee Type" value={nomination.nominee_type} />
                    <DetailItem label="Award Category ID" value={nomination.award_category_id} />
                    <DetailItem label="Nominator Name" value={nomination.nominator_name} />
                    <DetailItem label="Nominator Email" value={nomination.nominator_email} />
                    <DetailItem 
                      label="Status" 
                      value={
                        <Badge 
                            variant={
                                nomination.status === "approved" ? "success" : 
                                nomination.status === "rejected" ? "destructive" :
                                nomination.status === "submitted" ? "default" :
                                "outline"
                            }
                            className="print:border print:border-gray-400 print:text-black print:bg-gray-100"
                        >
                            {nomination.status}
                        </Badge>
                      } 
                    />
                    <DetailItem label="Summary of Achievement" value={nomination.summary_of_achievement} />
                    <DetailItem label="Created At" value={nomination.created_at ? format(parseISO(nomination.created_at), 'PPPp') : 'N/A'} />
                    <DetailItem label="Updated At" value={nomination.updated_at ? format(parseISO(nomination.updated_at), 'PPPp') : 'N/A'} />
                    <DetailItem label="Submitted At" value={nomination.submitted_at ? format(parseISO(nomination.submitted_at), 'PPPp') : 'N/A'} />
                </div>

                {renderSection("Section A: Nominee Information", sectionA)}
                {renderSection("Section B: Award Category", sectionB)}
                {renderSection("Section C: Justification & Supporting Materials", sectionC)}
                
                {nomination.form_section_c_notes && <DetailItem label="Section C Notes" value={nomination.form_section_c_notes}/>}
                {renderSection("Section D: Nominator Information", sectionD)}
                {renderSection("Section E: Declaration & Signature", sectionE)}
              </div>
            </ScrollArea>
        </div>


        <DialogFooter className="sm:justify-end print:hidden">
           <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer size={16} className="mr-2" />
            Print
          </Button>
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
