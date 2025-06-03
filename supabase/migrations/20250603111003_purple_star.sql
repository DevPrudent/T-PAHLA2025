/*
  # Fix RLS policies for registrations table

  1. Security
    - Ensure RLS is enabled on registrations table
    - Add policies for authenticated and anonymous users
    - Add service role access policy
*/

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'registrations' 
    AND policyname = 'Allow anonymous registration submissions'
  ) THEN
    -- Policy to allow anonymous users to insert new registrations
    CREATE POLICY "Allow anonymous registration submissions" ON registrations
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END
$$;

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'registrations' 
    AND policyname = 'Users can view own registrations'
  ) THEN
    -- Policy to allow users to view their own registrations
    CREATE POLICY "Users can view own registrations" ON registrations
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'registrations' 
    AND policyname = 'Service role has full access'
  ) THEN
    -- Policy to allow service role full access
    CREATE POLICY "Service role has full access" ON registrations
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- Make sure RLS is enabled
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;