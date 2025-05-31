-- Enable RLS on payments table if not already enabled
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
    -- Check and drop policies
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payments' 
        AND policyname = 'Allow anonymous payment creation for registrations'
    ) THEN
        DROP POLICY "Allow anonymous payment creation for registrations" ON payments;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payments' 
        AND policyname = 'Users can view payments for their registrations'
    ) THEN
        DROP POLICY "Users can view payments for their registrations" ON payments;
    END IF;
END
$$;

-- Add policy to allow anonymous users to create payments
CREATE POLICY "Allow anonymous payment creation for registrations"
ON public.payments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM registrations r
    WHERE 
      r.id = registration_id 
      AND r.registration_status = 'pending_payment'
  )
);

-- Add policy to allow users to view their own payments
CREATE POLICY "Users can view payments for their registrations"
ON public.payments
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM registrations r
    WHERE 
      r.id = registration_id 
      AND (
        (r.user_id = auth.uid() AND auth.uid() IS NOT NULL)
        OR 
        (r.user_id IS NULL AND r.registration_status = 'pending_payment')
      )
  )
);

-- Add policy for service role to have full access
CREATE POLICY "Service role has full access to payments"
ON public.payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);