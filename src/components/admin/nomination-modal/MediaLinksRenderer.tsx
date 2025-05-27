
import React from 'react';
import { ExternalLink } from 'lucide-react';
import ModalDetailItem from './ModalDetailItem';
import { MediaLink } from '../NominationDetailsModal'; // Importing from the original modal for now


interface MediaLinksRendererProps {
  links: MediaLink[] | undefined;
  label: string;
}

const MediaLinksRenderer: React.FC<MediaLinksRendererProps> = ({ links, label }) => {
  if (!links || links.length === 0) {
    return <ModalDetailItem label={label} value="N/A" fullWidth />;
  }
  const validLinks = links.filter((link): link is MediaLink => link && typeof link.value === 'string' && link.value.trim() !== '');

  if (validLinks.length === 0) {
    return <ModalDetailItem label={label} value="N/A" fullWidth />;
  }

  return (
    <div className="mb-2 sm:col-span-2 print:mb-1">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 print:text-black">{label}:</p>
      <ul className="list-disc list-inside pl-4">
        {validLinks.map((link, index: number) => (
            <li key={index} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <a href={link.value.startsWith('http') ? link.value : `https://${link.value}`} target="_blank" rel="noopener noreferrer">
                {link.value} <ExternalLink size={12} className="inline ml-1" />
              </a>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default MediaLinksRenderer;
