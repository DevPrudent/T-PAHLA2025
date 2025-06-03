/*
  # Fix registration policies

  1. Changes
    - Safely drop and recreate policies for registrations table
    - Add checks to prevent errors when policies already exist
    - Ensure anonymous and authenticated users can create registrations
    - Ensure users can view and update their own registrations
    - Grant service role full access to registrations
*/

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Users can create own registrations" ON registrations;
DROP POLICY IF EXISTS "Allow anonymous registration submissions" ON registrations;

-- Create new policies with existence checks
DO $$
BEGIN
  -- Check if "Allow anonymous registration submissions" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'registrations' 
    AND policyname = 'Allow anonymous registration submissions'
  ) THEN
    CREATE POLICY "Allow anonymous registration submissions"
    ON registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;

  -- Check if "Users can view own registrations" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'registrations' 
    AND policyname = 'Users can view own registrations'
  ) THEN
    CREATE POLICY "Users can view own registrations"
    ON registrations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  -- Check if "Users can update own registrations" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'registrations' 
    AND policyname = 'Users can update own registrations'
  ) THEN
    CREATE POLICY "Users can update own registrations"
    ON registrations
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check if "Service role has full access" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'registrations' 
    AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access"
    ON registrations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END
$$;