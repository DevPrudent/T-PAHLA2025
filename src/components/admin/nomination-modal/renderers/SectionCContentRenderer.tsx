
import React from 'react';
import ModalDetailItem from '../ModalDetailItem';
import FileDisplayRenderer from '../FileDisplayRenderer';
import MediaLinksRenderer from '../MediaLinksRenderer';
import { SectionCData } from '../../NominationDetailsModal'; // Importing from the original modal

interface SectionCContentRendererProps {
  data: SectionCData | null;
}

const SectionCContentRenderer: React.FC<SectionCContentRendererProps> = ({ data }) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400 print:text-black">No data provided for this section.</p>;
  }

  return (
    <div className="space-y-3 p-1 print:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 print:block print:space-y-2"> {/* Simplified grid for print */}
        <ModalDetailItem label="Justification Statement" value={data.justification_statement} fullWidth />
        <ModalDetailItem label="Achievements and Impact" value={data.achievements_and_impact} fullWidth />
        <ModalDetailItem label="Leadership and Innovation" value={data.leadership_and_innovation} fullWidth />
        <ModalDetailItem label="Sustainability and Scalability" value={data.sustainability_and_scalability} fullWidth />
        
        {/* Files */}
        <FileDisplayRenderer files={data.cv_resume} label="CV/Resume" />
        <FileDisplayRenderer files={data.photos_media} label="Photos/Media" />
        <FileDisplayRenderer files={data.other_documents} label="Other Supporting Documents" />

        {/* Media Links */}
        <MediaLinksRenderer links={data.media_links} label="Media Links" />

        {/* Render other fields from Section C if any, using a loop or explicitly, excluding already handled ones */}
        {Object.entries(data)
          .filter(([key]) => ![
            'justification_statement', 'achievements_and_impact', 'leadership_and_innovation', 
            'sustainability_and_scalability', 'cv_resume', 'photos_media', 'other_documents', 'media_links'
          ].includes(key))
          .map(([key, value]) => {
            const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return <ModalDetailItem key={key} label={formattedKey} value={String(value ?? 'N/A')} fullWidth />;
        })}
      </div>
    </div>
  );
};

export default SectionCContentRenderer;
