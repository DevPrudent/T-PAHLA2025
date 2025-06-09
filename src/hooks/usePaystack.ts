import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaystackConfig {
  amount: number;
  email: string;
  registrationId: string;
  metadata?: Record<string, any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export const usePaystack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initializePayment = async ({
    amount,
    email,
    registrationId,
    metadata = {},
    onSuccess,
    onError
  }: PaystackConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the current origin for the callback URL
      const origin = window.location.origin;
      const callbackUrl = `${origin}/payment-callback`;

      // Call our Supabase Edge Function to initialize payment
      const { data, error: functionError } = await supabase.functions.invoke('process-payment', {
        body: {
          registrationId,
          amount,
          email,
          callbackUrl,
          metadata: {
            ...metadata,
            custom_fields: [
              { display_name: "Registration ID", variable_name: "registration_id", value: registrationId },
              { display_name: "Event", variable_name: "event", value: "TPAHLA 2025" }
            ]
          }
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || !data.authorization_url) {
        throw new Error('Failed to initialize payment: No authorization URL returned');
      }

      // Open Paystack checkout in a new window/tab
      window.location.href = data.authorization_url;

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err);
      
      // Show error toast
      toast.error(`Payment initialization failed: ${err.message}`);
      
      // Call error callback if provided
      if (onError) {
        onError(err);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call our Supabase Edge Function to verify payment
      const { data, error: functionError } = await supabase.functions.invoke('verify-payment', {
        body: { reference }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || !data.success) {
        throw new Error('Payment verification failed');
      }

      return data;
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setError(err);
      toast.error(`Payment verification failed: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initializePayment,
    verifyPayment,
    isLoading,
    error
  };
};