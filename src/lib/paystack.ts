// Paystack integration helper functions

/**
 * Initialize Paystack payment
 * @param options Payment options
 * @returns Promise with payment result
 */
export const initializePaystackPayment = (options: {
  email: string;
  amount: number; // in smallest currency unit (kobo for NGN, cents for USD)
  currency?: string;
  reference?: string;
  metadata?: any;
  callback: (response: any) => void;
  onClose: () => void;
}) => {
  // Ensure the Paystack script is loaded
  if (typeof window !== 'undefined' && !window.PaystackPop) {
    console.error('Paystack script not loaded');
    throw new Error('Paystack script not loaded');
  }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_4644d4ace969cf6fb98c0ef53e25b2b301e3c955',
    email: options.email,
    amount: options.amount,
    currency: options.currency || 'USD',
    ref: options.reference || `tpahla_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
    metadata: options.metadata || {},
    callback: options.callback,
    onClose: options.onClose,
  });

  handler.openIframe();
};

/**
 * Verify Paystack payment
 * @param reference Payment reference
 * @param registrationId Registration ID
 * @returns Promise with verification result
 */
export const verifyPaystackPayment = async (reference: string, registrationId: string) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      reference,
      registrationId
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Payment verification failed');
  }

  return await response.json();
};