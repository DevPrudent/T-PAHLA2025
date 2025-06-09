import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaystackInitializeResponse {
  success: boolean;
  data?: {
    authorization_url: string;
    reference: string;
    payment_id: string;
  };
  error?: string;
  details?: any;
}

interface PaystackVerifyResponse {
  success: boolean;
  data?: {
    status: string;
    reference: string;
    transaction: any;
  };
  error?: string;
  details?: any;
}

export const usePaystack = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = async (
    email: string,
    amount: number,
    registrationId: string,
    fullName: string,
    callbackUrl: string
  ): Promise<PaystackInitializeResponse> => {
    setIsLoading(true);
    
    try {
      // Get the Supabase URL from environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error("Supabase URL is not configured");
      }

      // Call the Supabase Edge Function to initialize payment
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          email,
          amount,
          registrationId,
          fullName,
          callbackUrl
        },
      });

      if (error) {
        console.error('Payment initialization error:', error);
        throw new Error(`Edge Function error: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      return data;
    } catch (error) {
      console.error('Payment initialization error:', error);
      return {
        success: false,
        error: error.message || 'Payment initialization failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string): Promise<PaystackVerifyResponse> => {
    setIsLoading(true);
    
    try {
      // Call the Supabase Edge Function to verify payment
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { reference },
      });

      if (error) {
        console.error('Payment verification error:', error);
        throw new Error(`Edge Function error: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error.message || 'Payment verification failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initializePayment,
    verifyPayment,
    isLoading
  };
};