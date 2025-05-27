
import React from 'react';
import DataPair from './DataPair';
import SectionRenderer from './SectionRenderer';
import { NominationStepEData } from '@/lib/validators/nominationValidators';
import { format } from 'date-fns';

interface NominationSectionEProps {
  sectionE: NominationStepEData | null;
}

const NominationSectionE: React.FC<NominationSectionEProps> = ({ sectionE }) => {
  if (!sectionE) return null;

  return (
    <SectionRenderer title="Section E: Declaration and Consent">
      <DataPair label="Confirmed Accuracy" value={sectionE.confirm_accuracy ? 'Yes' : 'No'} />
      <DataPair label="Confirmed Nominee Contact" value={sectionE.confirm_nominee_contact ? 'Yes' : 'No'} />
      <DataPair label="Confirmed Data Use" value={sectionE.confirm_data_use ? 'Yes' : 'No'} />
      <DataPair label="Nominator Signature" value={sectionE.nominator_signature} />
      <DataPair label="Date Signed" value={sectionE.date_signed ? format(new Date(sectionE.date_signed), 'PPpp') : 'N/A'} />
    </SectionRenderer>
  );
};

export default NominationSectionE;
