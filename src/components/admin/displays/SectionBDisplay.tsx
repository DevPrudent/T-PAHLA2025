
import React from 'react';
import DetailItemDisplay from '@/components/admin/DetailItemDisplay';
import { getCategoryTitleById, getAwardNameByValue } from '@/lib/awardCategories'; // Assuming these utilities exist
import { Badge } from '@/components/ui/badge';

// Assuming SectionBData structure
interface SectionBData {
  award_category?: string; // category ID
  specific_award?: string; // award value/key
  [key: string]: any;
}

interface SectionBDisplayProps {
  data: SectionBData | null | undefined;
}

const SectionBDisplay: React.FC<SectionBDisplayProps> = ({ data }) => {
  if (!data) return <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">No award category information provided.</p>;

  const categoryTitle = data.award_category ? getCategoryTitleById(data.award_category) : 'N/A';
  const awardName = (data.award_category && data.specific_award) 
    ? getAwardNameByValue(data.award_category, data.specific_award) 
    : data.specific_award || 'N/A';

  return (
    <>
      <DetailItemDisplay label="Selected Category" value={categoryTitle} fullWidth />
      <DetailItemDisplay 
        label="Selected Award" 
        value={awardName !== 'N/A' ? <Badge variant="secondary" className="text-base px-3 py-1">{awardName}</Badge> : 'N/A'}
        fullWidth 
      />
    </>
  );
};

export default SectionBDisplay;
