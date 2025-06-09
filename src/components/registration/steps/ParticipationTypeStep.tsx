import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RegistrationData, ParticipationType } from '../MultiStepRegistration';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
}

const participationTypes = [
  {
    id: 'nominee' as ParticipationType,
    title: 'Award Nominee / Honoree',
    description: 'Apply to be recognized as a humanitarian leader',
    icon: '🏆',
    priceRange: '$3,000 - $15,000',
    features: [
      '10 different recognition tiers',
      'VIP accommodation & experiences',
      'Media coverage & legacy inclusion',
      'Networking with continental leaders'
    ]
  },
  {
    id: 'individual' as ParticipationType,
    title: 'General Attendee',
    description: 'Join the event as an individual participant',
    icon: '👤',
    priceRange: '$200',
    features: [
      'Full access to all public sessions',
      'Networking opportunities',
      'Event materials & certificate',
      'Conference, dinner & gala access'
    ]
  },
  {
    id: 'group' as ParticipationType,
    title: 'Corporate/Institutional Group',
    description: 'Register multiple delegates from your organization',
    icon: '🏢',
    priceRange: '$750 - $2,000',
    features: [
      'Silver (5), Gold (10), Platinum (15) packages',
      'Corporate brand visibility',
      'Group networking sessions',
      'Bulk delegate registration'
    ]
  },
  {
    id: 'sponsor' as ParticipationType,
    title: 'Sponsor / Partner',
    description: 'Support the event and gain premium visibility',
    icon: '🤝',
    priceRange: 'Custom',
    features: [
      'Various sponsorship opportunities',
      'Premium brand exposure',
      'VIP treatment & recognition',
      'Custom partnership packages'
    ]
  }
];

export const ParticipationTypeStep = ({ data, onUpdate }: Props) => {
  const selectType = (type: ParticipationType) => {
    // Set default total amount based on participation type
    let totalAmount = 0;
    
    // Set default amount for individual attendees
    if (type === 'individual') {
      totalAmount = 200; // Fixed price for individual attendees
    }
    
    onUpdate({ 
      participationType: type,
      totalAmount: totalAmount
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">How would you like to participate in TPAHLA 2025?</h3>
        <p className="text-muted-foreground">
          Choose the participation type that best fits your involvement with the event
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {participationTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              data.participationType === type.id
                ? 'ring-2 ring-tpahla-gold border-tpahla-gold bg-tpahla-gold/5'
                : 'hover:border-tpahla-purple/30'
            }`}
            onClick={() => selectType(type.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {type.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-tpahla-gold border-tpahla-gold">
                  {type.priceRange}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-tpahla-gold mr-2 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.participationType && (
        <div className="mt-6 p-4 bg-tpahla-purple/5 rounded-lg border border-tpahla-purple/20">
          <p className="text-sm text-tpahla-text-secondary">
            <strong>Selected:</strong> {participationTypes.find(t => t.id === data.participationType)?.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "Next" to continue with your registration details
          </p>
        </div>
      )}
    </div>
  );
};