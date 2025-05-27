
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, CheckCircle, Download, Printer, Trash2, Save } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { format, parseISO, isValid } from 'date-fns';
import { getCategoryTitleById, getAwardNameByValue } from '@/lib/awardCategories'; // Assuming these exist and are correct

type NominationRow = Database['public']['Tables']['nominations']['Row'];

interface AdminNominationDetailViewHeaderProps {
  nomination: NominationRow;
  onEdit: () => void;
  onMarkAsComplete: () => void;
  onDownloadAll: () => void;
  onExportPDF: () => void;
  onDelete: () => void;
}

const AdminNominationDetailViewHeader: React.FC<AdminNominationDetailViewHeaderProps> = ({
  nomination,
  onEdit,
  onMarkAsComplete,
  onDownloadAll,
  onExportPDF,
  onDelete,
}) => {
  const sectionB = nomination.form_section_b as { award_category?: string; specific_award?: string; } | null;

  const awardCategoryTitle = sectionB?.award_category ? getCategoryTitleById(sectionB.award_category) : 'N/A';
  const specificAwardName = (sectionB?.award_category && sectionB?.specific_award) ? getAwardNameByValue(sectionB.award_category, sectionB.specific_award) : (sectionB?.specific_award || 'N/A');
  
  const submissionDate = nomination.submitted_at ? parseISO(nomination.submitted_at) : null;
  const formattedSubmissionDate = submissionDate && isValid(submissionDate) ? format(submissionDate, 'PPP p') : 'Not Submitted';

  const statusVariant = (status: string | null | undefined): "default" | "success" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'submitted': return 'default';
      case 'approved':
      case 'completed': // Assuming 'completed' is a possible status
        return 'success';
      case 'rejected': return 'destructive';
      case 'draft':
      case 'incomplete': 
      default: return 'outline';
    }
  };
  const statusText = nomination.status ? nomination.status.charAt(0).toUpperCase() + nomination.status.slice(1) : 'Unknown';


  return (
    <header className="sticky top-0 z-30 bg-background/95 dark:bg-gray-900/95 backdrop-blur-sm border-b dark:border-gray-700 p-4 shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          {/* Left Side: Nomination Info */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{nomination.nominee_name || 'N/A'}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <Badge variant={statusVariant(nomination.status)} className="mr-2">{statusText}</Badge>
              </div>
              <span>ID: {nomination.id}</span>
              <span>Submitted: {formattedSubmissionDate}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span>Category: <strong>{awardCategoryTitle}</strong></span>
              <span className="mx-2">|</span>
              <span>Award: <strong>{specificAwardName}</strong></span>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}><Edit size={16} className="mr-2" />Edit</Button>
            {(nomination.status === 'incomplete' || nomination.status === 'submitted' || nomination.status === 'draft') && (
                <Button variant="outline" size="sm" onClick={onMarkAsComplete}><CheckCircle size={16} className="mr-2" />Mark as Complete</Button>
            )}
            <Button variant="outline" size="sm" onClick={onDownloadAll}><Download size={16} className="mr-2" />Download All</Button>
            <Button variant="outline" size="sm" onClick={onExportPDF}><Printer size={16} className="mr-2" />Export as PDF</Button>
            <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 size={16} className="mr-2" />Delete</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNominationDetailViewHeader;
