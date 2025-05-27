
import React from 'react';
import ModalDetailItem from '../ModalDetailItem';
import { getCategoryTitleById, getAwardNameByValue } from '@/lib/awardCategories';
import { SectionBData } from '../../NominationDetailsModal'; // Importing from the original modal

interface SectionBContentRendererProps {
  data: SectionBData | null;
}

const SectionBContentRenderer: React.FC<SectionBContentRendererProps> = ({ data }) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No data provided for this section.</p>;
  }

  return (
    <div className="space-y-3 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <ModalDetailItem label="Award Category" value={data.award_category ? getCategoryTitleById(data.award_category) : 'N/A'} />
        <ModalDetailItem label="Specific Award" value={(data.award_category && data.specific_award) ? getAwardNameByValue(data.award_category, data.specific_award) : (data.specific_award || 'N/A')} />
        {/* Render other fields from Section B if any, using a loop or explicitly */}
        {Object.entries(data)
          .filter(([key]) => !['award_category', 'specific_award'].includes(key))
          .map(([key, value]) => {
            const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return <ModalDetailItem key={key} label={formattedKey} value={String(value ?? 'N/A')} />;
        })}
      </div>
    </div>
  );
};

export default SectionBContentRenderer;
