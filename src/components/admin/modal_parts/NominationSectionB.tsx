
import React from 'react';
import DataPair from './DataPair';
import SectionRenderer from './SectionRenderer';
import { NominationStepBData } from '@/lib/validators/nominationValidators';

interface NominationSectionBProps {
  sectionB: NominationStepBData | null;
}

const NominationSectionB: React.FC<NominationSectionBProps> = ({ sectionB }) => {
  if (!sectionB) return null;

  return (
    <SectionRenderer title="Section B: Award Category">
      <DataPair label="Award Category" value={sectionB.award_category} />
      <DataPair label="Specific Award" value={sectionB.specific_award} />
    </SectionRenderer>
  );
};

export default NominationSectionB;
