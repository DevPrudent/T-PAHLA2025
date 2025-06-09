import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { RegistrationData } from '@/components/registration/MultiStepRegistration';
import type { Database } from '@/integrations/supabase/types';

type RegistrationInsert = Database['public']['Tables']['registrations']['Insert'];

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveRegistration = async (data: RegistrationData): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      // Prepare registration data for database
      const registrationData: RegistrationInsert = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        organization: data.organization || null,
        position: data.position || null,
        participation_type: data.participationType!,
        nominee_category: data.nomineeCategory || null,
        tier: data.tier || null,
        group_name: data.groupName || null,
        group_type: data.groupType || null,
        number_of_seats: data.numberOfSeats || null,
        sponsorship_type: data.sponsorshipType || null,
        custom_amount: data.customAmount || null,
        add_ons: data.addOns || [],
        total_amount: data.totalAmount,
        special_requests: data.specialRequests || null,
        registration_status: 'pending_payment',
        submitted_at: new Date().toISOString(),
      };

      // Insert registration
      const { data: registration, error } = await supabase
        .from('registrations')
        .insert(registrationData)
        .select()
        .single();

      if (error) {
        console.error('Registration save error:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save registration. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Registration Saved",
        description: "Your registration has been saved successfully.",
      });

      return registration.id;

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createPayment = async (registrationId: string, paymentMethod: string): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      // Get registration details
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .select('total_amount')
        .eq('id', registrationId)
        .single();

      if (regError || !registration) {
        toast({
          title: "Error",
          description: "Failed to retrieve registration details.",
          variant: "destructive",
        });
        return null;
      }

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          registration_id: registrationId,
          amount: registration.total_amount,
          currency: 'USD', // Changed from NGN to USD
          payment_method: paymentMethod,
          payment_status: 'pending',
          transaction_id: `TPAHLA2025_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      return payment.id;

    } catch (error) {
      console.error('Payment creation error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during payment setup.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: 'completed' | 'failed', transactionRef?: string) => {
    try {
      const updateData: any = {
        payment_status: status,
        paid_at: status === 'completed' ? new Date().toISOString() : null,
      };

      if (transactionRef) {
        updateData.gateway_reference = transactionRef;
      }

      // Update payment status
      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId);

      if (error) {
        console.error('Payment status update error:', error);
        return false;
      }

      // If payment completed, update registration status
      if (status === 'completed') {
        const { data: payment } = await supabase
          .from('payments')
          .select('registration_id')
          .eq('id', paymentId)
          .single();

        if (payment) {
          await supabase
            .from('registrations')
            .update({ registration_status: 'paid' })
            .eq('id', payment.registration_id);
        }
      }

      return true;
    } catch (error) {
      console.error('Payment status update error:', error);
      return false;
    }
  };

  return {
    saveRegistration,
    createPayment,
    updatePaymentStatus,
    isLoading,
  };
};