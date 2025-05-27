
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Download, CheckCircle, FileText, Trash2 } from 'lucide-react'; // Using CheckCircle for Mark as Complete
import { Database } from '@/integrations/supabase/types';
import { format, parseISO, isValid } from 'date-fns';
import { getCategoryTitleById, getAwardNameByValue } from '@/lib/awardCategories';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

interface NominationDetailHeaderProps {
  nomination: NominationRow | null;
  // Add action handlers as props later
  // onEdit: () => void;
  // onMarkComplete: () => void;
  // ...etc.
}

const NominationDetailHeader: React.FC<NominationDetailHeaderProps> = ({ nomination }) => {
  if (!nomination) return null; // Or a loading skeleton

  const statusVariant = (status: string | null | undefined): "default" | "success" | "destructive" | "outline" => {
    switch (status) {
      case 'submitted': return 'default';
      case 'completed': // Assuming 'completed' is a possible status for admins
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'draft':
      case 'incomplete': 
      default: return 'outline';
    }
  };

  const submissionDate = nomination.submitted_at ? parseISO(nomination.submitted_at) : null;
  const formattedSubmissionDate = submissionDate && isValid(submissionDate) ? format(submissionDate, 'PPP p') : 'Not Submitted';
  
  const sectionB = nomination.form_section_b as any; // Cast for simplicity
  const awardCategory = sectionB?.award_category ? getCategoryTitleById(sectionB.award_category) : 'N/A';
  const specificAward = (sectionB?.award_category && sectionB?.specific_award) ? getAwardNameByValue(sectionB.award_category, sectionB.specific_award) : 'N/A';

  return (
    <div className="sticky top-0 z-10 bg-background/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 md:p-6 border-b dark:border-gray-700 mb-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-tpahla-darkgreen dark:text-tpahla-gold mb-1">{nomination.nominee_name || 'N/A'}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
              <span>ID: {nomination.id}</span>
              <Badge variant={statusVariant(nomination.status)} className="capitalize">
                {nomination.status || 'Unknown'}
              </Badge>
              <span>Submitted: {formattedSubmissionDate}</span>
            </div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              <span>Category: <strong>{awardCategory}</strong></span> | <span>Award: <strong>{specificAward}</strong></span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Placeholder Action Buttons */}
            <Button variant="tpahla-primary" size="sm"><Edit className="mr-2" /> Edit</Button>
            {(nomination.status === 'incomplete' || nomination.status === 'draft' || nomination.status === 'submitted') && ( // Example condition
                <Button variant="tpahla-secondary" size="sm"><CheckCircle className="mr-2" /> Mark as Complete</Button>
            )}
            <Button variant="outline" size="sm"><Download className="mr-2" /> Download All</Button>
            <Button variant="outline" size="sm"><FileText className="mr-2" /> Export PDF</Button>
            <Button variant="destructive" size="sm"><Trash2 className="mr-2" /> Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NominationDetailHeader;
