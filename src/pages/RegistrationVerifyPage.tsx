import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { usePaystack } from '@/hooks/usePaystack';
import { toast } from 'sonner';

const RegistrationVerifyPage = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyPayment } = usePaystack();

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        // Get reference from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const reference = searchParams.get('reference') || searchParams.get('trxref');
        
        if (!reference) {
          throw new Error('Transaction reference not found in URL');
        }

        // Verify payment with Paystack
        const response = await verifyPayment(reference);
        
        if (!response.success) {
          throw new Error(response.error || 'Payment verification failed');
        }

        setTransactionDetails(response.data);
        setVerificationStatus('success');
        
        toast.success('Payment verified successfully!');
        
        // Redirect to thank you page after 3 seconds
        setTimeout(() => {
          navigate('/registration/thank-you');
        }, 3000);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        toast.error(`Payment verification failed: ${error.message}`);
      }
    };

    verifyTransaction();
  }, [location, navigate, verifyPayment]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {verificationStatus === 'loading' && 'Verifying Payment...'}
            {verificationStatus === 'success' && 'Payment Successful!'}
            {verificationStatus === 'error' && 'Payment Verification Failed'}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === 'loading' && 'Please wait while we verify your payment...'}
            {verificationStatus === 'success' && 'Your registration has been confirmed.'}
            {verificationStatus === 'error' && 'We could not verify your payment. Please contact support.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {verificationStatus === 'loading' && (
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          )}
          
          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center mb-4">
                Thank you for your payment. Your registration for TPAHLA 2025 has been confirmed.
              </p>
              <p className="text-sm text-muted-foreground text-center mb-6">
                You will be redirected to the thank you page shortly...
              </p>
              <Button onClick={() => navigate('/registration/thank-you')}>
                Continue to Thank You Page
              </Button>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-destructive mb-4" />
              <p className="text-center mb-4">
                We encountered an issue while verifying your payment. If you believe this is an error, please contact our support team.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/register')}>
                  Back to Registration
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationVerifyPage;