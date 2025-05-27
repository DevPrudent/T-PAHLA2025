
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type NominationDocument = Database['public']['Tables']['nomination_documents']['Row'];

const fetchNominationDocuments = async (nominationId: string): Promise<NominationDocument[]> => {
  if (!nominationId) return [];

  const { data, error } = await supabase
    .from('nomination_documents')
    .select('*')
    .eq('nomination_id', nominationId);

  if (error) {
    console.error('Error fetching nomination documents:', error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useNominationDocuments = (nominationId: string | undefined) => {
  return useQuery<NominationDocument[], Error>({
    queryKey: ['nominationDocuments', nominationId],
    queryFn: () => fetchNominationDocuments(nominationId!),
    enabled: !!nominationId, // Only run query if nominationId is available
  });
};
