
import React, { useState, useMemo } from 'react';
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
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Eye, Loader2, AlertCircle, Inbox, Search } from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { NominationDetailsModal } from '@/components/admin/NominationDetailsModal';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

interface FilteredNominationsTableProps {
  statusFilter: NominationStatusEnum;
  pageTitle: string;
  showActions?: boolean; // To control if Approve/Reject actions are shown
}

const fetchNominationsByStatus = async (status: NominationStatusEnum): Promise<NominationRow[]> => {
  const { data, error } = await supabase
    .from('nominations')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

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

  const { data: nominations, isLoading, error } = useQuery<NominationRow[], Error>({
    queryKey: ['nominations', statusFilter],
    queryFn: () => fetchNominationsByStatus(statusFilter),
  });

  const filteredNominations = useMemo(() => {
    if (!nominations) return [];
    if (!searchTerm) return nominations;
    return nominations.filter(nomination => {
      const sectionAData = nomination.form_section_a as { nominee_email?: string; } | null;
      const nomineeEmail = sectionAData?.nominee_email?.toLowerCase() || '';
      
      return (
        nomination.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nomination.nominee_name && nomination.nominee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        nomineeEmail.includes(searchTerm.toLowerCase())
      );
    });
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

  const handleUpdateStatus = (nominationId: string, newStatus: NominationStatusEnum) => {
    updateStatusMutation.mutate({ nominationId, status: newStatus });
  };

  const handleViewDetails = (nomination: NominationRow) => {
    setSelectedNomination(nomination);
  };

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

  if (!filteredNominations || filteredNominations.length === 0) {
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
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by ID, Name, Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full max-w-md mb-4" 
        />
      </div>
      
      <Table>
        <TableCaption>List of {pageTitle.toLowerCase()}.</TableCaption>
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
          {filteredNominations.map((nomination) => {
            const sectionAData = nomination.form_section_a as { nominee_email?: string; } | null; 
            const nomineeEmail = sectionAData?.nominee_email || 'N/A';
            const submissionDate = nomination.submitted_at || nomination.created_at;

            return (
              <TableRow key={nomination.id}>
                <TableCell className="font-mono text-xs">{nomination.id}</TableCell>
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
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <NominationDetailsModal 
        nomination={selectedNomination}
        isOpen={!!selectedNomination}
        onClose={() => setSelectedNomination(null)}
      />
    </div>
  );
};

