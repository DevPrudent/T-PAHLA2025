import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
}

export const useEmailSender = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendEmail = async (options: EmailOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: options,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: any) {
      console.error('Error sending email:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendRegistrationConfirmation = async (options: {
    registrationId: string;
    fullName: string;
    email: string;
    participationType: string;
    totalAmount: number;
    paymentStatus: string;
    eventDate?: string;
    eventLocation?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('registration-confirmation', {
        body: options,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: any) {
      console.error('Error sending registration confirmation:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPaymentConfirmation = async (options: {
    paymentId: string;
    registrationId: string;
    fullName: string;
    email: string;
    amount: number;
    transactionReference: string;
    paymentMethod: string;
    participationType: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('payment-confirmation', {
        body: options,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: any) {
      console.error('Error sending payment confirmation:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendContactFormEmail = async (options: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('contact-form-email', {
        body: options,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: any) {
      console.error('Error sending contact form email:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    sendRegistrationConfirmation,
    sendPaymentConfirmation,
    sendContactFormEmail,
    isLoading,
    error,
  };
};