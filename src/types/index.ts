
// This file can be used to store common TypeScript types for the application.

export interface AwardCategory {
  id: string; // Assuming UUID or some string ID
  cluster_title: string;
  description?: string | null;
  icon_name?: string | null;
  image_path?: string | null;
  // Add other fields from your award_categories table schema if needed
}

// You can add other shared types here.
// For example, for form data if not using Zod types directly everywhere:
// import { Tables } from '@/integrations/supabase/types';
// export type NominationFormData = Partial<Tables<'nominations'>['Insert']>;

