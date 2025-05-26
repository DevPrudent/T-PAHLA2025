
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { CheckCircle, XCircle, Eye, Loader2, AlertCircle, Inbox, FileCheck2 as PageIcon } from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NominationDetailsModal from '@/components/admin/NominationDetailsModal';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

type FormSectionAData = {
  nominee_email?: string;
};

const fetchNominations = async (): Promise<NominationRow[]> => {
  // TODO: Implement filtering for COMPLETED nominations
  // A nomination is complete if form_section_a, b, c, d, e are all non-null and not empty JSON objects.
  // Example pseudo-filter:
  // .filter('form_section_a', 'isnot', null)
  // .filter('form_section_a', 'cs', '{}') // This would need to be "not contains" or similar for empty object
  // .neq('form_section_a', '{}') // Check Supabase docs for correct empty JSON object filtering
  // and similarly for b, c, d, e.
  const { data, error } = await supabase
    .from('nominations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching nominations:', error);
    throw new Error(error.message);
  }
  // For now, returning all, filtering logic to be added.
  // Example client-side filter (move to Supabase query for performance):
  return (data || []).filter(nom => {
    const { form_section_a, form_section_b, form_section_c, form_section_d, form_section_e } = nom;
    const isComplete = 
      form_section_a && typeof form_section_a === 'object' && Object.keys(form_section_a).length > 0 &&
      form_section_b && typeof form_section_b === 'object' && Object.keys(form_section_b).length > 0 &&
      form_section_c && typeof form_section_c === 'object' && Object.keys(form_section_c).length > 0 &&
      form_section_d && typeof form_section_d === 'object' && Object.keys(form_section_d).length > 0 &&
      form_section_e && typeof form_section_e === 'object' && Object.keys(form_section_e).length > 0;
    return isComplete;
  });
};

const CompletedNominationsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNomination, setSelectedNomination] = useState<NominationRow | null>(null);

  const { data: nominations, isLoading, error } = useQuery<NominationRow[], Error>({
    queryKey: ['completedNominations'], // Changed queryKey
    queryFn: fetchNominations,
  });

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
      queryClient.invalidateQueries({ queryKey: ['completedNominations'] });
      queryClient.invalidateQueries({ queryKey: ['nominations'] }); // Invalidate all as well
      queryClient.invalidateQueries({ queryKey: ['incompleteNominations'] });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading completed nominations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Completed Nominations</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!nominations || nominations.length === 0) {
    return (
      <div className="text-center py-10">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No completed nominations found.</p>
        <p className="text-sm text-muted-foreground">Nominations that have all sections A-E filled will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center"><PageIcon className="mr-2 h-8 w-8 text-green-600" />Completed Nominations</h1>
        {/* Filter and Bulk Actions buttons can be added later */}
      </div>
      
      <p className="text-muted-foreground">
        Review nominations that have all sections (A-E) completed.
      </p>
      
      <Table>
        <TableCaption>List of completed nominations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nominee Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Category ID</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nominations.map((nomination) => {
            const sectionAData = nomination.form_section_a as FormSectionAData | null;
            const nomineeEmail = sectionAData?.nominee_email || 'N/A';
            const submissionDate = nomination.submitted_at || nomination.created_at;

            return (
              <TableRow key={nomination.id}>
                <TableCell className="font-medium">{nomination.nominee_name || 'N/A'}</TableCell>
                <TableCell>{nomineeEmail}</TableCell>
                <TableCell>{nomination.award_category_id || 'N/A'}</TableCell>
                <TableCell>{submissionDate ? format(new Date(submissionDate), 'PPpp') : 'N/A'}</TableCell>
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
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <NominationDetailsModal
        nomination={selectedNomination}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CompletedNominationsPage;

