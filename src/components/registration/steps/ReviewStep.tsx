import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';
import type { RegistrationData } from '../MultiStepRegistration';
import { getAwardNameByValue, getCategoryTitleById } from '@/lib/awardCategories';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
}

export const ReviewStep = ({ data }: Props) => {
  const getParticipationTypeDisplay = () => {
    switch (data.participationType) {
      case 'nominee':
        return 'Award Nominee / Honoree';
      case 'individual':
        return 'General Attendee';
      case 'group':
        return 'Corporate/Institutional Group';
      case 'sponsor':
        return 'Sponsor / Partner';
      default:
        return 'Unknown';
    }
  };

  const getTierDisplay = () => {
    if (data.participationType === 'nominee' && data.tier) {
      const tierMap: { [key: string]: string } = {
        'tier1': 'Tier 1 - Flagship Honoree ($15,000)',
        'tier2': 'Tier 2 - Premier Recognition ($10,000)',
        'tier3': 'Tier 3 - Emerging Trailblazer ($7,000)',
        'tier4': 'Tier 4 - Standard Honoree ($6,000)',
        'tier5': 'Tier 5 - Standard Honoree ($5,000)',
        'tier6': 'Tier 6 - Entry Honoree ($3,500)',
        'tier7': 'Tier 7 - Entry Honoree ($3,500)',
        'tier8': 'Tier 8 - Entry Honoree ($3,333)',
        'tier9': 'Tier 9 - Entry Honoree ($3,000)',
        'tier10': 'Tier 10 - Entry Honoree ($3,000)',
      };
      return tierMap[data.tier] || data.tier;
    }
    return null;
  };

  const getGroupDisplay = () => {
    if (data.participationType === 'group' && data.groupType) {
      const groupMap: { [key: string]: string } = {
        'silver': 'Silver Package - 5 Delegates ($750)',
        'gold': 'Gold Package - 10 Delegates ($1,500)',
        'platinum': 'Platinum Package - 15 Delegates ($2,000)',
      };
      return groupMap[data.groupType] || data.groupType;
    }
    return null;
  };

  const getAwardCategoryDisplay = () => {
    if (data.participationType === 'nominee' && data.nomineeCategory) {
      return getCategoryTitleById(data.nomineeCategory);
    }
    return null;
  };

  const getSpecificAwardDisplay = () => {
    if (data.participationType === 'nominee' && data.nomineeCategory && data.specificAward) {
      return getAwardNameByValue(data.nomineeCategory, data.specificAward);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Review Your Registration</h3>
        <p className="text-muted-foreground">
          Please review all the details below before proceeding to payment
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Full Name</div>
              <div className="font-medium">{data.fullName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="font-medium">{data.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div className="font-medium">{data.phone}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Country</div>
              <div className="font-medium">{data.country}</div>
            </div>
            {data.organization && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Organization</div>
                <div className="font-medium">{data.organization}</div>
              </div>
            )}
            {data.position && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Position</div>
                <div className="font-medium">{data.position}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Participation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Participation Type</div>
            <div className="font-medium">{getParticipationTypeDisplay()}</div>
          </div>

          {data.participationType === 'nominee' && (
            <>
              {getAwardCategoryDisplay() && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Award Category</div>
                  <div className="font-medium">{getAwardCategoryDisplay()}</div>
                </div>
              )}
              {getSpecificAwardDisplay() && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Specific Award</div>
                  <div className="font-medium">{getSpecificAwardDisplay()}</div>
                </div>
              )}
              {getTierDisplay() && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Recognition Tier</div>
                  <div className="font-medium">{getTierDisplay()}</div>
                </div>
              )}
            </>
          )}

          {data.participationType === 'group' && (
            <>
              {data.groupName && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Organization Name</div>
                  <div className="font-medium">{data.groupName}</div>
                </div>
              )}
              {getGroupDisplay() && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Package Type</div>
                  <div className="font-medium">{getGroupDisplay()}</div>
                </div>
              )}
            </>
          )}

          {data.participationType === 'sponsor' && (
            <>
              {data.sponsorshipType && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Sponsorship Type</div>
                  <div className="font-medium">{data.sponsorshipType}</div>
                </div>
              )}
              {data.customAmount && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Sponsorship Amount</div>
                  <div className="font-medium">${data.customAmount.toLocaleString()}</div>
                </div>
              )}
            </>
          )}

          {data.specialRequests && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Special Requests</div>
              <div className="font-medium">{data.specialRequests}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card className="bg-tpahla-gold/10 border-tpahla-gold">
        <CardHeader>
          <CardTitle className="text-tpahla-gold">Payment Summary</CardTitle>
          <CardDescription>Your total registration fee</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>{getParticipationTypeDisplay()}</span>
              <span>${data.totalAmount.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-tpahla-gold">${data.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-orange-800 mb-2">Important Information</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Registration fees are non-refundable but transferable up to September 15, 2025</li>
            <li>• You will receive a confirmation email after successful payment</li>
            <li>• Event details and accommodation information will be sent closer to the event date</li>
            <li>• For any changes or special requests, contact us at tpahla@ihsd-ng.org</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};