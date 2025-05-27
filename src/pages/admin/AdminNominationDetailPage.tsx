import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import NominationDetailHeader from '@/components/admin/NominationDetailHeader';
import SectionCard from '@/components/ui/SectionCard'; // Updated path
import SectionADisplay from '@/components/admin/displays/SectionADisplay';
import SectionBDisplay from '@/components/admin/displays/SectionBDisplay';
import SectionCDisplay from '@/components/admin/displays/SectionCDisplay';
import SectionDDisplay from '@/components/admin/displays/SectionDDisplay';
import SectionEDisplay from '@/components/admin/displays/SectionEDisplay';
import { Button } from '@/components/ui/button';
import { Save, Tag, MessageSquare, CheckCircle } from 'lucide-react'; // For bottom utilities
import { Textarea } from '@/components/ui/textarea'; // For internal note
import { Input } from '@/components/ui/input'; // For tags
import { toast } from 'sonner';


type NominationRow = Database['public']['Tables']['nominations']['Row'];
// Define interfaces for section data based on how they are stored in form_section_X jsonb columns
// These are simplified based on common fields, actual structure might vary.
// Re-using similar structures from NominationDetailsModal for now.
interface SectionAData { nominee_full_name?: string; [key: string]: any; }
interface SectionBData { award_category?: string; [key: string]: any; }
interface SectionCData { justification_statement?: string; [key: string]: any; }
interface SectionDData { nominator_full_name?: string; [key: string]: any; }
interface SectionEData { confirm_accuracy?: boolean; [key: string]: any; }


const AdminNominationDetailPage: React.FC = () => {
  const { nominationId } = useParams<{ nominationId: string }>();
  const [nomination, setNomination] = useState<NominationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for bottom utilities (placeholders for now)
  const [internalNote, setInternalNote] = useState('');
  const [tags, setTags] = useState('');


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

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading nomination details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!nomination) {
    return <div className="container mx-auto p-6 text-center">Nomination not found.</div>;
  }
  
  // Cast section data - ensure these casts are correct based on your DB schema
  const sectionA = nomination.form_section_a as SectionAData | null;
  const sectionB = nomination.form_section_b as SectionBData | null;
  const sectionC = nomination.form_section_c as SectionCData | null;
  const sectionD = nomination.form_section_d as SectionDData | null;
  const sectionE = nomination.form_section_e as SectionEData | null;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <NominationDetailHeader nomination={nomination} />
      
      <main className="container mx-auto px-4 md:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <SectionCard title="SECTION A – NOMINEE INFORMATION">
            <SectionADisplay data={sectionA} />
          </SectionCard>

          <SectionCard title="SECTION B – NOMINATION CATEGORY">
            <SectionBDisplay data={sectionB} />
          </SectionCard>

          <SectionCard title="SECTION C – JUSTIFICATION & SUPPORTING MATERIALS">
            <SectionCDisplay data={sectionC} notes={nomination.form_section_c_notes} />
          </SectionCard>

          <SectionCard title="SECTION D – NOMINATOR INFORMATION">
            <SectionDDisplay data={sectionD} />
          </SectionCard>

          <SectionCard title="SECTION E – CONFIRMATION & SIGNATURE">
            <SectionEDisplay data={sectionE} />
          </SectionCard>
        </div>
      </main>

      {/* Bottom Admin Utilities (Sticky Footer - simplified for now) */}
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
            <Button variant="tpahla-primary"><Save className="mr-2" /> Save Changes</Button>
            {/* Conditional Mark as Complete button */}
            {(nomination.status === 'incomplete' || nomination.status === 'draft' || nomination.status === 'submitted') && (
                 <Button variant="tpahla-secondary"><CheckCircle className="mr-2" /> Mark as Complete</Button>
            )}
             <Button variant="outline"><MessageSquare className="mr-2" /> Save Note</Button>
             <Button variant="outline"><Tag className="mr-2" /> Save Tags</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminNominationDetailPage;
