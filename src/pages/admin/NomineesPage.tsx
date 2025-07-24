import React, { useState } from 'react';
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { NominationDetailsModal } from '@/components/admin/NominationDetailsModal';
import PaginatedTable from '@/components/admin/PaginatedTable';
import { getCategoryTitleById } from '@/lib/awardCategories';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

// Helper type for form_section_a for easier access
type FormSectionAData = {
  nominee_email?: string;
  // Add other fields from section A if needed for display, e.g., nominee_full_name
  // This example focuses on email as per current table structure.
  // The top-level `nominee_name` is used for the name column.
};

const fetchNominations = async (date?: Date): Promise<NominationRow[]> => {
  let query = supabase
    .from('nominations')
    .select('*')
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
    console.error('Error fetching nominations:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const NomineesPage = () => {
  const queryClient = useQueryClient();
  const [selectedNomination, setSelectedNomination] = useState<NominationRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const itemsPerPage = 10;

  const { data: nominations, isLoading, error, refetch } = useQuery<NominationRow[], Error>({
    queryKey: ['nominations', selectedDate?.toISOString().split('T')[0]],
    queryFn: () => fetchNominations(selectedDate),
  });

  // Refetch when date changes
  React.useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  // Filtered nominations based on search term and status (client-side for now)
  const filteredNominations = React.useMemo(() => {
    if (!nominations) return [];
    
    return nominations.filter(nomination => {
      const sectionAData = nomination.form_section_a as { nominee_email?: string; } | null;
      const nomineeEmail = sectionAData?.nominee_email?.toLowerCase() || '';
      
      // Apply search filter
      const matchesSearch = !searchTerm || 
        nomination.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nomination.nominee_name && nomination.nominee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        nomineeEmail.includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const matchesStatus = selectedStatus === 'all' || !selectedStatus || nomination.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [nominations, searchTerm, selectedStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredNominations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNominations = filteredNominations.slice(startIndex, endIndex);

  const updateStatusMutation = useMutation<
    NominationRow | null, // Supabase returns the updated row or null
    Error,
    { nominationId: string; status: NominationStatusEnum }
  >({
    mutationFn: async ({ nominationId, status }) => {
      const { data, error: updateError } = await supabase
        .from('nominations')
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', nominationId)
        .select()
        .single(); // Assuming we want the updated row back

      if (updateError) {
        console.error('Error updating nomination status:', updateError);
        throw updateError;
      }
      return data;
    },
    onSuccess: (updatedNomination) => {
      queryClient.invalidateQueries({ queryKey: ['nominations'] });
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

  const handleUpdateStatus = (nominationId: string, status: NominationStatusEnum) => {
    updateStatusMutation.mutate({ nominationId, status });
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
        <Eye size={16} className="mr-1" /> View
      </Button>
      {(nomination.status === "submitted" || nomination.status === "draft" || nomination.status === "incomplete") && (
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
      {nomination.status === "approved" && (
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
      {nomination.status === "rejected" && (
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
        <p className="ml-2">Loading nominations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Nominations</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!nominations || nominations.length === 0) {
    return (
      <div className="text-center py-10">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No nominations found yet.</p>
        <p className="text-sm text-muted-foreground">Once nominations are submitted, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage All Nominations</h1>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isSendingReminders || !nominations?.some(n => n.status === 'draft' || n.status === 'incomplete')}
              >
                {isSendingReminders ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail size={16} />}
                Send Completion Reminders
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Send Nomination Completion Reminders</AlertDialogTitle>
                <AlertDialogDescription>
                  This will send reminder emails to all nominators with incomplete nominations (draft or incomplete status). 
                  The emails will include a unique link to continue their nomination where they left off.
                  Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => sendNominationReminders(true)}>
                  Send Reminders
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Review and manage all submitted nominations. You can view entries and update status. Specific views for different statuses are available in the sidebar.
      </p>

      <PaginatedTable
        data={filteredNominations}
        columns={columns}
        caption={`List of all submitted nominations (${filteredNominations.length} total). Use sidebar for filtered views.`}
        itemsPerPage={10}
        searchPlaceholder="Search by ID, Name, Email..."
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        showDateFilter={true}
        onDateChange={setSelectedDate}
        selectedDate={selectedDate}
        showStatusFilter={true}
        statusOptions={statusOptions}
        onStatusChange={setSelectedStatus}
        selectedStatus={selectedStatus}
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

export default NomineesPage;