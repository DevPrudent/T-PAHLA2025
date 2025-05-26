
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
      { name: 'Sustainable Development & Environmental Stewardship Award', value: 'sustainable_development_environmental_stewardship' },
      { name: 'Climate Change Leadership Award', value: 'climate_change_leadership' },
      { name: 'Renewable Energy & Humanitarian Infrastructure Award', value: 'renewable_energy_humanitarian_infrastructure' },
      { name: 'Clean Water, Sanitation & Hygiene (WASH) Award', value: 'wash_award' },
    ],
  },
  {
    id: 'innovation_technology',
    title: 'HUMANITARIAN INNOVATION & TECHNOLOGY',
    awards: [
      { name: 'Humanitarian Innovation & Technology Award', value: 'humanitarian_innovation_technology' },
      { name: 'Corporate Social Responsibility (CSR) Excellence Award', value: 'csr_excellence' },
      { name: 'Media & Advocacy for Humanitarian Excellence Award', value: 'media_advocacy_humanitarian_excellence' },
    ],
  },
  {
    id: 'disaster_relief_crisis_management',
    title: 'DISASTER RELIEF & CRISIS MANAGEMENT',
    awards: [
      { name: 'Disaster Relief & Emergency Response Award', value: 'disaster_relief_emergency_response' },
      { name: 'Excellence in Disaster Relief & National Emergency Management Award', value: 'excellence_disaster_relief_national_emergency_management' },
      { name: 'Humanitarian Food Security & Nutrition Award', value: 'humanitarian_food_security_nutrition' },
    ],
  },
  {
    id: 'public_sector_recognition',
    title: 'PUBLIC SECTOR AND INSTITUTIONAL RECOGNITION',
    awards: [
      { name: 'Best Minister for Infrastructure & Humanitarian Development Award', value: 'best_minister_infrastructure_humanitarian_development' },
      { name: 'Best Humanitarian-Friendly Minister of Finance Award', value: 'best_minister_finance' },
      { name: 'Best Humanitarian-Friendly Law Maker Award', value: 'best_law_maker' },
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

