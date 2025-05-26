import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Inbox, FileCheck2 as PageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NominationDetailsModal from '@/components/admin/NominationDetailsModal';
import NominationTableRow from '@/components/admin/NominationTableRow';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

const ITEMS_PER_PAGE = 10;

interface FetchNominationsResult {
  data: NominationRow[];
  count: number | null;
}

const fetchNominations = async (page: number): Promise<FetchNominationsResult> => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = page * ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from('nominations')
    .select('*', { count: 'exact' })
    .eq('status', 'submitted')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching submitted nominations:', error);
    throw new Error(error.message);
  }
  return { data: data || [], count };
};

const CompletedNominationsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNomination, setSelectedNomination] = useState<NominationRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paginatedData, isLoading, error } = useQuery<FetchNominationsResult, Error>({
    queryKey: ['submittedNominations', currentPage, ITEMS_PER_PAGE], 
    queryFn: () => fetchNominations(currentPage),
    placeholderData: keepPreviousData, // Updated from keepPreviousData: true
  });

  const nominations = paginatedData?.data ?? [];
  const totalCount = paginatedData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
      queryClient.invalidateQueries({ queryKey: ['submittedNominations'] });
      queryClient.invalidateQueries({ queryKey: ['approvedNominations'] });
      queryClient.invalidateQueries({ queryKey: ['nominations'] }); // General invalidation
      // Also invalidate specific page if a more granular approach is desired for other lists
      // queryClient.invalidateQueries({ queryKey: ['submittedNominations', currentPage, ITEMS_PER_PAGE] }); 
      toast.success(`Nomination ${updatedNomination ? updatedNomination.nominee_name : ''} status updated to ${updatedNomination?.status}!`);
    },
    onError: (err) => {
      toast.error(`Failed to update status: ${err.message}`);
    },
  });

  const handleUpdateStatus = (nominationId: string, status: NominationStatusEnum) => {
    updateStatusMutation.mutate({ nominationId, status });
  };

  const handleViewDetails = (nomination: NominationRow) => {
    setSelectedNomination(nomination);
    setIsModalOpen(true);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading && !paginatedData?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading submitted nominations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Submitted Nominations</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="text-center py-10">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No Submitted Nominations Found</p>
        <p className="text-sm text-muted-foreground">Nominations with 'submitted' status will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center"><PageIcon className="mr-2 h-8 w-8 text-green-600" />Completed Nominations</h1>
      </div>
      
      <p className="text-muted-foreground">
        Review nominations that have the 'submitted' status and are awaiting approval or rejection. Displaying {nominations.length} of {totalCount} nominations.
      </p>
      
      <Table>
        <TableCaption>List of nominations with 'submitted' status. Page {currentPage} of {totalPages}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nomination ID</TableHead>
            <TableHead>Nominee Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Category ID</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nominations.map((nomination) => (
            <NominationTableRow
              key={nomination.id}
              nomination={nomination}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
              isProcessingAction={(action: 'approve' | 'reject') => {
                const targetStatusMap = {
                  approve: 'approved' as NominationStatusEnum,
                  reject: 'rejected' as NominationStatusEnum,
                };
                const targetStatus = targetStatusMap[action];
                return (
                  updateStatusMutation.isPending &&
                  updateStatusMutation.variables?.nominationId === nomination.id &&
                  updateStatusMutation.variables?.status === targetStatus
                );
              }}
              isAnyActionProcessing={
                updateStatusMutation.isPending &&
                updateStatusMutation.variables?.nominationId === nomination.id
              }
            />
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      <NominationDetailsModal
        nomination={selectedNomination}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CompletedNominationsPage;
