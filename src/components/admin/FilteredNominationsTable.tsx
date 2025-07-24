import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2, 
  AlertCircle, 
  Inbox,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { NominationDetailsModal } from '@/components/admin/NominationDetailsModal';
import PaginatedTable from '@/components/admin/PaginatedTable';
import { getCategoryTitleById } from '@/lib/awardCategories';
import { supabase } from '@/integrations/supabase/client';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

interface FilteredNominationsTableProps {
  statusFilter: NominationStatusEnum;
  pageTitle: string;
  showActions?: boolean; // To control if Approve/Reject actions are shown
}

const fetchNominationsByStatus = async (status: NominationStatusEnum, date?: Date): Promise<NominationRow[]> => {
  let query = supabase
    .from('nominations')
    .select('*')
    .eq('status', status)
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
    console.error(`Error fetching ${status} nominations:`, error);
    throw new Error(error.message);
  }
  return data || [];
};

export const FilteredNominationsTable: React.FC<FilteredNominationsTableProps> = ({ statusFilter, pageTitle, showActions = false }) => {
  const queryClient = useQueryClient();
  const [selectedNomination, setSelectedNomination] = useState<NominationRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  const { data: nominations, isLoading, error, refetch } = useQuery<NominationRow[], Error>({
    queryKey: ['nominations', statusFilter, selectedDate?.toISOString().split('T')[0]],
    queryFn: () => fetchNominationsByStatus(statusFilter, selectedDate),
  });

  // Refetch when date changes
  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  // Filter nominations based on search term
  const filteredNominations = useMemo(() => {
    if (!nominations) return [];
    if (!searchTerm) return nominations;
    
    const searchLower = searchTerm.toLowerCase();
    return nominations.filter(nomination => 
      nomination.id.toLowerCase().includes(searchLower) ||
      nomination.nominee_name.toLowerCase().includes(searchLower) ||
      (nomination.form_section_a as any)?.nominee_email?.toLowerCase().includes(searchLower) ||
      nomination.award_category_id?.toLowerCase().includes(searchLower)
    );
  }, [nominations, searchTerm]);

  const updateStatusMutation = useMutation<
    NominationRow | null,
    Error,
    { nominationId: string; status: NominationStatusEnum }
  >({
    mutationFn: async ({ nominationId, status }) => {
      const { data, error: updateError } = await supabase
        .from('nominations')
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', nominationId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating nomination status:', updateError);
        throw updateError;
      }
      return data;
    },
    onSuccess: (updatedNomination) => {
      queryClient.invalidateQueries({ queryKey: ['nominations'] }); // Invalidate all nomination queries
      toast.success(`Nomination ${updatedNomination ? updatedNomination.nominee_name : ''} status updated to ${updatedNomination?.status}!`);
    },
    onError: (err) => {
      toast.error(`Failed to update status: ${err.message}`);
    },
  });

  const sendNominationReminders = async (sendToAll = false, specificNominationId = null) => {
    setIsSendingReminders(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-nomination-reminder', {
        body: {
          nominationId: specificNominationId,
          sendToAll: sendToAll,
          siteUrl: window.location.origin
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success(`Nomination reminders sent: ${data.successCount} successful, ${data.failureCount} failed`);
    } catch (error) {
      console.error('Error sending nomination reminders:', error);
      toast.error(`Failed to send nomination reminders: ${error.message}`);
    } finally {
      setIsSendingReminders(false);
    }
  };

  const handleUpdateStatus = (nominationId: string, newStatus: NominationStatusEnum) => {
    updateStatusMutation.mutate({ nominationId, status: newStatus });
  };

  const handleViewDetails = (nomination: NominationRow) => {
    setSelectedNomination(nomination);
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'incomplete', label: 'Incomplete' }
  ];

  const columns = [
    { 
      header: 'Nomination ID', 
      accessor: 'id',
      className: 'font-mono text-xs'
    },
    { 
      header: 'Nominee Name', 
      accessor: 'nominee_name',
      className: 'font-medium'
    },
    { 
      header: 'Email', 
      accessor: (row: NominationRow) => {
        const sectionAData = row.form_section_a as { nominee_email?: string; } | null;
        return sectionAData?.nominee_email || 'N/A';
      }
    },
    { 
      header: 'Category ID', 
      accessor: 'award_category_id'
    },
    { 
      header: 'Category Title', 
      accessor: (row: NominationRow) => {
        return row.award_category_id ? getCategoryTitleById(row.award_category_id) || 'Unknown' : 'N/A';
      }
    },
    { 
      header: 'Date Submitted', 
      accessor: (row: NominationRow) => {
        const submissionDate = row.submitted_at || row.created_at;
        return submissionDate ? format(new Date(submissionDate), 'PPpp') : 'N/A';
      }
    },
    { 
      header: 'Status', 
      accessor: (row: NominationRow) => {
        const statusVariant = 
          row.status === "approved" ? "success" : 
          row.status === "rejected" ? "destructive" :
          row.status === "submitted" ? "default" : 
          "outline";
        
        return (
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold 
            ${statusVariant === 'success' ? 'border-transparent bg-green-100 text-green-800' : 
              statusVariant === 'destructive' ? 'border-transparent bg-red-100 text-red-800' : 
              statusVariant === 'default' ? 'border-transparent bg-blue-100 text-blue-800' : 
              'border-gray-200 bg-gray-100 text-gray-800'}`}>
            {row.status || 'N/A'}
          </span>
        );
      }
    },
  ];

  const renderRowActions = (nomination: NominationRow) => (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="ghost" onClick={() => handleViewDetails(nomination)}>
        <Eye size={16} className="mr-1" />
        View
      </Button>
      {showActions && (nomination.status === "submitted" || nomination.status === "draft" || nomination.status === "incomplete") && (
        <>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-green-600 hover:text-green-700"
            onClick={() => handleUpdateStatus(nomination.id, 'approved')}
            disabled={updateStatusMutation.isPending && updateStatusMutation.variables?.nominationId === nomination.id}
          >
            {updateStatusMutation.isPending && updateStatusMutation.variables?.nominationId === nomination.id && updateStatusMutation.variables?.status === 'approved' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle size={16} className="mr-1" />}
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-600 hover:text-red-700"
            onClick={() => handleUpdateStatus(nomination.id, 'rejected')}
            disabled={updateStatusMutation.isPending && updateStatusMutation.variables?.nominationId === nomination.id}
          >
            {updateStatusMutation.isPending && updateStatusMutation.variables?.nominationId === nomination.id && updateStatusMutation.variables?.status === 'rejected' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <XCircle size={16} className="mr-1" />}
            Reject
          </Button>
        </>
      )}
      {showActions && (nomination.status === "approved") && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-red-600 hover:text-red-700"
          onClick={() => handleUpdateStatus(nomination.id, 'rejected')}
          disabled={updateStatusMutation.isPending && updateStatusMutation.variables?.nominationId === nomination.id}
        >
          {updateStatusMutation.isPending && updateStatusMutation.variables?.nominationId === nomination.id && updateStatusMutation.variables?.status === 'rejected' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <XCircle size={16} className="mr-1" />}
          Reject
        </Button>
      )}
      {showActions && (nomination.status === "rejected") && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-green-600 hover:text-green-700"
          onClick={() => handleUpdateStatus(nomination.id, 'approved')}
          disabled={updateStatusMutation.isPending && updateStatusMutation.variables?.nominationId === nomination.id}
        >
          {updateStatusMutation.isPending && updateStatusMutation.variables?.nominationId === nomination.id && updateStatusMutation.variables?.status === 'approved' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle size={16} className="mr-1" />}
          Approve
        </Button>
      )}
      {(nomination.status === "draft" || nomination.status === "incomplete") && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-blue-600 hover:text-blue-700"
          onClick={() => sendNominationReminders(false, nomination.id)}
          disabled={isSendingReminders}
        >
          {isSendingReminders ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Mail size={16} className="mr-1" />}
          Send Reminder
        </Button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading {pageTitle.toLowerCase()}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading {pageTitle}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!nominations || nominations.length === 0) {
    return (
      <div className="text-center py-10">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No {pageTitle.toLowerCase()} found.</p>
        {searchTerm && <p className="text-sm text-muted-foreground">Try adjusting your search term.</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
      </div>
      
      <PaginatedTable
        data={filteredNominations}
        columns={columns}
        caption={`List of ${pageTitle.toLowerCase()}. Total: ${filteredNominations.length}`}
        itemsPerPage={10}
        searchPlaceholder="Search by ID, Name, Email..."
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        showDateFilter={true}
        onDateChange={setSelectedDate}
        selectedDate={selectedDate}
        renderRowActions={renderRowActions}
      />
      
      <NominationDetailsModal 
        nomination={selectedNomination}
        isOpen={!!selectedNomination}
        onClose={() => setSelectedNomination(null)}
      />
    </div>
  );
};