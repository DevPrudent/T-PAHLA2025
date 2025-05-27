
import React from 'react';
import DataPair from './DataPair';
import SectionRenderer from './SectionRenderer';
import { NominationStepDData } from '@/lib/validators/nominationValidators';

interface NominationSectionDProps {
  sectionD: NominationStepDData | null;
}

const NominationSectionD: React.FC<NominationSectionDProps> = ({ sectionD }) => {
  if (!sectionD) return null;

  return (
    <SectionRenderer title="Section D: Nominator Information">
      <DataPair label="Nominator Full Name" value={sectionD.nominator_full_name} />
      <DataPair label="Relationship to Nominee" value={sectionD.nominator_relationship_to_nominee} />
      <DataPair label="Nominator Organization" value={sectionD.nominator_organization} />
      <DataPair label="Nominator Email" value={sectionD.nominator_email} />
      <DataPair label="Nominator Phone" value={sectionD.nominator_phone} />
      <DataPair label="Reason for Nomination" value={<p className="whitespace-pre-wrap text-sm">{sectionD.nominator_reason}</p>} />
    </SectionRenderer>
  );
};

export default NominationSectionD;
