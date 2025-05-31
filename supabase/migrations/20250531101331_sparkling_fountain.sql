-- Create RLS policies for payments table

-- First drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous payment creation for registrations" ON payments;
DROP POLICY IF EXISTS "Users can view payments for their registrations" ON payments;
DROP POLICY IF EXISTS "Service role has full access to payments" ON payments;
DROP POLICY IF EXISTS "Service role can manage payments" ON payments;

-- Create new policies
DO $$
BEGIN
    -- Allow anonymous users to create payments for pending registrations
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payments' 
        AND policyname = 'Allow anonymous payment creation for registrations'
    ) THEN
        CREATE POLICY "Allow anonymous payment creation for registrations"
        ON payments
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM registrations r
                WHERE r.id = payments.registration_id
                AND r.registration_status = 'pending_payment'
            )
        );
    END IF;

    -- Allow users to view payments for their own registrations
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payments' 
        AND policyname = 'Users can view payments for their registrations'
    ) THEN
        CREATE POLICY "Users can view payments for their registrations"
        ON payments
        FOR SELECT
        TO anon, authenticated
        USING (
            EXISTS (
                SELECT 1 FROM registrations r
                WHERE r.id = payments.registration_id
                AND (
                    (r.user_id = auth.uid() AND auth.uid() IS NOT NULL)
                    OR
                    (r.user_id IS NULL AND r.registration_status = 'pending_payment')
                )
            )
        );
    END IF;

    -- Service role has full access to payments
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payments' 
        AND policyname = 'Service role has full access to payments'
    ) THEN
        CREATE POLICY "Service role has full access to payments"
        ON payments
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
    END IF;
END
$$;

-- Ensure RLS is enabled on the payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;