/*
  # Change award_category_id column type from UUID to TEXT

  1. Changes
    - Alter `award_category_id` column in `nominations` table from UUID to TEXT
    - This allows storing string-based category IDs like "governance_impact" instead of UUIDs

  2. Security
    - No RLS changes needed as this is just a column type change
*/

-- Change the award_category_id column from UUID to TEXT
ALTER TABLE nominations 
ALTER COLUMN award_category_id TYPE TEXT;