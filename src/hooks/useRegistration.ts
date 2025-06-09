import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { RegistrationData } from '@/components/registration/MultiStepRegistration';
import type { Database } from '@/integrations/supabase/types';
import { useEmailSender } from './useEmailSender';

type RegistrationInsert = Database['public']['Tables']['registrations']['Insert'];

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { sendRegistrationConfirmation } = useEmailSender();

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

      // Send registration confirmation email
      try {
        await sendRegistrationConfirmation({
          registrationId: registration.id,
          fullName: data.fullName,
          email: data.email,
          participationType: data.participationType!,
          totalAmount: data.totalAmount,
          paymentStatus: 'pending_payment',
        });
      } catch (emailError) {
        console.error('Error sending registration confirmation email:', emailError);
        // Don't block the flow if email fails
      }

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

  const updatePaymentStatus = async (registrationId: string, status: string, transactionRef?: string) => {
    try {
      // Update registration status
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ 
          registration_status: status === 'completed' ? 'paid' : 'pending_payment',
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (updateError) {
        console.error('Registration status update error:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Payment status update error:', error);
      return false;
    }
  };

  return {
    saveRegistration,
    updatePaymentStatus,
    isLoading,
  };
};