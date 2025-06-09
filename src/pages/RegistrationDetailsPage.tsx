import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building, 
  Download,
  Printer,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'sonner';

const RegistrationDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const registrationId = searchParams.get('id');
  const [registration, setRegistration] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      if (!registrationId) {
        setError('No registration ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch registration details
        const { data: registrationData, error: registrationError } = await supabase
          .from('registrations')
          .select('*')
          .eq('id', registrationId)
          .single();

        if (registrationError) throw registrationError;
        setRegistration(registrationData);

        // Fetch payment details
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('registration_id', registrationId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!paymentError && paymentData && paymentData.length > 0) {
          setPayment(paymentData[0]);
        }
      } catch (err) {
        console.error('Error fetching registration details:', err);
        setError(err.message || 'Failed to load registration details');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [registrationId]);

  const handlePrint = () => {
    window.print();
  };

  const getParticipationTypeDisplay = (type) => {
    switch (type) {
      case 'nominee': return 'Award Nominee / Honoree';
      case 'individual': return 'General Attendee';
      case 'group': return 'Corporate/Institutional Group';
      case 'sponsor': return 'Sponsor / Partner';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-tpahla-gold mx-auto mb-4" />
          <p className="text-tpahla-text-secondary">Loading registration details...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-tpahla-neutral rounded-lg shadow-lg border border-tpahla-gold/20">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-tpahla-gold mb-2">Registration Not Found</h2>
          <p className="text-tpahla-text-secondary mb-6">
            {error || "We couldn't find the registration details you're looking for."}
          </p>
          <Link to="/">
            <Button className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <Button variant="outline" className="print:hidden">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="print:hidden">
              <Button variant="outline" onClick={handlePrint} className="mr-2">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <Card className="mb-8 border-tpahla-gold/20">
            <CardHeader className="bg-tpahla-darkgreen text-white border-b border-tpahla-gold/20">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-tpahla-gold text-2xl">Registration Confirmation</CardTitle>
                  <CardDescription className="text-tpahla-text-light">
                    TPAHLA 2025 - The Pan-African Humanitarian Leadership Award
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-tpahla-text-light">Registration ID</p>
                  <p className="font-mono text-tpahla-gold">{registration.id}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-tpahla-gold mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Full Name</p>
                        <p className="text-tpahla-text-secondary">{registration.full_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-tpahla-text-secondary">{registration.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-tpahla-text-secondary">{registration.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Country</p>
                        <p className="text-tpahla-text-secondary">{registration.country}</p>
                      </div>
                    </div>
                    {registration.organization && (
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Organization</p>
                          <p className="text-tpahla-text-secondary">{registration.organization}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-tpahla-gold mb-4">Registration Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Registration Date</p>
                        <p className="text-tpahla-text-secondary">
                          {registration.created_at ? format(new Date(registration.created_at), 'PPP') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Participation Type</p>
                        <Badge className="mt-1">
                          {getParticipationTypeDisplay(registration.participation_type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Event Dates</p>
                        <p className="text-tpahla-text-secondary">October 15-19, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Venue</p>
                        <p className="text-tpahla-text-secondary">Abuja Continental Hotel, Nigeria</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-bold text-tpahla-gold mb-4">Payment Information</h3>
                <div className="bg-tpahla-neutral-light p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-tpahla-gold">${registration.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status:</span>
                    <Badge variant={
                      registration.registration_status === 'paid' ? 'success' : 
                      registration.registration_status === 'cancelled' ? 'destructive' : 
                      'outline'
                    }>
                      {registration.registration_status}
                    </Badge>
                  </div>
                  
                  {payment && (
                    <div className="mt-4 pt-4 border-t border-tpahla-gold/10">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-tpahla-text-secondary">Payment Method:</p>
                          <p>{payment.payment_method || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-tpahla-text-secondary">Transaction ID:</p>
                          <p className="font-mono">{payment.transaction_id || 'N/A'}</p>
                        </div>
                        {payment.paid_at && (
                          <div>
                            <p className="text-tpahla-text-secondary">Payment Date:</p>
                            <p>{format(new Date(payment.paid_at), 'PPP')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Special Requests */}
              {registration.special_requests && (
                <div>
                  <h3 className="text-lg font-bold text-tpahla-gold mb-4">Special Requests</h3>
                  <div className="bg-tpahla-neutral-light p-4 rounded-lg">
                    <p className="text-tpahla-text-secondary">{registration.special_requests}</p>
                  </div>
                </div>
              )}
              
              {/* Event Information */}
              <div className="bg-tpahla-gold/10 p-6 rounded-lg border border-tpahla-gold/20 mt-8">
                <h3 className="text-lg font-bold text-tpahla-gold mb-4">Important Information</h3>
                <div className="space-y-3">
                  <p className="text-tpahla-text-secondary">
                    <strong>Check-in:</strong> Please arrive at least 30 minutes before the start of each day's events.
                  </p>
                  <p className="text-tpahla-text-secondary">
                    <strong>Identification:</strong> Bring a valid ID and a copy of this confirmation (digital or printed).
                  </p>
                  <p className="text-tpahla-text-secondary">
                    <strong>Dress Code:</strong> Business attire for daytime events; formal attire for the Gala Dinner.
                  </p>
                  <p className="text-tpahla-text-secondary">
                    <strong>Contact:</strong> For any questions or changes, please email <a href="mailto:2025@tpahla.africa" className="text-tpahla-gold hover:underline">2025@tpahla.africa</a> or call <a href="tel:+2348104906878" className="text-tpahla-gold hover:underline">+234-810-490-6878</a>.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8 text-tpahla-text-secondary text-sm">
                <p>Thank you for registering for TPAHLA 2025!</p>
                <p>We look forward to welcoming you to this prestigious event.</p>
                <p className="mt-2">© 2025 The Pan-African Humanitarian Leadership Award</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailsPage;