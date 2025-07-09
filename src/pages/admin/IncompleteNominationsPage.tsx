
import React from 'react';
import { FilteredNominationsTable } from '@/components/admin/FilteredNominationsTable';
import { Database } from '@/integrations/supabase/types';
import { useState } from 'react';

type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

const IncompleteNominationsPage = () => {
  const status: NominationStatusEnum = 'draft'; // Or 'incomplete' if that's a distinct status
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <FilteredNominationsTable 
      statusFilter={status} 
      pageTitle="Incomplete Nominations"
      showActions={true} // Admins might approve/reject drafts or incomplete entries
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default IncompleteNominationsPage;

