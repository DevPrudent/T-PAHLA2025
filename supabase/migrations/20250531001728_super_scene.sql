-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can create own registrations" ON registrations;
DROP POLICY IF EXISTS "Allow anonymous registration submissions" ON registrations;
DROP POLICY IF EXISTS "Users can view own registrations" ON registrations;
DROP POLICY IF EXISTS "Users can update own registrations" ON registrations;
DROP POLICY IF EXISTS "Service role has full access" ON registrations;

-- Create new policies
CREATE POLICY "Allow anonymous registration submissions"
ON registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy for public to view registrations (needed for anonymous users)
CREATE POLICY "Public can view registrations"
ON registrations
FOR SELECT
TO anon, authenticated
USING (true);

-- Create policy for users to update their own registrations
CREATE POLICY "Users can update own registrations"
ON registrations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for service role to have full access
CREATE POLICY "Service role has full access"
ON registrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);