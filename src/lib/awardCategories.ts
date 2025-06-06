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

export interface Award {
  name: string;
  // value can be the same as name or a unique identifier if needed later
  value: string; 
}

export interface AwardCategory {
  id: string;
  title: string;
  awards: Award[];
}

// Updated order as specified
export const awardCategoriesData: AwardCategory[] = [
  {
    id: 'leadership_legacy',
    title: 'PAN-AFRICAN HUMANITARIAN LEADERSHIP & LEGACY',
    awards: [
      { name: 'African Humanitarian Hero (Highest Honor)', value: 'african_humanitarian_hero' },
      { name: 'Pan-African Icon of Humanitarian Leadership', value: 'pan_african_icon_humanitarian_leadership' },
      { name: 'Humanitarian Lifetime Achievement Award', value: 'humanitarian_lifetime_achievement' },
      { name: 'Distinguished Traditional Leadership for Humanitarian Support', value: 'distinguished_traditional_leadership_humanitarian_support' },
      { name: 'Outstanding Humanitarian Organization of the Year', value: 'outstanding_humanitarian_organization_year' },
    ],
  },
  {
    id: 'governance_impact',
    title: 'EXEMPLARY GOVERNANCE FOR HUMANITARIAN IMPACT',
    awards: [
      { name: 'Humanitarian Leadership in Governance Award', value: 'humanitarian_leadership_governance' },
      { name: 'Best Humanitarian-Friendly President/Head of State Award', value: 'best_president_head_of_state' },
      { name: 'Best Humanitarian-Friendly First Lady Award', value: 'best_first_lady' },
      { name: 'Best Humanitarian-Friendly Governor Award', value: 'best_governor' },
      { name: 'Best Humanitarian-Friendly Minister of Education Award', value: 'best_minister_education' },
    ],
  },
  {
    id: 'youth_gender_equality',
    title: 'YOUTH EMPOWERMENT & GENDER EQUALITY LEADERSHIP',
    awards: [
      { name: 'Humanitarian Youth Leadership Award', value: 'humanitarian_youth_leadership' },
      { name: 'Gender Equity & Women Empowerment Award', value: 'gender_equity_women_empowerment' },
      { name: 'Outstanding Public Office Holder for Gender Equality & Women\'s Empowerment Award', value: 'outstanding_public_office_holder_gender_equality' },
      { name: 'Future Humanitarian Leaders Award', value: 'future_humanitarian_leaders' },
    ],
  },
  {
    id: 'sustainable_development_environment',
    title: 'SUSTAINABLE DEVELOPMENT & ENVIRONMENTAL STEWARDSHIP',
    awards: [
      { name: 'Environmental Stewardship & SDGs Impact', value: 'environmental_stewardship_sdgs_impact' },
      { name: 'Climate Change Leadership Award', value: 'climate_change_leadership' },
      { name: 'Renewable Energy & Humanitarian Infrastructure Award', value: 'renewable_energy_humanitarian_infrastructure' },
      { name: 'WASH (Water, Sanitation & Hygiene) Initiative Award', value: 'wash_award' },
    ],
  },
  {
    id: 'innovation_technology',
    title: 'HUMANITARIAN INNOVATION & TECHNOLOGY',
    awards: [
      { name: 'Tech for Good: Innovation & Aid Delivery', value: 'tech_for_good_innovation' },
      { name: 'Corporate Social Responsibility (CSR) Excellence Award', value: 'csr_excellence' },
      { name: 'Media & Advocacy for Humanitarian Excellence Award', value: 'media_advocacy_humanitarian_excellence' },
    ],
  },
  {
    id: 'disaster_relief_crisis_management',
    title: 'DISASTER RELIEF & CRISIS MANAGEMENT',
    awards: [
      { name: 'Disaster Relief & Emergency Response Award', value: 'disaster_relief_emergency_response' },
      { name: 'National Emergency Management Excellence', value: 'national_emergency_management_excellence' },
      { name: 'Humanitarian Food Security & Nutrition Award', value: 'humanitarian_food_security_nutrition' },
    ],
  },
  {
    id: 'public_sector_recognition',
    title: 'PUBLIC SECTOR AND INSTITUTIONAL RECOGNITION',
    awards: [
      { name: 'Infrastructure for Humanitarian Development', value: 'infrastructure_humanitarian_development' },
      { name: 'Minister of Finance for Humanitarian Growth', value: 'minister_finance_humanitarian_growth' },
      { name: 'Lawmakers Championing Rights & Inclusion', value: 'lawmakers_championing_rights' },
      { name: 'Anti-Corruption Leadership for Humanitarian Advancement', value: 'anti_corruption_leadership' },
    ],
  },
  {
    id: 'social_cultural',
    title: 'HUMANITARIAN, SOCIAL & CULTURAL CONTRIBUTIONS',
    awards: [
      { name: 'Arts & Humanitarian Storytelling', value: 'arts_humanitarian_storytelling' },
      { name: 'Social Impact Award', value: 'social_impact_award' },
      { name: 'Humanitarian Education & Capacity-Building', value: 'humanitarian_education_capacity_building' },
      { name: 'Excellence in Humanitarian Advocacy', value: 'excellence_humanitarian_advocacy' },
    ],
  },
  {
    id: 'human_rights',
    title: 'HUMAN RIGHTS & SOCIAL JUSTICE',
    awards: [
      { name: 'Human Rights Defender of the Year', value: 'human_rights_defender' },
      { name: 'Migration & Refugee Assistance Advocate', value: 'migration_refugee_assistance' },
    ],
  },
  {
    id: 'research_development',
    title: 'HUMANITARIAN RESEARCH & DEVELOPMENT',
    awards: [
      { name: 'Scientific Research & Policy for Humanitarian Impact', value: 'scientific_research_policy' },
      { name: 'Public Health & Crisis Management Excellence', value: 'public_health_crisis_management' },
    ],
  },
];

export const getAwardsForCategory = (categoryId: string): Award[] => {
  const category = awardCategoriesData.find(cat => cat.id === categoryId);
  return category ? category.awards : [];
};

export const getCategoryTitleById = (categoryId: string): string | undefined => {
  return awardCategoriesData.find(cat => cat.id === categoryId)?.title;
};

export const getAwardNameByValue = (categoryId: string, awardValue: string): string | undefined => {
  const category = awardCategoriesData.find(cat => cat.id === categoryId);
  return category?.awards.find(award => award.value === awardValue)?.name;
};