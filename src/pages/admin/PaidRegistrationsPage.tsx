import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { 
  Loader2, 
  AlertCircle, 
  Inbox 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import PaginatedTable from '@/components/admin/PaginatedTable';

type RegistrationRow = Database['public']['Tables']['registrations']['Row'];

const fetchPaidRegistrations = async (date?: Date): Promise<RegistrationRow[]> => {
  let query = supabase
    .from('registrations')
    .select('*')
    .eq('registration_status', 'paid')
    .order('created_at', { ascending: false });
  
  // Add date filter if provided
  if (date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    // Filter by date (this assumes created_at is in ISO format)
    query = query.gte('created_at', `${dateStr}T00:00:00`)
                .lt('created_at', `${dateStr}T23:59:59`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching paid registrations:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const PaidRegistrationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: registrations, isLoading, error, refetch } = useQuery<RegistrationRow[], Error>({
    queryKey: ['paidRegistrations', selectedDate?.toISOString().split('T')[0]],
    queryFn: () => fetchPaidRegistrations(selectedDate),
  });

  // Refetch when date changes
  React.useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  // Filter registrations based on search term
  const filteredRegistrations = React.useMemo(() => {
    if (!registrations) return [];
    if (!searchTerm) return registrations;
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = registrations.filter(registration => 
      (registration.id && registration.id.toLowerCase().includes(searchLower)) ||
      (registration.full_name && registration.full_name.toLowerCase().includes(searchLower)) ||
      (registration.email && registration.email.toLowerCase().includes(searchLower)) ||
      (registration.phone && registration.phone.toLowerCase().includes(searchLower))
    );
    return filtered;
  }, [registrations, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex);

  const columns = [
    { 
      header: 'Name', 
      accessor: 'full_name',
      className: 'font-medium'
    },
    { 
      header: 'Email', 
      accessor: 'email'
    },
    { 
      header: 'Type', 
      accessor: (row: RegistrationRow) => (
        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-gray-200 bg-gray-100 text-gray-800">
          {row.participation_type}
        </span>
      )
    },
    { 
      header: 'Amount', 
      accessor: (row: RegistrationRow) => `$${row.total_amount.toLocaleString()}`
    },
    { 
      header: 'Date', 
      accessor: (row: RegistrationRow) => {
        const submissionDate = row.submitted_at || row.created_at;
        return submissionDate ? format(new Date(submissionDate), 'PP') : 'N/A';
      }
    },
  ];

  const renderRowActions = (registration: RegistrationRow) => (
    <Link to={`/admin/registrations?id=${registration.id}`}>
      <Button size="sm" variant="ghost">
        View Details
      </Button>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading paid registrations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Registrations</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <div className="text-center py-10">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No paid registrations found.</p>
        <p className="text-sm text-muted-foreground">No registrations have been marked as paid yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paid Registrations</h1>
      </div>
      
      <p className="text-muted-foreground">
        These registrations have been fully paid. You can view their details.
      </p>
      
      <PaginatedTable
        data={currentRegistrations}
        columns={columns}
        caption="List of paid registrations."
        itemsPerPage={10}
        searchPlaceholder="Search by Name, Email..."
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        showDateFilter={true}
        onDateChange={setSelectedDate}
        selectedDate={selectedDate}
        renderRowActions={renderRowActions}
      />
    </div>
  );
};

export default PaidRegistrationsPage;