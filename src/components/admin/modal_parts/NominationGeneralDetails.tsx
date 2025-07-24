
import React from 'react';
import DataPair from './DataPair';
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { getCategoryTitleById } from '@/lib/awardCategories';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

interface NominationGeneralDetailsProps {
  nomination: NominationRow;
}

const NominationGeneralDetails: React.FC<NominationGeneralDetailsProps> = ({ nomination }) => {
  const submissionDate = nomination.submitted_at || nomination.created_at;
  const categoryTitle = nomination.award_category_id ? getCategoryTitleById(nomination.award_category_id) : null;
  
  // Get nominator info from Section A (preferred) or fallback to top-level fields
  const sectionAData = nomination.form_section_a as { nominator_email?: string; nominator_name?: string; } | null;
  const nominatorEmail = sectionAData?.nominator_email || nomination.nominator_email;
  const nominatorName = sectionAData?.nominator_name || nomination.nominator_name;

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
      <DataPair label="Nominator Name" value={nominatorName} />
      <DataPair label="Nominator Email" value={nominatorEmail} />
      <DataPair label="Award Category ID" value={nomination.award_category_id} />
      <DataPair label="Award Category Title" value={categoryTitle || 'Unknown Category'} />
      <DataPair label="Submitted At" value={submissionDate ? format(new Date(submissionDate), 'PPpp') : 'N/A'} />
    </div>
  );
};

export default NominationGeneralDetails;
