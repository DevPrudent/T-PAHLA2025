
import React from 'react';
import { FilteredNominationsTable } from '@/components/admin/FilteredNominationsTable';
import { Database } from '@/integrations/supabase/types';

type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

const ApprovedNomineesPage = () => {
  const status: NominationStatusEnum = 'approved';
  return (
    <FilteredNominationsTable 
      statusFilter={status} 
      pageTitle="Approved Nominees"
      showActions={true} // Admins can reject an approved nomination
    />
  );
};

export default ApprovedNomineesPage;

