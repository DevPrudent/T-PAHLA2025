
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { africanCountries } from '@/lib/africanCountries';
import { awardCategories } from '@/lib/awardCategories';
import type { RegistrationData } from '../MultiStepRegistration';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
}

const nomineeTiers = [
  { id: 'tier1', name: 'Tier 1 - Flagship Honoree', price: 15000, description: 'Premier recognition with maximum visibility' },
  { id: 'tier2', name: 'Tier 2 - Premier Recognition', price: 10000, description: 'High-level recognition with comprehensive benefits' },
  { id: 'tier3', name: 'Tier 3 - Emerging Trailblazer', price: 7000, description: 'Humanitarian Excellence recognition package' },
  { id: 'tier4', name: 'Tier 4 - Standard Honoree', price: 6000, description: 'Quality recognition with essential benefits' },
  { id: 'tier5', name: 'Tier 5 - Standard Honoree', price: 5000, description: 'Standard honoree package with key benefits' },
  { id: 'tier6', name: 'Tier 6 - Entry Honoree', price: 3500, description: 'Entry-level recognition package' },
  { id: 'tier7', name: 'Tier 7 - Entry Honoree', price: 3500, description: 'Entry-level recognition package' },
  { id: 'tier8', name: 'Tier 8 - Entry Honoree', price: 3333, description: 'Entry-level recognition package' },
  { id: 'tier9', name: 'Tier 9 - Entry Honoree', price: 3000, description: 'Essential recognition package' },
  { id: 'tier10', name: 'Tier 10 - Entry Honoree', price: 3000, description: 'Essential recognition package' },
];

const groupTypes = [
  { id: 'silver', name: 'Silver Package', seats: 5, price: 750, description: 'Ideal for NGOs, CSR Units' },
  { id: 'gold', name: 'Gold Package', seats: 10, price: 1500, description: 'Perfect for institutions & multinationals' },
  { id: 'platinum', name: 'Platinum Package', seats: 15, price: 2000, description: 'Premium visibility for governments & academia' },
];

export const OptionsStep = ({ data, onUpdate }: Props) => {
  const calculateTotal = (updates: Partial<RegistrationData> = {}) => {
    const currentData = { ...data, ...updates };
    let total = 0;

    switch (currentData.participationType) {
      case 'nominee':
        if (currentData.tier) {
          const tier = nomineeTiers.find(t => t.id === currentData.tier);
          total = tier ? tier.price : 0;
        }
        break;
      case 'individual':
        total = 200;
        break;
      case 'group':
        if (currentData.groupType) {
          const group = groupTypes.find(g => g.id === currentData.groupType);
          total = group ? group.price : 0;
        }
        break;
      case 'sponsor':
        total = currentData.customAmount || 0;
        break;
    }

    onUpdate({ ...updates, totalAmount: total });
  };

  const handleInputChange = (field: keyof RegistrationData, value: any) => {
    const updates = { [field]: value };
    onUpdate(updates);
    
    // Recalculate total if relevant fields change
    if (['tier', 'groupType', 'customAmount'].includes(field)) {
      calculateTotal(updates);
    }
  };

  const renderNomineeOptions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nomineeCategory">Award Category *</Label>
          <Select value={data.nomineeCategory} onValueChange={(value) => handleInputChange('nomineeCategory', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {awardCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tier">Recognition Tier *</Label>
          <Select value={data.tier} onValueChange={(value) => handleInputChange('tier', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              {nomineeTiers.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{tier.name}</span>
                    <Badge variant="outline">${tier.price.toLocaleString()}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.tier && (
        <Card className="bg-tpahla-purple/5">
          <CardContent className="pt-6">
            {(() => {
              const selectedTier = nomineeTiers.find(t => t.id === data.tier);
              return selectedTier ? (
                <div>
                  <h4 className="font-semibold">{selectedTier.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTier.description}</p>
                  <Badge className="mt-2">${selectedTier.price.toLocaleString()}</Badge>
                </div>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderGroupOptions = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="groupName">Organization/Group Name *</Label>
        <Input
          id="groupName"
          value={data.groupName || ''}
          onChange={(e) => handleInputChange('groupName', e.target.value)}
          placeholder="Enter organization name"
        />
      </div>

      <div>
        <Label htmlFor="groupType">Package Type *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {groupTypes.map((group) => (
            <Card
              key={group.id}
              className={`cursor-pointer transition-all ${
                data.groupType === group.id ? 'ring-2 ring-tpahla-gold border-tpahla-gold' : 'hover:border-tpahla-purple/30'
              }`}
              onClick={() => handleInputChange('groupType', group.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">{group.seats} Delegates</Badge>
                  <div className="text-lg font-bold text-tpahla-gold">
                    ${group.price.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSponsorOptions = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sponsorshipType">Sponsorship Type</Label>
        <Select value={data.sponsorshipType} onValueChange={(value) => handleInputChange('sponsorshipType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select sponsorship type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title Sponsor</SelectItem>
            <SelectItem value="platinum">Platinum Sponsor</SelectItem>
            <SelectItem value="gold">Gold Sponsor</SelectItem>
            <SelectItem value="silver">Silver Sponsor</SelectItem>
            <SelectItem value="custom">Custom Package</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="customAmount">Sponsorship Amount (USD) *</Label>
        <Input
          id="customAmount"
          type="number"
          value={data.customAmount || ''}
          onChange={(e) => handleInputChange('customAmount', parseInt(e.target.value) || 0)}
          placeholder="Enter amount"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Please provide your contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={data.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Select value={data.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {africanCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={data.organization || ''}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="Your organization"
              />
            </div>

            <div>
              <Label htmlFor="position">Position/Title</Label>
              <Input
                id="position"
                value={data.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Your position or title"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type-specific Options */}
      <Card>
        <CardHeader>
          <CardTitle>
            {data.participationType === 'nominee' && 'Nomination Details'}
            {data.participationType === 'individual' && 'Individual Registration'}
            {data.participationType === 'group' && 'Group Registration'}
            {data.participationType === 'sponsor' && 'Sponsorship Details'}
          </CardTitle>
          <CardDescription>
            {data.participationType === 'nominee' && 'Select your award category and recognition tier'}
            {data.participationType === 'individual' && 'Your individual attendance is confirmed'}
            {data.participationType === 'group' && 'Configure your group registration'}
            {data.participationType === 'sponsor' && 'Choose your sponsorship package'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.participationType === 'nominee' && renderNomineeOptions()}
          {data.participationType === 'individual' && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Individual Registration</h3>
              <p className="text-muted-foreground mb-4">
                Your registration includes full access to all public sessions, networking opportunities, and event materials.
              </p>
              <Badge className="text-lg px-4 py-2">$200</Badge>
            </div>
          )}
          {data.participationType === 'group' && renderGroupOptions()}
          {data.participationType === 'sponsor' && renderSponsorOptions()}
        </CardContent>
      </Card>

      {/* Special Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Special Requests</CardTitle>
          <CardDescription>Any special accommodations or requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="specialRequests">Special Requirements</Label>
          <Textarea
            id="specialRequests"
            value={data.specialRequests || ''}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
            placeholder="Please specify any dietary requirements, accessibility needs, or other special requests"
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Total Amount Display */}
      {data.totalAmount > 0 && (
        <Card className="bg-tpahla-gold/10 border-tpahla-gold">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-tpahla-gold">
                ${data.totalAmount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
