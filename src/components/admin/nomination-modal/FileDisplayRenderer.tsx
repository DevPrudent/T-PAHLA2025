
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Download } from 'lucide-react';
import ModalDetailItem from '../ModalDetailItem';
import { FileInfo, NOMINATION_FILES_BUCKET } from '../../NominationDetailsModal'; // Importing from the original modal for now

interface FileDisplayRendererProps {
  files: FileInfo[] | FileInfo | null | undefined;
  label: string;
}

const FileDisplayRenderer: React.FC<FileDisplayRendererProps> = ({ files, label }) => {
  const fileArrayInput = files ? (Array.isArray(files) ? files : [files]) : [];
  const validFiles: FileInfo[] = fileArrayInput.filter(
      (file: any): file is FileInfo => file && typeof file === 'object' && 
                        (('file_name' in file && 'storage_path' in file) || ('name' in file && 'url' in file))
  );

  if (validFiles.length === 0) {
    return <ModalDetailItem label={label} value="No files or invalid file data." fullWidth />;
  }

  return (
    <ModalDetailItem
      label={label}
      fullWidth
      value={
        <ul className="list-disc list-inside pl-1">
          {validFiles.map((fileData, index: number) => {
            let publicUrl = '#';
            let fileName = 'Download/View File';

            if (fileData.storage_path && fileData.file_name) {
              fileName = fileData.file_name;
              // Force download by setting { download: true }
              const { data: publicUrlData } = supabase.storage
                .from(NOMINATION_FILES_BUCKET)
                .getPublicUrl(fileData.storage_path, { download: true }); // Changed to force download
              publicUrl = publicUrlData?.publicUrl ?? '#';
            } else if (fileData.url && fileData.name) {
                fileName = fileData.name;
                publicUrl = fileData.url;
            }

            return (
              <li key={index} className="text-sm flex items-center">
                <a 
                  href={publicUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download={fileName.includes('.') ? fileName : undefined} 
                  className="text-blue-600 dark:text-blue-400 hover:underline print:text-black print:no-underline"
                >
                  {fileName}
                </a>
                <a 
                  href={publicUrl} 
                  download={fileName.includes('.') ? fileName : undefined} 
                  target="_blank" 
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
};

export default FileDisplayRenderer;
