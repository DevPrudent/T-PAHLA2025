import React from 'react';
import { FilteredNominationsTable } from '@/components/admin/FilteredNominationsTable';
import { Database } from '@/integrations/supabase/types';
import { useState } from 'react';

type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

const RejectedNomineesPage = () => {
  const status: NominationStatusEnum = 'rejected';
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <FilteredNominationsTable 
      statusFilter={status} 
      pageTitle="Rejected Nominees"
      showActions={true} // Admins can approve a rejected nomination
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default RejectedNomineesPage;