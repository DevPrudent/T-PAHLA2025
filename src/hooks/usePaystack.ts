import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaystackConfig {
  amount: number;
  email: string;
  registrationId: string;
  currency?: 'NGN' | 'USD';
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
    currency = 'NGN',
    metadata = {},
    onSuccess,
    onError
  }: PaystackConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const origin = window.location.origin;
      const callbackUrl = `${origin}/payment-callback`;

      const { data, error: functionError } = await supabase.functions.invoke('process-payment', {
        body: {
          registrationId,
          amount,
          email,
          currency,
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

      window.location.href = data.authorization_url;

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err);
      toast.error(`Payment initialization failed: ${err.message}`);
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
