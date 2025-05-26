import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // Removed useMutation, useQueryClient
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
import { Eye, Loader2, AlertCircle, Inbox, Users as PageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NominationDetailsModal from '@/components/admin/NominationDetailsModal';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

type FormSectionAData = {
  nominee_email?: string;
};

const ITEMS_PER_PAGE = 10;

interface FetchApprovedNominationsResult {
  data: NominationRow[];
  count: number | null;
}

const fetchApprovedNominations = async (page: number): Promise<FetchApprovedNominationsResult> => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = page * ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from('nominations')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order('submitted_at', { ascending: false, nullsFirst: false }) // Order by submitted_at
    .range(from, to);

  if (error) {
    console.error('Error fetching approved nominations:', error);
    throw new Error(error.message);
  }
  return { data: data || [], count };
};

const NomineesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNomination, setSelectedNomination] = useState<NominationRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paginatedData, isLoading, error } = useQuery<FetchApprovedNominationsResult, Error>({
    queryKey: ['approvedNominations', currentPage, ITEMS_PER_PAGE],
    queryFn: () => fetchApprovedNominations(currentPage),
    placeholderData: keepPreviousData,
  });

  const nominations = paginatedData?.data ?? [];
  const totalCount = paginatedData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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

  if (totalCount === 0) {
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
        <h1 className="text-3xl font-bold flex items-center"><PageIcon className="mr-2 h-8 w-8 text-green-600" />Approved Nominations</h1>
      </div>
      
      <p className="text-muted-foreground">
        Review all nominations that have been marked as 'approved'. Displaying {nominations.length} of {totalCount} nominations.
      </p>
      
      <Table>
        <TableCaption>List of approved nominations. Page {currentPage} of {totalPages}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Nomination ID</TableHead>
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
                <TableCell className="font-mono text-xs truncate max-w-[150px]">{nomination.id}</TableCell>
                <TableCell className="font-medium">{nomination.nominee_name || 'N/A'}</TableCell>
                <TableCell>{nomineeEmail}</TableCell>
                <TableCell>{nomination.award_category_id || 'N/A'}</TableCell>
                <TableCell>{submissionDate ? format(new Date(submissionDate), 'PPpp') : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="success">
                    {nomination.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleViewDetails(nomination)}>
                      <Eye size={16} className="mr-1" /> View
                    </Button>
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

export default NomineesPage;
