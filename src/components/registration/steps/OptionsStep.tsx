import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { africanCountries } from '@/lib/africanCountries';
import { awardCategoriesData, getAwardsForCategory } from '@/lib/awardCategories';
import { registrationCategories } from '@/lib/registrationData';
import type { RegistrationData } from '../MultiStepRegistration';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';

interface Props {
  data: RegistrationData;
  onUpdate: (updates: Partial<RegistrationData>) => void;
}

const nomineeTiers = registrationCategories.filter(cat => 
  cat.id.startsWith('tier')
);

const groupTypes = [
  { id: 'silver', name: 'Silver Package', seats: 5, price: 750, description: 'Ideal for NGOs, CSR Units' },
  { id: 'gold', name: 'Gold Package', seats: 10, price: 1500, description: 'Perfect for institutions & multinationals' },
  { id: 'platinum', name: 'Platinum Package', seats: 15, price: 2000, description: 'Premium visibility for governments & academia' },
];

const sponsorshipTypes = [
  { id: 'platinum', name: 'Platinum Sponsorship', price: 100000, description: 'Lead Partner' },
  { id: 'gold', name: 'Gold Sponsorship', price: 50000, description: 'Strategic Partner' },
  { id: 'silver', name: 'Silver Sponsorship', price: 25000, description: 'Supporting Partner' },
  { id: 'bronze', name: 'Bronze Sponsorship', price: 10000, description: 'Contributing Partner' },
  { id: 'exhibition', name: 'Exhibition Space', price: 5000, description: 'Exhibitor' },
  { id: 'custom', name: 'Custom Package', price: 0, description: 'Tailored to your needs' }
];

export const OptionsStep = ({ data, onUpdate }: Props) => {
  const [availableAwards, setAvailableAwards] = useState<{name: string, value: string}[]>([]);

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
        total = 200; // Fixed price for individual attendees
        break;
      case 'group':
        if (currentData.groupType) {
          const group = groupTypes.find(g => g.id === currentData.groupType);
          total = group ? group.price : 0;
        }
        break;
      case 'sponsor':
        if (currentData.sponsorshipType && currentData.sponsorshipType !== 'custom') {
          const sponsorType = sponsorshipTypes.find(s => s.id === currentData.sponsorshipType);
          total = sponsorType ? sponsorType.price : 0;
          // Update customAmount to match the sponsorship type price
          if (sponsorType && sponsorType.price > 0) {
            onUpdate({ customAmount: sponsorType.price });
          }
        } else {
          total = currentData.customAmount || 0;
        }
        break;
    }

    onUpdate({ ...updates, totalAmount: total });
  };

  const handleInputChange = (field: keyof RegistrationData, value: any) => {
    const updates = { [field]: value };
    onUpdate(updates);
    
    // Recalculate total if relevant fields change
    if (['tier', 'groupType', 'sponsorshipType', 'customAmount'].includes(field)) {
      calculateTotal(updates);
    }
  };

  // Update available awards when category changes
  useEffect(() => {
    if (data.nomineeCategory) {
      setAvailableAwards(getAwardsForCategory(data.nomineeCategory));
    } else {
      setAvailableAwards([]);
    }
  }, [data.nomineeCategory]);

  // Set default total amount for individual attendees when component mounts
  useEffect(() => {
    if (data.participationType === 'individual' && data.totalAmount === 0) {
      onUpdate({ totalAmount: 200 });
    }
  }, [data.participationType, data.totalAmount, onUpdate]);

  // Get the selected tier details
  const selectedTier = data.tier ? nomineeTiers.find(t => t.id === data.tier) : null;
  
  // Get the selected group package details
  const selectedGroupType = data.groupType ? groupTypes.find(g => g.id === data.groupType) : null;

  // Get the selected sponsorship type details
  const selectedSponsorshipType = data.sponsorshipType ? 
    sponsorshipTypes.find(s => s.id === data.sponsorshipType) : null;

  const renderNomineeOptions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nomineeCategory">Award Category *</Label>
          <Select value={data.nomineeCategory} onValueChange={(value) => {
            handleInputChange('nomineeCategory', value);
            // Reset specific award when category changes
            handleInputChange('specificAward', '');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {awardCategoriesData.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {data.nomineeCategory && availableAwards.length > 0 && (
          <div>
            <Label htmlFor="specificAward">Specific Award *</Label>
            <Select value={data.specificAward} onValueChange={(value) => handleInputChange('specificAward', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select specific award" />
              </SelectTrigger>
              <SelectContent>
                {availableAwards.map((award) => (
                  <SelectItem key={award.value} value={award.value}>
                    {award.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="tier">Recognition Tier *</Label>
        <div className="grid grid-cols-1 gap-4 mt-2">
          {nomineeTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`cursor-pointer transition-all ${
                data.tier === tier.id ? 'ring-2 ring-tpahla-gold border-tpahla-gold' : 'hover:border-tpahla-purple/30'
              }`}
              onClick={() => handleInputChange('tier', tier.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">{tier.tier}</span> {tier.name}
                    {data.tier === tier.id && (
                      <span className="ml-2 text-tpahla-gold">
                        <Check size={18} />
                      </span>
                    )}
                  </CardTitle>
                  <Badge className="text-lg px-4 py-2">${tier.price.toLocaleString()}</Badge>
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-sm mb-2">Package Includes:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                  {tier.includes.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-tpahla-gold mr-2 mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
                <CardTitle className="text-lg flex items-center">
                  {group.name}
                  {data.groupType === group.id && (
                    <span className="ml-2 text-tpahla-gold">
                      <Check size={18} />
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">{group.seats} Delegates</Badge>
                  <div className="text-lg font-bold text-tpahla-gold">
                    ${group.price.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Includes all-inclusive general access, brand mention at events, and networking opportunities
                  </p>
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
        <Label htmlFor="sponsorshipType">Sponsorship Type *</Label>
        <Select 
          value={data.sponsorshipType} 
          onValueChange={(value) => {
            handleInputChange('sponsorshipType', value);
            
            // If not custom, set the amount automatically
            if (value !== 'custom') {
              const sponsorType = sponsorshipTypes.find(s => s.id === value);
              if (sponsorType) {
                handleInputChange('customAmount', sponsorType.price);
              }
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sponsorship type" />
          </SelectTrigger>
          <SelectContent>
            {sponsorshipTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name} {type.price > 0 && `($${type.price.toLocaleString()})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="customAmount">
          Sponsorship Amount (USD) {data.sponsorshipType === 'custom' ? '*' : ''}
        </Label>
        <Input
          id="customAmount"
          type="number"
          value={data.customAmount || ''}
          onChange={(e) => handleInputChange('customAmount', parseInt(e.target.value) || 0)}
          placeholder="Enter amount"
          disabled={data.sponsorshipType !== 'custom'}
        />
        {data.sponsorshipType !== 'custom' && (
          <p className="text-sm text-muted-foreground mt-1">
            Amount is fixed based on selected sponsorship type
          </p>
        )}
      </div>

      <Card className="bg-tpahla-purple/5 border-tpahla-purple/20">
        <CardHeader>
          <CardTitle className="text-lg">Sponsorship Benefits</CardTitle>
          <CardDescription>Benefits vary based on sponsorship level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Platinum Sponsorship ($100,000+)</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Exclusive naming rights for one award category</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Keynote speaking opportunity at the gala</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Premier branding across all channels & red carpet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>VIP Seating for 10 guests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Full-page brochure feature & branded items in guest packs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Dedicated booth, media interviews, and a corporate video showcase</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Advisory Board invitation for future humanitarian strategy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Inclusion in the TPAHLA Post-Event Global Report</span>
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Gold Sponsorship ($50,000)</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Panel speaking or moderation opportunity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Strategic partner branding across marketing channels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>VIP Seating for 6 guests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Half-page feature in brochure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Branded gift inclusion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Prime logo placement & media coverage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Featured in event communiqués and award visuals</span>
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Silver Sponsorship ($25,000)</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Official sponsor branding on event and print materials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Logo placement on website, banners & media</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>VIP Seating for 4 guests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Quarter-page feature in event brochure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Stage mention & award presentation opportunity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Post-event inclusion in digital archives</span>
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Bronze Sponsorship ($10,000)</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Acknowledgment as a supporter across key channels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Logo on selected materials & online listings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>VIP Seating for 2 guests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Post-event appreciation & mention in final report</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tpahla-gold mr-2">✓</span>
                  <span>Recognition on TPAHLA's social media platforms</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
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
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Package Includes:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start">
                    <span className="text-tpahla-gold mr-2">✓</span>
                    <span>General access to all public sessions (Oct 16–18)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-tpahla-gold mr-2">✓</span>
                    <span>Entry to High-Level Roundtables & Networking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-tpahla-gold mr-2">✓</span>
                    <span>Event Entry (Conference, Dinner & Gala)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-tpahla-gold mr-2">✓</span>
                    <span>Event materials & delegate badge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-tpahla-gold mr-2">✓</span>
                    <span>Certificate of Participation</span>
                  </li>
                </ul>
              </div>
              
              <Badge className="text-lg px-4 py-2 mt-6">$200</Badge>
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