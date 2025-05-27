
import React from 'react';
import DataPair from './DataPair';
import SectionRenderer from './SectionRenderer';
import { NominationStepCData } from '@/lib/validators/nominationValidators';
import { formatFileSize } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { File as FileIcon, Download } from 'lucide-react';

interface NominationSectionCProps {
  sectionC: NominationStepCData | null;
  summaryOfAchievement?: string | null;
  formSectionCNotes?: string | null;
}

const NominationSectionC: React.FC<NominationSectionCProps> = ({ sectionC, summaryOfAchievement, formSectionCNotes }) => {
  if (!sectionC) return null;

  return (
    <>
      <SectionRenderer title="Section C: Achievements and Justification">
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
        {sectionC.file_uploads && sectionC.file_uploads.length > 0 && (
          <div className="mt-4">
            <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">Supporting Documents:</span>
            <ul className="list-none pl-0 mt-1 space-y-2">
              {sectionC.file_uploads.map((file, index) => (
                file.file_name && file.file_url && (
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
                )
              ))}
            </ul>
          </div>
        )}
      </SectionRenderer>
      <DataPair label="Summary of Achievement (from Nomination)" value={summaryOfAchievement ? <p className="whitespace-pre-wrap text-sm">{summaryOfAchievement}</p> : 'N/A'} />
      <DataPair label="Section C Notes (from Nomination)" value={formSectionCNotes ? <p className="whitespace-pre-wrap text-sm">{formSectionCNotes}</p> : 'N/A'} />
    </>
  );
};

export default NominationSectionC;
