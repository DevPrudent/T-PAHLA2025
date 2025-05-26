
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { Database } from '@/integrations/supabase/types';

type NominationRowType = Database['public']['Tables']['nominations']['Row'];
type NominationStatusEnum = Database['public']['Enums']['nomination_status_enum'];

type FormSectionAData = {
  nominee_email?: string;
};

interface NominationTableRowProps {
  nomination: NominationRowType;
  onViewDetails: (nomination: NominationRowType) => void;
  onUpdateStatus: (nominationId: string, status: NominationStatusEnum) => void;
  isProcessingAction: (action: 'approve' | 'reject') => boolean;
  isAnyActionProcessing: boolean;
}

const NominationTableRow: React.FC<NominationTableRowProps> = ({
  nomination,
  onViewDetails,
  onUpdateStatus,
  isProcessingAction,
  isAnyActionProcessing,
}) => {
  const sectionAData = nomination.form_section_a as FormSectionAData | null;
  const nomineeEmail = sectionAData?.nominee_email || 'N/A';
  const submissionDate = nomination.submitted_at || nomination.created_at;

  return (
    <TableRow key={nomination.id}>
      <TableCell className="truncate max-w-xs text-xs">{nomination.id}</TableCell>
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
          <Button size="sm" variant="ghost" onClick={() => onViewDetails(nomination)}>
            <Eye size={16} className="mr-1" /> View
          </Button>
          {(nomination.status === "submitted") && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="text-green-600 hover:text-green-700"
                onClick={() => onUpdateStatus(nomination.id, 'approved')}
                disabled={isAnyActionProcessing}
              >
                {isProcessingAction('approve') ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle size={16} className="mr-1" />}
                Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                onClick={() => onUpdateStatus(nomination.id, 'rejected')}
                disabled={isAnyActionProcessing}
              >
                {isProcessingAction('reject') ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <XCircle size={16} className="mr-1" />}
                Reject
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default NominationTableRow;
