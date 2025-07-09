
import React from 'react';
import { FilteredNominationsTable } from '@/components/admin/FilteredNominationsTable';
import { Database } from '@/integrations/supabase/types';

type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

const CompletedNominationsPage = () => {
  const status: NominationStatusEnum = 'submitted';
  return (
    <FilteredNominationsTable 
      statusFilter={status} 
      pageTitle="Completed Nominations"
      showActions={true} // Admins can approve/reject submitted nominations
    />
  );
};

export default CompletedNominationsPage;

