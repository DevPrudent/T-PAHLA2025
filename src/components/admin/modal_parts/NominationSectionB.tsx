
import React from 'react';
import DataPair from './DataPair';
import SectionRenderer from './SectionRenderer';
import { NominationStepBData } from '@/lib/validators/nominationValidators';
import { getCategoryTitleById, getAwardNameByValue } from '@/lib/awardCategories';

interface NominationSectionBProps {
  sectionB: NominationStepBData | null;
}

const NominationSectionB: React.FC<NominationSectionBProps> = ({ sectionB }) => {
  if (!sectionB) return null;

  const categoryTitle = sectionB.award_category ? getCategoryTitleById(sectionB.award_category) : null;
  const awardName = sectionB.award_category && sectionB.specific_award ? 
    getAwardNameByValue(sectionB.award_category, sectionB.specific_award) : null;
  return (
    <SectionRenderer title="Section B: Award Category">
      <DataPair label="Award Category ID" value={sectionB.award_category} />
      <DataPair label="Award Category Title" value={categoryTitle || 'Unknown Category'} />
      <DataPair label="Specific Award ID" value={sectionB.specific_award} />
      <DataPair label="Specific Award Name" value={awardName || 'Unknown Award'} />
    </SectionRenderer>
  );
};

export default NominationSectionB;
