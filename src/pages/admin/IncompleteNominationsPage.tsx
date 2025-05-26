import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, Loader2, AlertCircle, Inbox, FileClock as PageIcon, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NominationDetailsModal from '@/components/admin/NominationDetailsModal';
import { Link } from 'react-router-dom';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

type FormSectionAData = {
  nominee_email?: string;
};

const ITEMS_PER_PAGE = 10;

interface FetchNominationsResult {
  data: NominationRow[];
  count: number | null;
}

const fetchIncompleteNominations = async (page: number): Promise<FetchNominationsResult> => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = page * ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from('nominations')
    .select('*', { count: 'exact' })
    .or(`form_section_a.is.null,form_section_a.eq.{},form_section_b.is.null,form_section_b.eq.{},form_section_c.is.null,form_section_c.eq.{},form_section_d.is.null,form_section_d.eq.{},form_section_e.is.null,form_section_e.eq.{}`)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching incomplete nominations:', error);
    throw new Error(error.message);
  }
  return { data: data || [], count };
};

const IncompleteNominationsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNomination, setSelectedNomination] = useState<NominationRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paginatedData, isLoading, error } = useQuery<FetchNominationsResult, Error>({
    queryKey: ['incompleteNominations', currentPage, ITEMS_PER_PAGE], 
    queryFn: () => fetchIncompleteNominations(currentPage),
    placeholderData: keepPreviousData,
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
      queryClient.invalidateQueries({ queryKey: ['incompleteNominations'] });
      queryClient.invalidateQueries({ queryKey: ['approvedNominations'] }); 
      queryClient.invalidateQueries({ queryKey: ['submittedNominations'] }); 
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

  if (isLoading && paginatedData === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading incomplete nominations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Incomplete Nominations</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="text-center py-10">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No incomplete nominations found.</p>
        <p className="text-sm text-muted-foreground">Nominations with any missing sections (A-E) will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold flex items-center"><PageIcon className="mr-2 h-8 w-8 text-orange-500" />Incomplete Nominations</h1>
      </div>
      
      <p className="text-muted-foreground">
        Review nominations that have one or more sections (A-E) incomplete. Displaying {nominations.length} of {totalCount} nominations.
      </p>
      
      <Table>
        <TableCaption>List of incomplete nominations. Page {currentPage} of {totalPages}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Nomination ID</TableHead>
            <TableHead>Nominee Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Category ID</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nominations.map((nomination) => {
            const sectionAData = nomination.form_section_a as FormSectionAData | null;
            const nomineeEmail = sectionAData?.nominee_email || 'N/A';
            const creationDate = nomination.created_at;
            const isEditable = nomination.status === 'incomplete' || nomination.status === 'draft';

            return (
              <TableRow key={nomination.id}>
                <TableCell className="font-mono text-xs truncate max-w-[150px]">{nomination.id}</TableCell>
                <TableCell className="font-medium">{nomination.nominee_name || 'N/A'}</TableCell>
                <TableCell>{nomineeEmail}</TableCell>
                <TableCell>{nomination.award_category_id || 'N/A'}</TableCell>
                <TableCell>{creationDate ? format(new Date(creationDate), 'PPpp') : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={
                    nomination.status === "approved" ? "success" : 
                    nomination.status === "rejected" ? "destructive" :
                    nomination.status === "submitted" ? "default" :
                    "outline" 
                  }>
                    {nomination.status || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleViewDetails(nomination)} disabled={updateStatusMutation.isPending}>
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                    
                    {isEditable && (
                      <Button asChild size="sm" variant="ghost" disabled={updateStatusMutation.isPending}>
                        <Link to={`/nominate/edit/${nomination.id}`}>
                          <Edit size={16} className="mr-1" /> Edit
                        </Link>
                      </Button>
                    )}

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
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
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

export default IncompleteNominationsPage;
