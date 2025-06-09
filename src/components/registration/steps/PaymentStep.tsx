import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Smartphone, ChevronsRight, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegistration } from '@/hooks/useRegistration';
import { usePaystack } from '@/hooks/usePaystack';
import type { RegistrationData } from '../MultiStepRegistration';
import { Separator } from '@/components/ui/separator';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onSuccess: () => void;
  registrationId?: string;
}

const bankDetails = [
  {
    currency: 'NGN',
    accountName: 'The Pan African Humanitarian Leadership Award (TPAHLA)/IHSD',
    accountNumber: '1229874160',
    bank: 'Zenith Bank'
  },
  {
    currency: 'USD',
    accountName: 'The Pan African Humanitarian Leadership Award (TPAHLA)/IHSD',
    accountNumber: '5075232190',
    bank: 'Zenith Bank'
  }
];

export const PaymentStep = ({ data, onUpdate, onSuccess, registrationId }: Props) => {
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { toast } = useToast();
  const { createPayment, updatePaymentStatus } = useRegistration();
  const { initializePayment, verifyPayment, isLoading: paystackLoading } = usePaystack();
  const location = useLocation();
  const navigate = useNavigate();

  // Check for payment reference in URL (for callback from Paystack)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(location.search);
      const reference = urlParams.get('reference');
      const trxref = urlParams.get('trxref');
      
      // If we have a reference, verify the payment
      if (reference && trxref) {
        setIsProcessing(true);
        try {
          const result = await verifyPayment(reference);
          
          if (result && result.success) {
            toast({
              title: "Payment Successful!",
              description: "Your registration has been completed successfully.",
            });
            setPaymentVerified(true);
            
            // Clear the URL parameters
            navigate(location.pathname, { replace: true });
            
            // Move to success step
            setTimeout(() => {
              onSuccess();
            }, 1500);
          } else {
            toast({
              title: "Payment Verification Failed",
              description: "Please try again or contact support.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          toast({
            title: "Payment Verification Error",
            description: "An error occurred while verifying your payment.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    checkPaymentStatus();
  }, [location.search, verifyPayment, toast, navigate, location.pathname, onSuccess]);

  const handlePayment = async () => {
    if (!registrationId) {
      toast({
        title: "Error",
        description: "Registration ID is missing. Please go back and complete the previous steps.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // For bank transfer, show bank details instead of processing payment
      if (selectedMethod === 'bank_transfer') {
        setShowBankDetails(true);
        setIsProcessing(false);
        return;
      }

      // Create payment record
      const paymentId = await createPayment(registrationId, selectedMethod);
      
      if (!paymentId) {
        return;
      }

      if (selectedMethod === 'paystack') {
        // Initialize Paystack payment
        await initializePayment({
          amount: data.totalAmount,
          email: data.email,
          registrationId: registrationId,
          currency: 'USD', // Explicitly set currency to USD
          metadata: {
            name: data.fullName,
            registration_type: data.participationType,
          },
          onSuccess: (response) => {
            console.log('Payment initialized successfully:', response);
            // The user will be redirected to Paystack's payment page
          },
          onError: (error) => {
            console.error('Payment initialization error:', error);
            toast({
              title: "Payment Failed",
              description: "There was an error initializing your payment. Please try again.",
              variant: "destructive",
            });
          }
        });
      } else {
        // For other payment methods (e.g., flutterwave)
        toast({
          title: "Payment Method Not Implemented",
          description: "This payment method is not fully implemented yet. Please use Paystack or Bank Transfer.",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankTransferComplete = () => {
    toast({
      title: "Bank Transfer Instructions Sent",
      description: "Please complete your transfer and allow 24-48 hours for verification.",
    });
    onSuccess();
  };

  // If payment is already verified, show success message
  if (paymentVerified) {
    return (
      <div className="space-y-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-2xl font-bold">Payment Successful!</h3>
        <p className="text-muted-foreground">
          Your payment has been verified and your registration is complete.
        </p>
        <p className="text-sm text-muted-foreground">
          You will be redirected to the confirmation page shortly...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Complete Your Payment</h3>
        <p className="text-muted-foreground">
          Secure payment processing for your TPAHLA 2025 registration
        </p>
      </div>

      {/* Payment Summary */}
      <Card className="bg-tpahla-gold/10 border-tpahla-gold">
        <CardHeader>
          <CardTitle className="text-tpahla-gold">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">{data.fullName}</span>
              <span>{data.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Registration Type:</span>
              <span className="font-medium">
                {data.participationType === 'nominee' && 'Award Nominee'}
                {data.participationType === 'individual' && 'General Attendee'}
                {data.participationType === 'group' && 'Group Registration'}
                {data.participationType === 'sponsor' && 'Sponsor/Partner'}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-tpahla-gold text-2xl">
                ${data.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {!showBankDetails ? (
        <>
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
              <CardDescription>
                Select your preferred payment gateway. All methods support major cards and local payment options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                <div className="space-y-3">
                  {[
                    {
                      id: 'paystack',
                      name: 'Paystack',
                      description: 'Credit/Debit Cards, Bank Transfer (USD)',
                      icon: CreditCard,
                      recommended: true
                    },
                    {
                      id: 'bank_transfer',
                      name: 'Bank Transfer',
                      description: 'Manual bank transfer (requires verification)',
                      icon: Building,
                      recommended: false
                    },
                    {
                      id: 'flutterwave',
                      name: 'Flutterwave',
                      description: 'Multiple payment options',
                      icon: Smartphone,
                      recommended: false
                    }
                  ].map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedMethod === method.id
                            ? 'border-tpahla-gold bg-tpahla-gold/5'
                            : 'border-border hover:border-tpahla-purple/30'
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <IconComponent className="w-5 h-5 text-tpahla-purple" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={method.id} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            {method.recommended && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-green-800 mb-2">🔒 Secure Payment</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• SSL encrypted payment processing</li>
                <li>• PCI DSS compliant payment gateways</li>
                <li>• Your payment information is never stored on our servers</li>
                <li>• Instant payment confirmation and receipt</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Button */}
          <div className="pt-4">
            <Button
              onClick={handlePayment}
              disabled={isProcessing || paystackLoading}
              className="w-full bg-tpahla-darkgreen hover:bg-tpahla-emerald text-white py-6 text-lg font-semibold"
              size="lg"
            >
              {isProcessing || paystackLoading ? (
                <>
                  <Loader2 className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ${data.totalAmount.toLocaleString()} - Complete Registration
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        /* Bank Transfer Details */
        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
            <CardDescription>
              Please transfer the exact amount to one of the following accounts and include your name and email as reference.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {bankDetails.map((account, index) => (
              <div key={index} className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">{account.currency} Account</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">{account.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium">{account.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-medium">{account.bank}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Important Instructions</h4>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Include your full name and email as payment reference</li>
                <li>• Transfer the exact amount: ${data.totalAmount.toLocaleString()}</li>
                <li>• After making the transfer, please email proof of payment to payments@tpahla.org</li>
                <li>• Your registration will be confirmed within 24-48 hours after verification</li>
              </ul>
            </div>

            <Separator />

            <Button 
              onClick={handleBankTransferComplete} 
              className="w-full bg-tpahla-darkgreen hover:bg-tpahla-emerald text-white"
            >
              <ChevronsRight className="mr-2 h-4 w-4" />
              I've Noted the Details - Continue
            </Button>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-center text-muted-foreground">
        By completing this payment, you agree to the TPAHLA 2025 terms and conditions. 
        Registration fees are non-refundable but transferable up to September 15, 2025.
      </p>
    </div>
  );
};