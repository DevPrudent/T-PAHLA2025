import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, ShieldCheck, Leaf, Lightbulb, Home, Users2, Landmark, Scale, BookOpen, Search, HelpCircle, LucideCrop as LucideProps } from "lucide-react";

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

// Define the specific order of categories
const CATEGORY_ORDER = [
  "PAN-AFRICAN HUMANITARIAN LEADERSHIP & LEGACY",
  "EXEMPLARY GOVERNANCE FOR HUMANITARIAN IMPACT",
  "YOUTH EMPOWERMENT & GENDER EQUALITY LEADERSHIP",
  "SUSTAINABLE DEVELOPMENT & ENVIRONMENTAL STEWARDSHIP",
  "HUMANITARIAN INNOVATION & TECHNOLOGY",
  "DISASTER RELIEF & CRISIS MANAGEMENT",
  "PUBLIC SECTOR AND INSTITUTIONAL RECOGNITION",
  "HUMANITARIAN, SOCIAL & CULTURAL CONTRIBUTIONS",
  "HUMAN RIGHTS & SOCIAL JUSTICE",
  "HUMANITARIAN RESEARCH & DEVELOPMENT"
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

  // Sort the data according to the predefined order
  return transformedData.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a.clusterTitle);
    const indexB = CATEGORY_ORDER.indexOf(b.clusterTitle);
    
    // If both items are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one item is in the order array, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither item is in the order array, maintain alphabetical sorting as fallback
    return a.clusterTitle.localeCompare(b.clusterTitle);
  });
};

export const useAwardCategories = () => {
  return useQuery<AwardCluster[], Error>({
    queryKey: ["awardCategories"],
    queryFn: fetchAwardCategories,
  });
};