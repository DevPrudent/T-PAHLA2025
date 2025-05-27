
import React from 'react';
import DetailItemDisplay from '@/components/admin/DetailItemDisplay';
import { Mail, Phone } from 'lucide-react';

// Assuming SectionDData structure
interface SectionDData {
  nominator_full_name?: string;
  nominator_relationship_to_nominee?: string;
  nominator_organization?: string;
  nominator_email?: string;
  nominator_phone?: string;
  nominator_reason?: string; // Or 'brief_reason' as per prompt
  [key: string]: any;
}

interface SectionDDisplayProps {
  data: SectionDData | null | undefined;
}

const SectionDDisplay: React.FC<SectionDDisplayProps> = ({ data }) => {
  if (!data) return <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">No nominator information provided.</p>;

  return (
    <>
      <DetailItemDisplay label="Full Name" value={data.nominator_full_name} />
      <DetailItemDisplay label="Relationship to Nominee" value={data.nominator_relationship_to_nominee} />
      <DetailItemDisplay label="Organization" value={data.nominator_organization} />
      <DetailItemDisplay 
        label="Email Address" 
        value={data.nominator_email ? (
          <span className="flex items-center">
            <Mail size={16} className="mr-2 text-gray-500" />
            <a href={`mailto:${data.nominator_email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.nominator_email}
            </a>
          </span>
        ) : 'N/A'}
      />
      <DetailItemDisplay 
        label="Phone Number" 
        value={data.nominator_phone ? (
          <span className="flex items-center">
            <Phone size={16} className="mr-2 text-gray-500" />
            {data.nominator_phone}
          </span>
        ) : 'N/A'}
      />
      <DetailItemDisplay label="Reason for Nomination" value={data.nominator_reason} fullWidth />
    </>
  );
};

export default SectionDDisplay;
