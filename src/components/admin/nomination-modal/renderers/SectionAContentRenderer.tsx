
import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import ModalDetailItem from '../ModalDetailItem';
import { getCountryNameByCode } from '@/lib/africanCountries';
import { SectionAData } from '../../NominationDetailsModal'; // Importing from the original modal

interface SectionAContentRendererProps {
  data: SectionAData | null;
}

const SectionAContentRenderer: React.FC<SectionAContentRendererProps> = ({ data }) => {
  if (!data || typeof data !== 'object') return <p className="text-sm text-gray-500 dark:text-gray-400">No data provided for this section.</p>;
  
  const dob = data.nominee_dob ? parseISO(data.nominee_dob) : null;

  return (
    <div className="space-y-3 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <ModalDetailItem label="Full Name" value={data.nominee_full_name} />
        <ModalDetailItem label="Gender" value={data.nominee_gender ? data.nominee_gender.charAt(0).toUpperCase() + data.nominee_gender.slice(1) : 'N/A'} />
        <ModalDetailItem label="Date of Birth" value={dob && isValid(dob) ? format(dob, 'PPP') : 'N/A'} />
        <ModalDetailItem label="Nationality" value={data.nominee_nationality ? getCountryNameByCode(data.nominee_nationality) : 'N/A'} />
        <ModalDetailItem label="Country of Residence" value={data.nominee_country_of_residence ? getCountryNameByCode(data.nominee_country_of_residence) : 'N/A'} />
        <ModalDetailItem label="Organization/Institution" value={data.nominee_organization} />
        <ModalDetailItem label="Title/Position" value={data.nominee_title_position} />
        <ModalDetailItem label="Email Address" value={data.nominee_email} isLink={!!data.nominee_email && data.nominee_email.includes('@')} />
        <ModalDetailItem label="Phone Number" value={data.nominee_phone} />
        <ModalDetailItem label="Social Media Handles" value={data.nominee_social_media} isLink={!!data.nominee_social_media} fullWidth={true}/>
      </div>
    </div>
  );
};

export default SectionAContentRenderer;
