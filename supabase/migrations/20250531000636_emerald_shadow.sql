/*
  # Add RLS policies for registrations table

  1. Security Changes
    - Enable RLS on registrations table
    - Add policy to allow anonymous users to insert new registrations
    - Add policy to allow authenticated users to view their own registrations
    - Add policy to allow service role to manage all registrations

  This migration ensures that:
    - Anyone can submit a new registration (required for public registration form)
    - Users can only view their own registrations once authenticated
    - Service role maintains full access for administrative purposes
*/

-- Enable RLS on registrations table if not already enabled
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

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