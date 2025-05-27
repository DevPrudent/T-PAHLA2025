
import React from 'react';
import DetailItemDisplay from '@/components/admin/DetailItemDisplay';
import { supabase } from '@/integrations/supabase/client';
import { Download, ExternalLink, FileText, FileImage } from 'lucide-react'; // Assuming FileText etc.
import { Button } from '@/components/ui/button';

// From NominationDetailsModal:
interface FileInfo {
  file_name: string;
  storage_path: string;
  name?: string; 
  url?: string;
}
interface MediaLink {
  value: string;
}
interface SectionCData {
  justification_statement?: string; // Changed from 'justification' to match schema likely used
  achievements_and_impact?: string; // Added to match modal structure
  leadership_and_innovation?: string; // Added
  sustainability_and_scalability?: string; // Added
  notable_recognitions?: string; // from validator: nominationStepCSchema
  media_links?: MediaLink[];
  cv_resume?: FileInfo[] | FileInfo | null;
  photos_media?: FileInfo[] | FileInfo | null;
  other_documents?: FileInfo[] | FileInfo | null;
  [key: string]: any;
}
const NOMINATION_FILES_BUCKET = 'nomination-files'; // Make sure this is consistent

interface SectionCDisplayProps {
  data: SectionCData | null | undefined;
  notes?: string | null;
}

const renderFiles = (filesInput: FileInfo[] | FileInfo | null | undefined, label: string) => {
  if (!filesInput) return <DetailItemDisplay label={label} value="No files provided." fullWidth/>;
  
  const filesArray = Array.isArray(filesInput) ? filesInput : [filesInput];
  const validFiles: FileInfo[] = filesArray.filter(
      (file: any): file is FileInfo => file && typeof file === 'object' && 
                     (('file_name' in file && 'storage_path' in file) || ('name' in file && 'url' in file))
  );

  if (validFiles.length === 0) return <DetailItemDisplay label={label} value="No valid files." fullWidth/>;

  return (
    <DetailItemDisplay
      label={label}
      fullWidth
      value={
        <ul className="space-y-2">
          {validFiles.map((fileData, index) => {
            let publicUrl = '#';
            let fileName = fileData.file_name || fileData.name || 'Download/View File';
            let FileIcon = FileText; // Default icon
            if (fileName.match(/\.(jpeg|jpg|gif|png)$/i)) FileIcon = FileImage;
            // Add more icon logic for PDF, DOCX etc.

            if (fileData.storage_path) {
              const { data: publicUrlData } = supabase.storage
                .from(NOMINATION_FILES_BUCKET)
                .getPublicUrl(fileData.storage_path); // Removed download attribute for direct link first
              publicUrl = publicUrlData?.publicUrl ?? '#';
            } else if (fileData.url) {
              publicUrl = fileData.url;
            }

            return (
              <li key={index} className="flex items-center justify-between p-2 border rounded-md dark:border-gray-700">
                <div className="flex items-center">
                  <FileIcon size={20} className="mr-3 text-tpahla-emerald dark:text-tpahla-gold" />
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    {fileName}
                  </a>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer" download={fileName}> {/* Add download attribute here */}
                    <Download size={16} className="mr-2" /> Download/View
                  </a>
                </Button>
              </li>
            );
          })}
        </ul>
      }
    />
  );
};


const SectionCDisplay: React.FC<SectionCDisplayProps> = ({ data, notes }) => {
  if (!data) return <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">No justification information provided.</p>;

  // Mapping based on your desired output for Section C
  // The fields justification_statement, achievements_and_impact etc. seem to come from the modal's interpretation
  // The validator has 'justification'. We should clarify the source of truth for Section C fields.
  // For now, using fields that seem to be present in the modal's `SectionCData` type.
  
  return (
    <>
      <DetailItemDisplay label="Justification Statement" value={data.justification_statement || data.justification} fullWidth />
      <DetailItemDisplay label="Achievements and Impact" value={data.achievements_and_impact} fullWidth />
      <DetailItemDisplay label="Leadership and Innovation" value={data.leadership_and_innovation} fullWidth />
      <DetailItemDisplay label="Sustainability and Scalability" value={data.sustainability_and_scalability} fullWidth />
      <DetailItemDisplay label="Notable Recognitions/Awards" value={data.notable_recognitions} fullWidth />

      {data.media_links && data.media_links.length > 0 && (
        <DetailItemDisplay
          label="Supporting Media Links"
          fullWidth
          value={
            <ul className="space-y-1">
              {data.media_links.filter(link => link.value && link.value.trim() !== '').map((link, index) => (
                <li key={index} className="flex items-center">
                  <ExternalLink size={16} className="mr-2 text-gray-500" />
                  <a href={link.value.startsWith('http') ? link.value : `https://${link.value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          }
        />
      )}

      {renderFiles(data.cv_resume, "CV/Resume")}
      {renderFiles(data.photos_media, "Photos/Media")}
      {renderFiles(data.other_documents, "Other Supporting Documents")}

      {notes && <DetailItemDisplay label="Internal Notes (Section C)" value={notes} fullWidth />}
    </>
  );
};

export default SectionCDisplay;
