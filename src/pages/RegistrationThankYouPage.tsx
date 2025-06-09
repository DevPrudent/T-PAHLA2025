import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function RegistrationThankYouPage() {
  const generateTransactionId = () => {
    return `TPAHLA2025_${Date.now().toString().slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Registration Successful!</CardTitle>
          <CardDescription>
            Welcome to TPAHLA 2025 - Where Honor Meets Purpose
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Transaction ID:</div>
              <div className="font-mono">{generateTransactionId()}</div>
              <div>Status:</div>
              <div className="text-green-600 font-medium">Completed</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">What's Next?</h3>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Confirmation Email</p>
                <p className="text-sm text-muted-foreground">
                  You will receive a detailed confirmation email within 24 hours with your registration details.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Save the Date</p>
                <p className="text-sm text-muted-foreground">
                  Mark your calendar for October 15-19, 2025. Event program and logistics information will be sent 6 weeks before the event.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Venue Information</p>
                <p className="text-sm text-muted-foreground">
                  The event will take place at the Abuja Continental Hotel, Nigeria. Accommodation and travel details will be shared closer to the event date.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-tpahla-gold/10 p-4 rounded-lg border border-tpahla-gold/20">
            <p className="text-center text-sm">
              For any questions or special requests, please contact us at <a href="mailto:2025@tpahla.africa" className="text-tpahla-gold hover:underline">2025@tpahla.africa</a> or <a href="https://wa.me/2348104906878" target="_blank" rel="noopener noreferrer" className="text-tpahla-gold hover:underline">+234-810-490-6878 (WhatsApp)</a>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            
            <Link to="/">
              <Button className="w-full sm:w-auto">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegistrationThankYouPage;