
import React from 'react';
import DataPair from './DataPair';
import SectionRenderer from './SectionRenderer';
import { NominationStepCData } from '@/lib/validators/nominationValidators';
// formatFileSize is removed as file_size is not directly available
import { Button } from "@/components/ui/button";
import { File as FileIcon, Download, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { Database } from '@/integrations/supabase/types';

type NominationDocument = Database['public']['Tables']['nomination_documents']['Row'];

interface NominationSectionCProps {
  sectionC: NominationStepCData | null;
  summaryOfAchievement?: string | null;
  formSectionCNotes?: string | null;
  uploadedDocuments: NominationDocument[];
  isLoadingDocuments: boolean;
  documentsError: Error | null;
}

const NominationSectionC: React.FC<NominationSectionCProps> = ({ 
  sectionC, 
  summaryOfAchievement, 
  formSectionCNotes,
  uploadedDocuments,
  isLoadingDocuments,
  documentsError
}) => {
  // sectionC might still be null if form_section_c itself is null in the DB
  // We can still render file uploads if sectionC is null but uploadedDocuments exist

  const getPublicUrl = (storagePath: string): string => {
    const { data } = supabase.storage.from('nomination_files').getPublicUrl(storagePath);
    return data?.publicUrl || '#';
  };

  return (
    <>
      <SectionRenderer title="Section C: Achievements and Justification">
        {sectionC ? (
          <>
            <DataPair label="Justification" value={<p className="whitespace-pre-wrap text-sm">{sectionC.justification}</p>} />
            <DataPair label="Notable Recognitions" value={<p className="whitespace-pre-wrap text-sm">{sectionC.notable_recognitions}</p>} />
            {sectionC.media_links && sectionC.media_links.length > 0 && (
              <div className="mt-3">
                <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">Media Links:</span>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {sectionC.media_links.map((link, index) => (
                    link.value && (
                      <li key={index} className="text-sm">
                        <a href={link.value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                          {link.value}
                        </a>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No textual content provided for Section C.</p>
        )}
        
        {/* Displaying Uploaded Documents */}
        <div className="mt-4">
          <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">Supporting Documents:</span>
          {isLoadingDocuments && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading documents...
            </div>
          )}
          {documentsError && (
            <div className="flex items-center text-sm text-red-500 dark:text-red-400">
              <AlertCircle className="mr-2 h-4 w-4" /> Error loading documents: {documentsError.message}
            </div>
          )}
          {!isLoadingDocuments && !documentsError && uploadedDocuments.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No supporting documents uploaded.</p>
          )}
          {!isLoadingDocuments && !documentsError && uploadedDocuments.length > 0 && (
            <ul className="list-none pl-0 mt-1 space-y-2">
              {uploadedDocuments.map((doc) => (
                doc.file_name && doc.storage_path && (
                  <li key={doc.id} className="text-sm p-2 border rounded-md bg-gray-50 dark:bg-gray-700 print:border-gray-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileIcon className="mr-2 h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium truncate" title={doc.file_name}>{doc.file_name}</span>
                        {/* File size display removed as it's not available from nomination_documents table */}
                      </div>
                      <a
                        href={getPublicUrl(doc.storage_path)}
                        download={doc.file_name || true}
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
                    <a href={getPublicUrl(doc.storage_path)} target="_blank" rel="noopener noreferrer" className="hidden print:inline-block text-xs text-blue-500 hover:underline break-all mt-1">
                      {getPublicUrl(doc.storage_path)} (Link for print)
                    </a>
                  </li>
                )
              ))}
            </ul>
          )}
        </div>
      </SectionRenderer>
      {/* Summary of Achievement and Notes are independent of sectionC's main content and files */}
      <DataPair label="Summary of Achievement (from Nomination)" value={summaryOfAchievement ? <p className="whitespace-pre-wrap text-sm">{summaryOfAchievement}</p> : 'N/A'} />
      <DataPair label="Section C Notes (from Nomination)" value={formSectionCNotes ? <p className="whitespace-pre-wrap text-sm">{formSectionCNotes}</p> : 'N/A'} />
    </>
  );
};

export default NominationSectionC;
