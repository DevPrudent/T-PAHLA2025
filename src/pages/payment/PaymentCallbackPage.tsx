import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Home } from 'lucide-react';
import { usePaystack } from '@/hooks/usePaystack';
import { toast } from 'sonner';

const PaymentCallbackPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyPayment, isLoading } = usePaystack();

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const reference = urlParams.get('reference');
        const trxref = urlParams.get('trxref');
        
        if (!reference || !trxref) {
          throw new Error('Payment reference not found in URL');
        }
        
        // Verify the payment
        const result = await verifyPayment(reference);
        
        if (result && result.success) {
          setPaymentDetails(result);
          setStatus('success');
          toast.success('Payment successful!');
        } else {
          setStatus('error');
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        toast.error('An error occurred while verifying your payment');
      }
    };
    
    verifyTransaction();
  }, [location.search, verifyPayment]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewRegistration = () => {
    // Navigate to a registration details page if you have one
    if (paymentDetails && paymentDetails.registration_id) {
      navigate(`/registration-details?id=${paymentDetails.registration_id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && 'Verifying Payment...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'error' && 'Payment Failed'}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' && 'Please wait while we verify your payment'}
            {status === 'success' && 'Your registration for TPAHLA 2025 is confirmed'}
            {status === 'error' && 'We could not verify your payment. Please try again or contact support.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {status === 'loading' && (
            <Loader2 className="h-16 w-16 text-tpahla-gold animate-spin mb-4" />
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              {paymentDetails && (
                <div className="w-full mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium">${paymentDetails.paystack_data?.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference:</span>
                      <span className="font-medium">{paymentDetails.paystack_data?.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">
                        {paymentDetails.paystack_data?.transaction_date ? 
                          new Date(paymentDetails.paystack_data.transaction_date).toLocaleString() : 
                          new Date().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium text-green-600">Completed</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {status === 'error' && (
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={handleGoHome}
              className="flex-1"
              variant="outline"
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
            
            {status === 'success' && (
              <Button 
                onClick={handleViewRegistration}
                className="flex-1 bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90"
              >
                View Registration
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallbackPage;