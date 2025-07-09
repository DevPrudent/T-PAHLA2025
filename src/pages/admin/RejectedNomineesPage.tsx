import React from 'react';
import { FilteredNominationsTable } from '@/components/admin/FilteredNominationsTable';
import { Database } from '@/integrations/supabase/types';

type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

const RejectedNomineesPage = () => {
  const status: NominationStatusEnum = 'rejected';
  return (
    <FilteredNominationsTable 
      statusFilter={status} 
      pageTitle="Rejected Nominees"
      showActions={true} // Admins can approve a rejected nomination
    />
  );
};

export default RejectedNomineesPage;