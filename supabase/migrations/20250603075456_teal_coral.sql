/*
  # Fix registrations table RLS policies

  1. Changes
    - Remove existing conflicting policies
    - Add new comprehensive RLS policies for registrations table that properly handle:
      - Anonymous submissions
      - Authenticated user access
      - Service role access
  
  2. Security
    - Enable RLS (already enabled)
    - Add policies for:
      - Anonymous registration submissions
      - Authenticated users viewing own registrations
      - Service role full access
*/

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can create own registrations" ON registrations;
DROP POLICY IF EXISTS "Allow anonymous registration submissions" ON registrations;

-- Check if policies exist before creating them
DO $$
BEGIN
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

    -- Create "Allow anonymous registration submissions" policy (after dropping it above)
    CREATE POLICY "Allow anonymous registration submissions"
    ON registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
END
$$;