
import React from 'react';
import DataPair from './DataPair';
import SectionRenderer from './SectionRenderer';
import { NominationStepAData } from '@/lib/validators/nominationValidators';
import { format } from 'date-fns';

interface NominationSectionAProps {
  sectionA: NominationStepAData | null;
}

const NominationSectionA: React.FC<NominationSectionAProps> = ({ sectionA }) => {
  if (!sectionA) return null;

  return (
    <SectionRenderer title="Section A: Nominee Information">
      <DataPair label="Full Name" value={sectionA.nominee_full_name} />
      <DataPair label="Gender" value={sectionA.nominee_gender} />
      <DataPair label="Date of Birth" value={sectionA.nominee_dob ? format(new Date(sectionA.nominee_dob), 'PPP') : 'N/A'} />
      <DataPair label="Nationality" value={sectionA.nominee_nationality} />
      <DataPair label="Country of Residence" value={sectionA.nominee_country_of_residence} />
      <DataPair label="Organization" value={sectionA.nominee_organization} />
      <DataPair label="Title/Position" value={sectionA.nominee_title_position} />
      <DataPair label="Email" value={sectionA.nominee_email} />
      <DataPair label="Phone" value={sectionA.nominee_phone} />
      <DataPair label="Social Media" value={sectionA.nominee_social_media ? <a href={sectionA.nominee_social_media} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{sectionA.nominee_social_media}</a> : 'N/A'} />
    </SectionRenderer>
  );
};

export default NominationSectionA;
