import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Smartphone, ChevronsRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegistration } from '@/hooks/useRegistration';
import { usePaystack } from '@/hooks/usePaystack';
import type { RegistrationData } from '../MultiStepRegistration';
import { Separator } from '@/components/ui/separator';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onSuccess: () => void;
  registrationId?: string;
}

const paymentMethods = [
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'Credit/Debit Cards, Bank Transfer',
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
    recommended: false,
    disabled: true
  }
];

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

export const PaymentStep = ({ data, onSuccess, registrationId }: Props) => {
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const { toast } = useToast();
  const { createPayment, updatePaymentStatus } = useRegistration();
  const { initializePayment } = usePaystack();

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
        setIsProcessing(false);
        return;
      }

      toast({
        title: "Processing Payment",
        description: "Please wait while we process your payment...",
      });

      if (selectedMethod === 'paystack') {
        // Initialize Paystack payment
        const callbackUrl = `${window.location.origin}/registration/verify?reference=`;
        
        const response = await initializePayment(
          data.email,
          data.totalAmount,
          registrationId,
          data.fullName,
          callbackUrl
        );

        if (!response.success) {
          throw new Error(response.error || 'Payment initialization failed');
        }

        // Redirect to Paystack payment page
        window.location.href = response.data!.authorization_url;
        return; // Stop execution here as we're redirecting
      }

      // For other payment methods (future implementation)
      // Simulate successful payment for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      const success = await updatePaymentStatus(paymentId, 'completed', `${selectedMethod}_${Date.now()}`);
      
      if (success) {
        toast({
          title: "Payment Successful!",
          description: "Your registration has been completed successfully.",
        });

        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        toast({
          title: "Payment Update Failed",
          description: "Payment processed but status update failed. Please contact support.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
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
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          method.disabled ? 'opacity-50 cursor-not-allowed' : 
                          selectedMethod === method.id
                            ? 'border-tpahla-gold bg-tpahla-gold/5'
                            : 'border-border hover:border-tpahla-purple/30'
                        }`}
                        onClick={() => !method.disabled && setSelectedMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} disabled={method.disabled} />
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
              disabled={isProcessing}
              className="w-full bg-tpahla-darkgreen hover:bg-tpahla-emerald text-white py-6 text-lg font-semibold"
              size="lg"
            >
              {isProcessing ? (
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