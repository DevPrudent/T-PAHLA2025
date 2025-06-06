import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, ShieldCheck, Leaf, Lightbulb, Home, Users2, Landmark, Scale, BookOpen, Search, HelpCircle, LucideProps } from "lucide-react";

// Type for icon components
export type LucideIconComponent = React.FC<LucideProps>;

// Icon mapping
export const iconMap: Record<string, LucideIconComponent> = {
  Users,
  ShieldCheck,
  Users2,
  Leaf,
  Lightbulb,
  Home,
  Landmark,
  BookOpen,
  Scale,
  Search,
  Default: HelpCircle,
};

// Type for raw data from Supabase
export interface AwardCategoryFromDB {
  id: string;
  cluster_title: string;
  description: string | null;
  awards: unknown | null; // Supabase jsonb can be 'unknown' initially
  icon_name: string | null;
  image_path: string | null;
}

// Type for data structure after fetching and transforming
export interface AwardCluster {
  id: string;
  clusterTitle: string;
  IconComponent: LucideIconComponent;
  description: string;
  awards: string[];
  imagePath: string | null;
}

// Define the order of categories as specified
const categoryOrder = [
  'leadership_legacy',
  'governance_impact',
  'youth_gender_equality',
  'sustainable_development_environment',
  'innovation_technology',
  'disaster_relief_crisis_management',
  'public_sector_recognition',
  'social_cultural',
  'human_rights',
  'research_development'
];

const fetchAwardCategories = async (): Promise<AwardCluster[]> => {
  const { data, error } = await supabase
    .from("award_categories")
    .select("id, cluster_title, description, awards, icon_name, image_path");

  if (error) {
    console.error("Error fetching award categories:", error);
    throw new Error(error.message);
  }
  if (!data) {
    return [];
  }

  // Transform the data
  const transformedData = data.map((category: AwardCategoryFromDB) => {
    let parsedAwards: string[] = [];
    if (category.awards && Array.isArray(category.awards)) {
      parsedAwards = category.awards.filter((award: unknown): award is string => typeof award === 'string');
    }
    
    return {
      id: category.id,
      clusterTitle: category.cluster_title,
      description: category.description || "No description available.",
      awards: parsedAwards,
      IconComponent: category.icon_name ? (iconMap[category.icon_name] || iconMap.Default) : iconMap.Default,
      imagePath: category.image_path,
    };
  });

  // Sort the data according to the specified order
  const sortedData = [...transformedData].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.id);
    const indexB = categoryOrder.indexOf(b.id);
    
    // If both IDs are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one ID is in the order array, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither ID is in the order array, maintain alphabetical order
    return a.clusterTitle.localeCompare(b.clusterTitle);
  });

  return sortedData;
};

export const useAwardCategories = () => {
  return useQuery<AwardCluster[], Error>({
    queryKey: ["awardCategories"],
    queryFn: fetchAwardCategories,
  });
};