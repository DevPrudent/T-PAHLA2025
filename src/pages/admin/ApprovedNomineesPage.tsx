
import React from 'react';
import { FilteredNominationsTable } from '@/components/admin/FilteredNominationsTable';
import { Database } from '@/integrations/supabase/types';
import { useState } from 'react';

type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

const ApprovedNomineesPage = () => {
  const status: NominationStatusEnum = 'approved';
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <FilteredNominationsTable 
      statusFilter={status} 
      pageTitle="Approved Nominees"
      showActions={true} // Admins can reject an approved nomination
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default ApprovedNomineesPage;

