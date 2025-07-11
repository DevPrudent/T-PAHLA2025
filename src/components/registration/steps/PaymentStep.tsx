import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, ChevronsRight, Loader2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegistration } from '@/hooks/useRegistration';
import type { RegistrationData } from '../MultiStepRegistration';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onSuccess: () => void;
  registrationId?: string;
}

const paymentMethods = [
  {
    id: 'external',
    name: 'Angel Communities',
    description: 'Secure payment via Angel Communities platform',
    icon: CreditCard,
    recommended: true
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Manual bank transfer (requires verification)',
    icon: Building,
    recommended: false
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
  const [selectedMethod, setSelectedMethod] = useState('flutterwave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const { toast } = useToast();
  const { createPayment, updatePaymentStatus } = useRegistration();
  const navigate = useNavigate();

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
        title: "Redirecting to Payment",
        description: "You will be redirected to complete your payment...",
      });

      if (selectedMethod === 'external') {
        // Redirect to external payment URL
        window.location.href = "https://www.angelcommunities.org/event/ticket-booking/the-pan-african-humanitarian-leadership-award-2025";
      } else if (selectedMethod === 'bank_transfer') {
        setShowBankDetails(true);
        setIsProcessing(false);
      } else {
        // This should not happen since we only have external and bank_transfer
        toast({
          title: "Payment Method Not Implemented",
          description: "This payment method is not fully implemented yet. Please try Angel Communities instead.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleBankTransferComplete = () => {
    toast({
      title: "Bank Transfer Instructions Sent",
      description: "Please complete your transfer and allow 24-48 hours for verification.",
    });
    
    // Redirect to registration details page
    navigate(`/registration-details?id=${registrationId}`);
  };

  const handleShowQrCode = () => {
    setShowQrCode(true);
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
          <Card className={showQrCode ? "hidden" : ""}>
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

          {/* QR Code Display */}
          {showQrCode && (
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code to Pay</CardTitle>
                <CardDescription>
                  Scan this QR code with your phone to complete payment on Angel Communities platform
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-4">
                  <img 
                    src="/lovable-uploads/WhatsApp Image 2025-06-30 at 17.05.51 (1).jpeg" 
                    alt="Payment QR Code" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Or click the button below to open the payment page directly
                </p>
                <Button 
                  onClick={() => window.location.href = "https://www.angelcommunities.org/event/ticket-booking/the-pan-african-humanitarian-leadership-award-2025"}
                  className="w-full bg-tpahla-darkgreen hover:bg-tpahla-emerald text-white"
                >
                  Open Payment Page
                </Button>
              </CardContent>
            </Card>
          )}

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
                  Redirecting to Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ${data.totalAmount.toLocaleString()} - Complete Registration
                </>
              )}
            </Button>
            <Button
              onClick={handleShowQrCode}
              disabled={isProcessing}
              className="w-full mt-2 border-tpahla-gold text-tpahla-gold hover:bg-tpahla-gold/10"
              variant="outline"
              size="lg"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Show QR Code for Payment
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