
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; // Removed useMutation, useQueryClient
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
import { Eye, Loader2, AlertCircle, Inbox, Users as PageIcon } from "lucide-react"; // Removed CheckCircle, XCircle
// Removed toast import as it's not used after removing mutation
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NominationDetailsModal from '@/components/admin/NominationDetailsModal';

type NominationRow = Database['public']['Tables']['nominations']['Row'];
// Removed NominationStatusEnum as it's not used for status updates here anymore

type FormSectionAData = {
  nominee_email?: string;
};

const fetchApprovedNominations = async (): Promise<NominationRow[]> => {
  const { data, error } = await supabase
    .from('nominations')
    .select('*')
    .eq('status', 'approved') // Filter for approved nominations
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved nominations:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const NomineesPage = () => {
  // Removed queryClient as it's not used after removing mutation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNomination, setSelectedNomination] = useState<NominationRow | null>(null);

  const { data: nominations, isLoading, error } = useQuery<NominationRow[], Error>({
    queryKey: ['approvedNominations'], // Updated queryKey
    queryFn: fetchApprovedNominations,
  });

  // Removed updateStatusMutation and handleUpdateStatus as actions are removed

  const handleViewDetails = (nomination: NominationRow) => {
    setSelectedNomination(nomination);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading approved nominations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Approved Nominations</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!nominations || nominations.length === 0) {
    return (
      <div className="text-center py-10">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No approved nominations found.</p>
        <p className="text-sm text-muted-foreground">Nominations with 'approved' status will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center"><PageIcon className="mr-2 h-8 w-8 text-green-600" />Approved Nominations</h1> {/* Updated title */}
        {/* Filter and Bulk Actions buttons can be implemented later if needed for this specific view */}
      </div>
      
      <p className="text-muted-foreground">
        Review all nominations that have been marked as 'approved'.
      </p>
      
      <Table>
        <TableCaption>List of approved nominations</TableCaption> {/* Updated caption */}
        <TableHeader>
          <TableRow>
            {/* Removed checkbox column as bulk actions are not implemented yet and may not apply here */}
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
                {/* Removed checkbox cell */}
                <TableCell className="font-medium">{nomination.nominee_name || 'N/A'}</TableCell>
                <TableCell>{nomineeEmail}</TableCell>
                <TableCell>{nomination.award_category_id || 'N/A'}</TableCell>
                <TableCell>{submissionDate ? format(new Date(submissionDate), 'PPpp') : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="success"> {/* Status will always be 'approved' here */}
                    {nomination.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleViewDetails(nomination)}>
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                    {/* Approve/Reject buttons removed as this page only shows approved nominations */}
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

export default NomineesPage;
