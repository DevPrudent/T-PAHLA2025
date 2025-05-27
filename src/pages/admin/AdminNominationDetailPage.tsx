
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import AdminNominationDetailViewHeader from '@/components/admin/AdminNominationDetailViewHeader'; // New Header
import SectionCard from '@/components/ui/SectionCard';
import SectionADisplay from '@/components/admin/displays/SectionADisplay';
import SectionBDisplay from '@/components/admin/displays/SectionBDisplay';
import SectionCDisplay from '@/components/admin/displays/SectionCDisplay';
import SectionDDisplay from '@/components/admin/displays/SectionDDisplay';
import SectionEDisplay from '@/components/admin/displays/SectionEDisplay';
import { Button } from '@/components/ui/button';
import { Save, Tag, MessageSquare, CheckCircle as MarkCompleteIconFooter } from 'lucide-react'; // Renamed CheckCircle to avoid conflict
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


type NominationRow = Database['public']['Tables']['nominations']['Row'];
interface SectionAData { nominee_full_name?: string; [key: string]: any; }
interface SectionBData { award_category?: string; specific_award?: string; [key: string]: any; } // Added specific_award
interface SectionCData { justification_statement?: string; [key: string]: any; }
interface SectionDData { nominator_full_name?: string; [key: string]: any; }
interface SectionEData { confirm_accuracy?: boolean; [key: string]: any; }


const AdminNominationDetailPage: React.FC = () => {
  const { nominationId } = useParams<{ nominationId: string }>();
  const navigate = useNavigate();
  const [nomination, setNomination] = useState<NominationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalNote, setInternalNote] = useState(''); // TODO: Load/Save this from/to DB
  const [tags, setTags] = useState(''); // TODO: Load/Save this from/to DB
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchNomination = async () => {
      if (!nominationId) {
        setError('Nomination ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('nominations')
          .select('*')
          .eq('id', nominationId)
          .single();

        if (dbError) throw dbError;
        if (!data) throw new Error('Nomination not found.');
        
        setNomination(data);
        // TODO: Fetch existing internal notes and tags for this nomination
        // setInternalNote(data.internal_note || '');
        // setTags(data.tags?.join(', ') || '');
      } catch (err: any) {
        console.error('Error fetching nomination:', err);
        setError(err.message || 'Failed to load nomination details.');
        toast.error(err.message || 'Failed to load nomination details.');
      } finally {
        setLoading(false);
      }
    };

    fetchNomination();
  }, [nominationId]);

  // Placeholder handlers for header actions
  const handleEdit = () => {
    // TODO: Implement navigation to an edit route or toggle inline edit mode
    console.log('Edit action triggered for nomination:', nominationId);
    toast.info('Edit functionality not yet implemented.');
     // Example: navigate(`/admin/nominations/edit/${nominationId}`);
  };

  const handleMarkAsComplete = async () => {
    if (!nomination) return;
    console.log('Mark as Complete action triggered for nomination:', nominationId);
    try {
      // TODO: Implement actual status update in DB
      // For now, simulate update and refresh
      // const { error: updateError } = await supabase
      //   .from('nominations')
      //   .update({ status: 'completed', updated_at: new Date().toISOString() })
      //   .eq('id', nomination.id);
      // if (updateError) throw updateError;
      
      toast.success(`Nomination ${nomination.nominee_name} marked as complete (simulated).`);
      setNomination(prev => prev ? { ...prev, status: 'completed' as NominationRow['status'] } : null); // Update local state
    } catch (err: any) {
      console.error('Error marking nomination as complete:', err);
      toast.error(`Failed to mark as complete: ${err.message}`);
    }
  };
  
  const handleDownloadAll = () => {
    console.log('Download All action triggered for nomination:', nominationId);
    toast.info('Download All functionality not yet implemented.');
    // TODO: Implement logic to gather all files and zip them for download
  };

  const handleExportPDF = () => {
    console.log('Export PDF action triggered for nomination:', nominationId);
    toast.info('Export PDF functionality not yet implemented.');
    window.print(); // Basic print functionality as a stand-in
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    if (!nomination) return;
    console.log('Delete action confirmed for nomination:', nominationId);
    try {
        // TODO: Implement actual delete in DB
        // const { error: deleteError } = await supabase
        //  .from('nominations')
        //  .delete()
        //  .eq('id', nomination.id);
        // if (deleteError) throw deleteError;

        toast.success(`Nomination ${nomination.nominee_name} deleted (simulated).`);
        navigate('/admin/nominations/completed'); // Or to the relevant list page
    } catch (err:any) {
        console.error('Error deleting nomination:', err);
        toast.error(`Failed to delete nomination: ${err.message}`);
    }
  };
  
  // Placeholder handlers for footer actions
  const handleSaveChanges = () => {
    // This would be active if inline editing is implemented
    console.log('Save Changes (footer) action triggered');
    toast.info('Save Changes (footer) functionality depends on inline editing.');
  };
  
  const handleSaveNote = async () => {
    if (!nomination) return;
    console.log('Save Note action triggered. Note:', internalNote);
    // TODO: Implement saving internalNote to DB, e.g., to a new field in 'nominations' table or a separate 'admin_notes' table.
    // Example:
    // const { error: noteError } = await supabase
    //   .from('nominations')
    //   .update({ internal_admin_note: internalNote, updated_at: new Date().toISOString() })
    //   .eq('id', nomination.id);
    // if (noteError) throw noteError;
    toast.success('Internal note saved (simulated).');
  };

  const handleSaveTags = async () => {
    if (!nomination) return;
    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
    console.log('Save Tags action triggered. Tags:', tagArray);
    // TODO: Implement saving tags to DB, e.g., to a new text[] field in 'nominations' table.
    // Example:
    // const { error: tagError } = await supabase
    //   .from('nominations')
    //   .update({ admin_tags: tagArray, updated_at: new Date().toISOString() })
    //   .eq('id', nomination.id);
    // if (tagError) throw tagError;
    toast.success('Tags saved (simulated).');
  };


  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading nomination details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!nomination) {
    return <div className="container mx-auto p-6 text-center">Nomination not found.</div>;
  }
  
  const sectionA = nomination.form_section_a as SectionAData | null;
  const sectionB = nomination.form_section_b as SectionBData | null;
  const sectionC = nomination.form_section_c as SectionCData | null;
  const sectionD = nomination.form_section_d as SectionDData | null;
  const sectionE = nomination.form_section_e as SectionEData | null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <AdminNominationDetailViewHeader 
        nomination={nomination}
        onEdit={handleEdit}
        onMarkAsComplete={handleMarkAsComplete}
        onDownloadAll={handleDownloadAll}
        onExportPDF={handleExportPDF}
        onDelete={() => setShowDeleteConfirm(true)}
      />
      
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8"> {/* Added py-8 for spacing */}
        <div className="max-w-4xl mx-auto space-y-6"> {/* Added space-y-6 for spacing between cards */}
          <SectionCard title="SECTION A – NOMINEE INFORMATION">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4"> {/* Standardized padding and gap */}
                <SectionADisplay data={sectionA} />
            </div>
          </SectionCard>

          <SectionCard title="SECTION B – NOMINATION CATEGORY">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4">
                <SectionBDisplay data={sectionB} />
            </div>
          </SectionCard>

          <SectionCard title="SECTION C – JUSTIFICATION & SUPPORTING MATERIALS">
            <div className="p-4 space-y-4"> {/* Section C typically has more full-width items */}
                <SectionCDisplay data={sectionC} notes={nomination.form_section_c_notes} />
            </div>
          </SectionCard>

          <SectionCard title="SECTION D – NOMINATOR INFORMATION">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4">
                <SectionDDisplay data={sectionD} />
            </div>
          </SectionCard>

          <SectionCard title="SECTION E – CONFIRMATION & SIGNATURE">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4">
                <SectionEDisplay data={sectionE} />
            </div>
          </SectionCard>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-background/95 dark:bg-gray-900/95 backdrop-blur-sm border-t dark:border-gray-700 p-4 mt-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label htmlFor="internalNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Internal Note</label>
              <Textarea 
                id="internalNote" 
                placeholder="Admin-only notes..." 
                value={internalNote} 
                onChange={(e) => setInternalNote(e.target.value)}
                className="dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Tags (comma-separated)</label>
              <Input 
                id="tags" 
                placeholder="e.g., Urgent, VIP Review" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            {/* Save Changes button would be more relevant with inline editing */}
            {/* <Button variant="tpahla-primary" onClick={handleSaveChanges}><Save className="mr-2 h-4 w-4" /> Save All Changes</Button> */}
            {(nomination.status === 'incomplete' || nomination.status === 'draft' || nomination.status === 'submitted') && (
                 <Button variant="tpahla-secondary" onClick={handleMarkAsComplete}><MarkCompleteIconFooter className="mr-2 h-4 w-4" /> Mark as Complete</Button>
            )}
             <Button variant="outline" onClick={handleSaveNote}><MessageSquare className="mr-2 h-4 w-4" /> Save Note</Button>
             <Button variant="outline" onClick={handleSaveTags}><Tag className="mr-2 h-4 w-4" /> Save Tags</Button>
          </div>
        </div>
      </footer>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the nomination
              for <strong>{nomination.nominee_name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Yes, delete nomination
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminNominationDetailPage;
