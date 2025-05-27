
import React from 'react';
import DataPair from './DataPair';
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

interface NominationGeneralDetailsProps {
  nomination: NominationRow;
}

const NominationGeneralDetails: React.FC<NominationGeneralDetailsProps> = ({ nomination }) => {
  const submissionDate = nomination.submitted_at || nomination.created_at;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:grid-cols-2">
      <DataPair label="Nominee Name" value={nomination.nominee_name} />
      <DataPair 
        label="Status" 
        value={nomination.status} 
        isBadge 
        badgeVariant={
          nomination.status === "approved" ? "success" : 
          nomination.status === "rejected" ? "destructive" :
          nomination.status === "submitted" ? "default" : 
          "outline"
        }
      />
      <DataPair label="Award Category ID" value={nomination.award_category_id} />
      <DataPair label="Submitted At" value={submissionDate ? format(new Date(submissionDate), 'PPpp') : 'N/A'} />
      <DataPair label="Nominator Email" value={nomination.nominator_email} />
      <DataPair label="Nominator Name" value={nomination.nominator_name} />
    </div>
  );
};

export default NominationGeneralDetails;
