import React, { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
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
import { Eye, Loader2, AlertCircle, Inbox, Users as PageIcon, ChevronLeft, ChevronRight, Search as SearchIcon, SortAsc, SortDesc } from "lucide-react";
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NominationDetailsModal from '@/components/admin/NominationDetailsModal';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

type FormSectionAData = {
  nominee_email?: string;
};

const ITEMS_PER_PAGE = 10;

// Define SortableColumn and SortConfig
type SortableColumn = 'nominee_name' | 'submitted_at' | 'award_category_id';
interface SortConfig {
  key: SortableColumn;
  direction: 'asc' | 'desc';
}

interface FetchApprovedNominationsResult {
  data: NominationRow[];
  count: number | null;
}

// Update fetchApprovedNominations to include sortConfig
const fetchApprovedNominations = async (page: number, searchTerm: string, sortConfig: SortConfig): Promise<FetchApprovedNominationsResult> => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = page * ITEMS_PER_PAGE - 1;

  let query = supabase
    .from('nominations')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order(sortConfig.key, { ascending: sortConfig.direction === 'asc', nullsFirst: false }) // Use sortConfig
    .range(from, to);

  if (searchTerm) {
    query = query.ilike('nominee_name', `%${searchTerm}%`);
  }
  
  const { data, error, count } = await query;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // Add sortConfig state, default to submitted_at desc
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'submitted_at', direction: 'desc' });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); 
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Update useQuery to include sortConfig
  const { data: paginatedData, isLoading, error, isPlaceholderData } = useQuery<FetchApprovedNominationsResult, Error>({
    queryKey: ['approvedNominations', currentPage, ITEMS_PER_PAGE, debouncedSearchTerm, sortConfig.key, sortConfig.direction],
    queryFn: () => fetchApprovedNominations(currentPage, debouncedSearchTerm, sortConfig),
    placeholderData: keepPreviousData,
  });

  const nominations = paginatedData?.data ?? [];
  const totalCount = paginatedData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleViewDetails = (nomination: NominationRow) => {
    setSelectedNomination(nomination);
    setIsModalOpen(true);
  };

  // Add handleSort function
  const handleSort = (key: SortableColumn) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on new sort
  };

  const handleNextPage = () => {
    if (!isPlaceholderData && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading && paginatedData === undefined && !isPlaceholderData) {
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
  
  if (totalCount === 0 && !isLoading) {
    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center"><PageIcon className="mr-2 h-8 w-8 text-green-600" />Approved Nominations</h1>
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Nominee Name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            {debouncedSearchTerm ? `No approved nominations found for "${debouncedSearchTerm}".` : "No approved nominations found."}
          </p>
          {!debouncedSearchTerm && <p className="text-sm text-muted-foreground">Nominations with 'approved' status will appear here.</p>}
        </div>
      </div>
    );
  }

  // Add renderSortIcon function
  const renderSortIcon = (columnKey: SortableColumn) => {
    if (sortConfig.key !== columnKey) {
      return null; 
    }
    return sortConfig.direction === 'asc' 
      ? <SortAsc className="inline ml-1 h-4 w-4" /> 
      : <SortDesc className="inline ml-1 h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center"><PageIcon className="mr-2 h-8 w-8 text-green-600" />Approved Nominations</h1>
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Nominee Name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Review all nominations that have been marked as 'approved'. 
        {totalCount > 0 ? ` Displaying ${nominations.length} of ${totalCount} nominations.` : ""}
        {debouncedSearchTerm && ` (Filtered by "${debouncedSearchTerm}")`}
      </p>
      
      <Table>
        <TableCaption>List of approved nominations. Page {currentPage} of {totalPages}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Nomination ID</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort('nominee_name')}
            >
              Nominee Name {renderSortIcon('nominee_name')}
            </TableHead>
            <TableHead>Email</TableHead> {/* Email sorting not implemented due to nested data */}
            <TableHead 
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort('award_category_id')}
            >
              Category ID {renderSortIcon('award_category_id')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort('submitted_at')}
            >
              Date Submitted {renderSortIcon('submitted_at')}
            </TableHead>
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
            disabled={currentPage === 1 || isLoading || isPlaceholderData}
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
            disabled={currentPage === totalPages || isLoading || isPlaceholderData}
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
