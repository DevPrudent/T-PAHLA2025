-- Enable RLS on registrations table if not already enabled
ALTER TABLE IF EXISTS registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
    -- Check and drop "Allow anonymous registration submissions" policy
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'registrations' 
        AND policyname = 'Allow anonymous registration submissions'
    ) THEN
        DROP POLICY "Allow anonymous registration submissions" ON registrations;
    END IF;

    -- Check and drop "Users can view own registrations" policy
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'registrations' 
        AND policyname = 'Users can view own registrations'
    ) THEN
        DROP POLICY "Users can view own registrations" ON registrations;
    END IF;

    -- Check and drop "Service role has full access" policy
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'registrations' 
        AND policyname = 'Service role has full access'
    ) THEN
        DROP POLICY "Service role has full access" ON registrations;
    END IF;
END
$$;

-- Policy to allow anonymous users to insert new registrations
CREATE POLICY "Allow anonymous registration submissions" ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy to allow users to view their own registrations
CREATE POLICY "Users can view own registrations" ON registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow service role full access
CREATE POLICY "Service role has full access" ON registrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);