
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { RegistrationData } from '../MultiStepRegistration';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
  onSuccess: () => void;
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
    id: 'flutterwave',
    name: 'Flutterwave',
    description: 'Multiple payment options',
    icon: Building,
    recommended: false
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'International cards',
    icon: Smartphone,
    recommended: false
  }
];

export const PaymentStep = ({ data, onSuccess }: Props) => {
  const [selectedMethod, setSelectedMethod] = useState('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      toast({
        title: "Processing Payment",
        description: "Please wait while we process your payment...",
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      const transactionId = `TPAHLA2025_${Date.now()}`;
      
      toast({
        title: "Payment Successful!",
        description: `Transaction ID: ${transactionId}`,
      });

      // In real implementation, you would:
      // 1. Call your payment gateway (Paystack, Flutterwave, or Stripe)
      // 2. Handle the response
      // 3. Save the transaction details to your database
      // 4. Send confirmation email

      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
          disabled={isProcessing}
          className="w-full bg-tpahla-darkgreen hover:bg-tpahla-emerald text-white py-6 text-lg font-semibold"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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

      <p className="text-xs text-center text-muted-foreground">
        By completing this payment, you agree to the TPAHLA 2025 terms and conditions. 
        Registration fees are non-refundable but transferable up to September 15, 2025.
      </p>
    </div>
  );
};
