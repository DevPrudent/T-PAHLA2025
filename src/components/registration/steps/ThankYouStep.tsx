import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Mail, Calendar, MapPin } from 'lucide-react';
import type { RegistrationData } from '../MultiStepRegistration';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  data: RegistrationData;
  registrationId?: string;
}

export const ThankYouStep = ({ data, registrationId }: Props) => {
  const generateTransactionId = () => {
    return `TPAHLA2025_${Date.now().toString().slice(-8)}`;
  };

  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate and download a PDF receipt
    alert('Receipt download would start here');
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:tpahla@ihsd-ng.org?subject=TPAHLA 2025 Registration Inquiry';
  };

  // Send confirmation email when component mounts
  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (!registrationId || !data.email) return;
      
      try {
        await supabase.functions.invoke('registration-confirmation', {
          body: {
            registrationId,
            fullName: data.fullName,
            email: data.email,
            participationType: data.participationType,
            totalAmount: data.totalAmount,
            paymentStatus: 'pending_payment',
          },
        });
        console.log('Confirmation email sent successfully');
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    };
    
    sendConfirmationEmail();
  }, [registrationId, data]);

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-green-800 mb-2">
          Registration Successful!
        </h2>
        <p className="text-lg text-muted-foreground">
          Welcome to TPAHLA 2025 - Where Honor Meets Purpose
        </p>
      </div>

      {/* Registration Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Registration Confirmed</CardTitle>
          <CardDescription>Your participation in TPAHLA 2025 has been confirmed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Participant Name</div>
              <div className="font-semibold">{data.fullName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email Address</div>
              <div className="font-semibold">{data.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Transaction ID</div>
              <div className="font-mono text-sm">{registrationId?.substring(0, 8) || generateTransactionId()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Amount Paid</div>
              <div className="font-semibold text-green-700">${data.totalAmount.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-sm font-medium text-muted-foreground mb-1">Participation Type</div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              {data.participationType === 'nominee' && 'Award Nominee / Honoree'}
              {data.participationType === 'individual' && 'General Attendee'}
              {data.participationType === 'group' && 'Corporate/Institutional Group'}
              {data.participationType === 'sponsor' && 'Sponsor / Partner'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-tpahla-gold" />
            Event Details
          </CardTitle>
          <CardDescription>Important information about TPAHLA 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-tpahla-purple mt-0.5" />
              <div>
                <div className="font-medium">Event Dates</div>
                <div className="text-sm text-muted-foreground">October 15-19, 2025</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-tpahla-purple mt-0.5" />
              <div>
                <div className="font-medium">Venue</div>
                <div className="text-sm text-muted-foreground">Abuja Continental Hotel, Nigeria</div>
              </div>
            </div>
          </div>
          
          <div className="bg-tpahla-purple/5 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What's Next?</h4>
            <ul className="text-sm space-y-1">
              <li>• You will receive a detailed confirmation email within 24 hours</li>
              <li>• Accommodation and travel details will be sent 6 weeks before the event</li>
              <li>• Event program and logistics information will follow</li>
              <li>• For immediate questions, contact us at tpahla@ihsd-ng.org</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={handleDownloadReceipt}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Receipt
        </Button>
        
        <Button
          onClick={handleEmailSupport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Contact Support
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Get in touch with the TPAHLA team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Email</div>
              <div>tpahla@ihsd-ng.org</div>
              <div>2025@tpahla.africa</div>
            </div>
            <div>
              <div className="font-medium">Phone</div>
              <div>+234-802-368-6143</div>
              <div>+234-806-039-6906</div>
            </div>
            <div>
              <div className="font-medium">Website</div>
              <div>www.tpahla.africa</div>
            </div>
            <div>
              <div className="font-medium">Social Media</div>
              <div>Follow us for updates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return to Home */}
      <div className="text-center pt-6">
        <Button
          onClick={() => window.location.href = '/'}
          className="bg-tpahla-darkgreen hover:bg-tpahla-emerald"
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );
};