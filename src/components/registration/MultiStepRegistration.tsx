
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ParticipationTypeStep } from './steps/ParticipationTypeStep';
import { OptionsStep } from './steps/OptionsStep';
import { ReviewStep } from './steps/ReviewStep';
import { PaymentStep } from './steps/PaymentStep';
import { ThankYouStep } from './steps/ThankYouStep';

export type ParticipationType = 'nominee' | 'individual' | 'group' | 'sponsor';

export interface RegistrationData {
  participationType: ParticipationType | null;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  organization?: string;
  position?: string;
  
  // Nominee specific
  nomineeCategory?: string;
  tier?: string;
  cvFile?: File;
  
  // Group specific
  groupName?: string;
  numberOfSeats?: number;
  groupType?: 'silver' | 'gold' | 'platinum';
  
  // Sponsor specific
  sponsorshipType?: string;
  customAmount?: number;
  
  // Common
  addOns: string[];
  totalAmount: number;
  specialRequests?: string;
}

const MultiStepRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    participationType: null,
    fullName: '',
    email: '',
    phone: '',
    country: '',
    addOns: [],
    totalAmount: 0,
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateRegistrationData = (updates: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return registrationData.participationType !== null;
      case 2:
        return registrationData.fullName && registrationData.email && registrationData.phone;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ParticipationTypeStep
            data={registrationData}
            onUpdate={updateRegistrationData}
          />
        );
      case 2:
        return (
          <OptionsStep
            data={registrationData}
            onUpdate={updateRegistrationData}
          />
        );
      case 3:
        return (
          <ReviewStep
            data={registrationData}
            onUpdate={updateRegistrationData}
          />
        );
      case 4:
        return (
          <PaymentStep
            data={registrationData}
            onUpdate={updateRegistrationData}
            onSuccess={() => setCurrentStep(5)}
          />
        );
      case 5:
        return <ThankYouStep data={registrationData} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Choose Participation Type';
      case 2:
        return 'Your Details & Options';
      case 3:
        return 'Review & Confirm';
      case 4:
        return 'Payment';
      case 5:
        return 'Registration Complete';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-tpahla-darkgreen text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-center mb-2">
            TPAHLA 2025 Registration
          </h1>
          <p className="text-center text-tpahla-text-light">
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </p>
          <div className="mt-4 max-w-2xl mx-auto">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-tpahla-gold">
                {getStepTitle()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="bg-tpahla-darkgreen hover:bg-tpahla-emerald flex items-center gap-2"
                  >
                    {currentStep === 3 ? 'Proceed to Payment' : 'Next'}
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MultiStepRegistration;
