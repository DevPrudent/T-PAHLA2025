/*
  # Populate award categories table

  1. New Data
    - Inserts all award categories from the application code into the database
    - Each category includes id, cluster_title, description, and awards array
    - Uses ON CONFLICT to avoid duplicates if categories already exist

  2. Security
    - No changes to RLS policies needed as they already exist
*/

-- Insert all award categories from the application code
INSERT INTO award_categories (id, cluster_title, description, awards, icon_name) VALUES
('leadership_legacy', 'PAN-AFRICAN HUMANITARIAN LEADERSHIP & LEGACY', 'Awards recognizing exceptional humanitarian leadership and lasting impact across Africa', ARRAY[
  'African Humanitarian Hero (Highest Honor)',
  'Pan-African Icon of Humanitarian Leadership', 
  'Humanitarian Lifetime Achievement Award',
  'Distinguished Traditional Leadership for Humanitarian Support',
  'Outstanding Humanitarian Organization of the Year'
], 'Users'),

('governance_impact', 'EXEMPLARY GOVERNANCE FOR HUMANITARIAN IMPACT', 'Recognition for government leaders who champion humanitarian causes', ARRAY[
  'Humanitarian Leadership in Governance Award',
  'Best Humanitarian-Friendly President/Head of State Award',
  'Best Humanitarian-Friendly First Lady Award', 
  'Best Humanitarian-Friendly Governor Award',
  'Best Humanitarian-Friendly Minister of Education Award'
], 'Landmark'),

('youth_gender_equality', 'YOUTH EMPOWERMENT & GENDER EQUALITY LEADERSHIP', 'Awards celebrating youth leadership and gender equality advocacy', ARRAY[
  'Humanitarian Youth Leadership Award',
  'Gender Equity & Women Empowerment Award',
  'Outstanding Public Office Holder for Gender Equality & Women''s Empowerment Award',
  'Future Humanitarian Leaders Award'
], 'Users2'),

('sustainable_development_environment', 'SUSTAINABLE DEVELOPMENT & ENVIRONMENTAL STEWARDSHIP', 'Recognition for environmental leadership and sustainable development initiatives', ARRAY[
  'Environmental Stewardship & SDGs Impact',
  'Climate Change Leadership Award',
  'Renewable Energy & Humanitarian Infrastructure Award',
  'WASH (Water, Sanitation & Hygiene) Initiative Award'
], 'Leaf'),

('innovation_technology', 'HUMANITARIAN INNOVATION & TECHNOLOGY', 'Awards for technological innovation in humanitarian work', ARRAY[
  'Tech for Good: Innovation & Aid Delivery',
  'Corporate Social Responsibility (CSR) Excellence Award',
  'Media & Advocacy for Humanitarian Excellence Award'
], 'Lightbulb'),

('disaster_relief_crisis_management', 'DISASTER RELIEF & CRISIS MANAGEMENT', 'Recognition for excellence in emergency response and disaster management', ARRAY[
  'Disaster Relief & Emergency Response Award',
  'National Emergency Management Excellence',
  'Humanitarian Food Security & Nutrition Award'
], 'ShieldCheck'),

('public_sector_recognition', 'PUBLIC SECTOR AND INSTITUTIONAL RECOGNITION', 'Awards for public sector contributions to humanitarian development', ARRAY[
  'Infrastructure for Humanitarian Development',
  'Minister of Finance for Humanitarian Growth',
  'Lawmakers Championing Rights & Inclusion',
  'Anti-Corruption Leadership for Humanitarian Advancement'
], 'Landmark'),

('social_cultural', 'HUMANITARIAN, SOCIAL & CULTURAL CONTRIBUTIONS', 'Recognition for social impact and cultural contributions to humanitarian causes', ARRAY[
  'Arts & Humanitarian Storytelling',
  'Social Impact Award',
  'Humanitarian Education & Capacity-Building',
  'Excellence in Humanitarian Advocacy'
], 'BookOpen'),

('human_rights', 'HUMAN RIGHTS & SOCIAL JUSTICE', 'Awards for human rights advocacy and social justice work', ARRAY[
  'Human Rights Defender of the Year',
  'Migration & Refugee Assistance Advocate'
], 'Scale'),

('research_development', 'HUMANITARIAN RESEARCH & DEVELOPMENT', 'Recognition for research and development in humanitarian fields', ARRAY[
  'Scientific Research & Policy for Humanitarian Impact',
  'Public Health & Crisis Management Excellence'
], 'Search')

ON CONFLICT (id) DO UPDATE SET
  cluster_title = EXCLUDED.cluster_title,
  description = EXCLUDED.description,
  awards = EXCLUDED.awards,
  icon_name = EXCLUDED.icon_name,
  updated_at = now();