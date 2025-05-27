
import React from 'react';
import ModalDetailItem from '../ModalDetailItem';
import { SectionDData } from '../../NominationDetailsModal'; // Importing from the original modal

interface SectionDContentRendererProps {
  data: SectionDData | null;
}

const SectionDContentRenderer: React.FC<SectionDContentRendererProps> = ({ data }) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No data provided for this section.</p>;
  }
  
  return (
    <div className="space-y-3 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <ModalDetailItem label="Nominator Full Name" value={data.nominator_full_name} />
        <ModalDetailItem label="Relationship to Nominee" value={data.nominator_relationship_to_nominee} />
        <ModalDetailItem label="Nominator Organization" value={data.nominator_organization} />
        <ModalDetailItem label="Nominator Email" value={data.nominator_email} isLink={!!data.nominator_email && data.nominator_email.includes('@')} />
        <ModalDetailItem label="Nominator Phone" value={data.nominator_phone} />
        <ModalDetailItem label="Reason for Nomination" value={data.nominator_reason} fullWidth />
        
        {/* Render other fields from Section D if any */}
        {Object.entries(data)
          .filter(([key]) => ![
            'nominator_full_name', 'nominator_relationship_to_nominee', 'nominator_organization',
            'nominator_email', 'nominator_phone', 'nominator_reason'
          ].includes(key))
          .map(([key, value]) => {
            const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return <ModalDetailItem key={key} label={formattedKey} value={String(value ?? 'N/A')} />;
        })}
      </div>
    </div>
  );
};

export default SectionDContentRenderer;
