/*
  # Fix Award Category ID Type Mismatch

  1. Changes
    - Change award_categories.id from UUID to TEXT
    - Change nominations.award_category_id from UUID to TEXT
    - Update foreign key constraint to work with TEXT type
    - Handle any existing data gracefully

  2. Security
    - Maintain existing RLS policies
    - Preserve all existing constraints where possible
*/

-- First, drop the foreign key constraint temporarily
ALTER TABLE nominations DROP CONSTRAINT IF EXISTS nominations_award_category_id_fkey;

-- Change the award_categories.id column type from UUID to TEXT
ALTER TABLE award_categories ALTER COLUMN id TYPE TEXT;

-- Change the nominations.award_category_id column type from UUID to TEXT
ALTER TABLE nominations ALTER COLUMN award_category_id TYPE TEXT;

-- Recreate the foreign key constraint with the new TEXT type
ALTER TABLE nominations 
ADD CONSTRAINT nominations_award_category_id_fkey 
FOREIGN KEY (award_category_id) REFERENCES award_categories(id);