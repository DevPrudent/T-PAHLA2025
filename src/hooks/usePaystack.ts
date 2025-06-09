import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaystackConfig {
  email: string;
  amount: number; // in kobo (multiply by 100)
  publicKey: string;
  reference?: string;
  metadata?: Record<string, any>;
  callback?: (response: any) => void;
  onClose?: () => void;
}

interface UsePaystackProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export const usePaystack = ({ onSuccess, onError, onClose }: UsePaystackProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializePayment = async (config: Omit<PaystackConfig, 'publicKey'>) => {
    setIsLoading(true);
    
    try {
      // Get Paystack public key from environment variable
      const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      
      if (!paystackPublicKey) {
        throw new Error('Paystack public key not found. Please check your environment variables.');
      }
      
      // Load Paystack script if not already loaded
      if (!window.PaystackPop) {
        await loadPaystackScript();
      }
      
      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: config.email,
        amount: config.amount * 100, // Convert to kobo (Nigerian currency)
        ref: config.reference || generateReference(),
        metadata: config.metadata || {},
        callback: (response: any) => {
          setIsLoading(false);
          
          // Call the provided callback
          if (config.callback) {
            config.callback(response);
          }
          
          // Call the hook's onSuccess callback
          if (onSuccess) {
            onSuccess(response);
          }
          
          toast({
            title: "Payment Successful",
            description: `Transaction reference: ${response.reference}`,
          });
        },
        onClose: () => {
          setIsLoading(false);
          
          // Call the provided onClose
          if (config.onClose) {
            config.onClose();
          }
          
          // Call the hook's onClose callback
          if (onClose) {
            onClose();
          }
          
          toast({
            title: "Payment Cancelled",
            description: "You have cancelled the payment",
            variant: "destructive",
          });
        },
      });
      
      // Open the payment modal
      handler.openIframe();
    } catch (error) {
      setIsLoading(false);
      console.error('Paystack initialization error:', error);
      
      // Call the hook's onError callback
      if (onError) {
        onError(error);
      }
      
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    }
  };
  
  // Function to verify payment with Supabase Edge Function
  const verifyPayment = async (reference: string, registrationId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { reference, registrationId },
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  return {
    initializePayment,
    verifyPayment,
    isLoading,
  };
};

// Helper function to load Paystack script
const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
};

// Helper function to generate a unique reference
const generateReference = (): string => {
  return `TPAHLA_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
};

// Add Paystack to Window interface
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}