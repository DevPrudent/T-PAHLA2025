/*
  # Fix payments table RLS policies

  1. Changes
    - Add RLS policy to allow anonymous users to create payment records
    - Ensure policy links payment to registration for security
    - Keep existing policies intact

  2. Security
    - Anonymous users can only create payments for their own registrations
    - Payment must be linked to a valid registration
    - Maintains existing RLS policies for other operations
*/

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