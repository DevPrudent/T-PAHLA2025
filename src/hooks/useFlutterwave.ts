import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FlutterwaveConfig {
  amount: number;
  email: string;
  registrationId: string;
  currency?: string;
  metadata?: Record<string, any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export const useFlutterwave = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initializePayment = async ({
    amount,
    email,
    registrationId,
    currency = 'USD',
    metadata = {},
    onSuccess,
    onError
  }: FlutterwaveConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const origin = window.location.origin;
      const callbackUrl = `${origin}/payment-callback`;

      // Create payment record and get payment details from Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('process-flutterwave-payment', {
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

      if (!data || !data.payment_id) {
        throw new Error('Failed to initialize payment: No payment ID returned');
      }

      // Configure Flutterwave
      const flutterwaveConfig = {
        public_key: data.public_key,
        tx_ref: data.tx_ref,
        amount,
        currency: 'USD',
        payment_options: 'card',
        redirect_url: callbackUrl,
        customer: {
          email,
          name: metadata.name || 'Customer',
          phonenumber: metadata.phone || '',
        },
        customizations: {
          title: 'TPAHLA 2025 Registration',
          description: 'Secure payment for humanitarian award participation',
          logo: `${origin}/lovable-uploads/483603d8-00de-4ab9-a335-36a998ddd55f.png`,
        },
        subaccounts: [
          {
            id: data.subaccount_id || "RS_288BB910A3D1E6E93364D51AC9FDA928", // Use the one from the server or fallback
            transaction_charge_type: "percentage",
            transaction_charge: 100 // 100% of payment goes to subaccount
          }
        ],
        callback: function(response: any) {
          // Verify the transaction on the backend
          verifyPayment(response.transaction_id, data.payment_id)
            .then(verificationResult => {
              if (verificationResult && verificationResult.success) {
                if (onSuccess) onSuccess(verificationResult);
                toast.success('Payment successful!');
              } else {
                throw new Error('Payment verification failed');
              }
            })
            .catch(err => {
              console.error('Verification error:', err);
              toast.error(`Payment verification failed: ${err.message}`);
              if (onError) onError(err);
            });
        },
        onclose: function() {
          setIsLoading(false);
          toast.info('Payment window closed');
        }
      };

      // @ts-ignore - Flutterwave is loaded from CDN
      if (window.FlutterwaveCheckout) {
        // @ts-ignore
        window.FlutterwaveCheckout(flutterwaveConfig);
      } else {
        throw new Error('Flutterwave SDK not loaded');
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

  const verifyPayment = async (transactionId: string, paymentId: string) => {
    try {
      const { data, error: functionError } = await supabase.functions.invoke('verify-flutterwave-payment', {
        body: { 
          transaction_id: transactionId,
          payment_id: paymentId
        }
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
      toast.error(`Payment verification failed: ${err.message}`);
      return null;
    }
  };

  return {
    initializePayment,
    verifyPayment,
    isLoading,
    error
  };
};