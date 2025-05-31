import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Download, Mail, Phone, Building, CreditCard, DollarSign, Users, Award, Globe, Zap, BarChart } from 'lucide-react';
import { toast } from 'sonner';

const Sponsors = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    sponsorshipType: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSponsorshipTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, sponsorshipType: value }));
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the data to your backend
    console.log('Sponsorship inquiry submitted:', formData);
    toast.success('Thank you for your interest! Our team will contact you shortly.');
    setContactDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      sponsorshipType: '',
      message: ''
    });
  };

  const sponsorshipTiers = [
    {
      id: 'platinum',
      name: 'Platinum Sponsorship',
      emoji: '💎',
      price: '$100,000+',
      tagline: 'Lead Partner',
      description: 'Position your brand as a continental leader in humanitarian impact.',
      benefits: [
        'Exclusive naming rights for one award category',
        'Keynote speaking opportunity at the gala',
        'Premier branding across all channels & red carpet',
        'VIP Seating for 10 guests',
        'Full-page brochure feature & branded items in guest packs',
        'Dedicated booth, media interviews, and a corporate video showcase',
        'Advisory Board invitation for future humanitarian strategy',
        'Inclusion in the TPAHLA Post-Event Global Report'
      ],
      color: 'bg-gradient-to-r from-slate-300 to-slate-100',
      textColor: 'text-slate-900',
      featured: true
    },
    {
      id: 'gold',
      name: 'Gold Sponsorship',
      emoji: '🥇',
      price: '$50,000',
      tagline: 'Strategic Partner',
      description: 'Gain prime visibility and thought leadership exposure.',
      benefits: [
        'Panel speaking or moderation opportunity',
        'Strategic partner branding across marketing channels',
        'VIP Seating for 6 guests',
        'Half-page feature in brochure',
        'Branded gift inclusion',
        'Prime logo placement & media coverage',
        'Featured in event communiqués and award visuals'
      ],
      color: 'bg-gradient-to-r from-amber-300 to-amber-100',
      textColor: 'text-amber-900'
    },
    {
      id: 'silver',
      name: 'Silver Sponsorship',
      emoji: '🥈',
      price: '$25,000',
      tagline: 'Supporting Partner',
      description: 'Showcase your active role in humanitarian innovation.',
      benefits: [
        'Official sponsor branding on event and print materials',
        'Logo placement on website, banners & media',
        'VIP Seating for 4 guests',
        'Quarter-page feature in event brochure',
        'Stage mention & award presentation opportunity',
        'Post-event inclusion in digital archives'
      ],
      color: 'bg-gradient-to-r from-gray-300 to-gray-100',
      textColor: 'text-gray-900'
    },
    {
      id: 'bronze',
      name: 'Bronze Sponsorship',
      emoji: '🥉',
      price: '$10,000',
      tagline: 'Contributing Partner',
      description: 'Support Africa\'s progress while gaining credible recognition.',
      benefits: [
        'Acknowledgment as a supporter across key channels',
        'Logo on selected materials & online listings',
        'VIP Seating for 2 guests',
        'Post-event appreciation & mention in final report',
        'Recognition on TPAHLA\'s social media platforms'
      ],
      color: 'bg-gradient-to-r from-amber-700 to-amber-500',
      textColor: 'text-white'
    },
    {
      id: 'exhibition',
      name: 'Exhibition Space',
      emoji: '🏛️',
      price: '$5,000',
      tagline: 'Exhibitor',
      description: 'Showcase your solutions and connect directly with influential stakeholders.',
      benefits: [
        'Dedicated 6-12 SQM Exhibition Booth',
        'Direct engagement with global participants',
        'Listing in event brochure and onsite signage',
        'Optional media feature & QR-enabled brand zone'
      ],
      color: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
      textColor: 'text-white'
    },
    {
      id: 'custom',
      name: 'Custom Package',
      emoji: '🎯',
      price: 'Tailored',
      tagline: 'Tailored to your needs',
      description: 'We offer tailored sponsorships to align with your brand\'s unique goals.',
      benefits: [
        'Sector-specific panels',
        'Branded zones',
        'Targeted engagement',
        'Flexible budget options',
        'Custom visibility solutions',
        'Specialized networking opportunities'
      ],
      color: 'bg-gradient-to-r from-purple-600 to-purple-400',
      textColor: 'text-white'
    }
  ];

  const bankDetails = [
    {
      name: "The Pan African Humanitarian Leadership Award (TPAHLA)/IHSD",
      accountNumber: "1229874160",
      currency: "NGN",
      bank: "Zenith Bank"
    },
    {
      name: "The Pan African Humanitarian Leadership Award (TPAHLA)/IHSD",
      accountNumber: "5075232190",
      currency: "USD",
      bank: "Zenith Bank"
    }
  ];

  const brochureUrl = "https://zrutcdhfqahfduxppudv.supabase.co/storage/v1/object/public/documents/TPAHLA%202025%20BROCHURE%2033";

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-tpahla-darkgreen text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-tpahla-darkgreen to-tpahla-emerald opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-tpahla-gold">
              SPONSOR TPAHLA 2025
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Partner with Africa's Most Prestigious Humanitarian Platform
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
              <div className="bg-black/20 px-4 py-2 rounded-full">
                📍 Abuja Continental Hotel, Nigeria
              </div>
              <div className="bg-black/20 px-4 py-2 rounded-full">
                🗓️ October 15-19, 2025
              </div>
              <div className="bg-black/20 px-4 py-2 rounded-full">
                🌐 Hosted by: IHSD | AREF | UNITAR
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <DialogTrigger asChild onClick={() => setContactDialogOpen(true)}>
                <Button size="lg" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                  Become a Sponsor
                </Button>
              </DialogTrigger>
              <a href={brochureUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  <Download className="mr-2 h-4 w-4" />
                  Download Brochure
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsorship Opportunities Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">
              Sponsorship & Partnership Opportunities
            </h2>
            <p className="text-tpahla-text-secondary text-lg">
              Join Africa's Premier Celebration of Humanitarian Impact and Drive Transformational Change. 
              The Pan-African Humanitarian Leadership Award (TPAHLA) 2025 is not just an event, it is 
              Africa's signature stage for humanitarian excellence, global recognition, and legacy partnership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-tpahla-gold">Why Partner With Us?</CardTitle>
                <CardDescription>Partnering with TPAHLA 2025 grants your organization access to:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">Unparalleled visibility among Africa's most influential leaders</p>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">Strategic networking with changemakers, global institutions & policymakers</p>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">Exhibition and speaking opportunities at Africa's most prestigious humanitarian gathering</p>
                </div>
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">Long-term brand positioning aligned with global social good</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-tpahla-gold">Who Should Sponsor?</CardTitle>
                <CardDescription>We welcome strategic sponsorship and partnership from:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">Government MDAs (Humanitarian, Social Welfare, SDGs)</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">CSR-driven Corporate Organizations</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">Embassies & International Development Partners</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">NGOs, Foundations & Social Impact Institutions</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-tpahla-emerald mr-3 mt-0.5" />
                  <p className="text-tpahla-text-secondary">Media Outlets seeking regional & global amplification</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-serif font-bold mb-8 text-center text-tpahla-gold">
              Sponsorship Tiers & Benefits
            </h3>
            <p className="text-center text-tpahla-text-secondary mb-8">
              Each tier is designed for maximum visibility, influence, and legacy positioning.
            </p>

            <Tabs defaultValue="all" className="mb-12">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
                <TabsTrigger value="all">All Tiers</TabsTrigger>
                <TabsTrigger value="platinum">Platinum</TabsTrigger>
                <TabsTrigger value="gold">Gold</TabsTrigger>
                <TabsTrigger value="silver">Silver</TabsTrigger>
                <TabsTrigger value="bronze">Bronze</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsorshipTiers.map(tier => (
                  <Card 
                    key={tier.id} 
                    className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${tier.featured ? 'ring-2 ring-tpahla-gold' : ''}`}
                  >
                    <div className={`${tier.color} ${tier.textColor} p-6`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl">{tier.emoji}</span>
                        <Badge className="bg-white/20 text-white">{tier.tagline}</Badge>
                      </div>
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <div className="text-3xl font-bold mt-2">{tier.price}</div>
                      <p className="mt-2 text-sm opacity-90">{tier.description}</p>
                    </div>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {tier.benefits.slice(0, 5).map((benefit, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-tpahla-gold mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-tpahla-text-secondary">{benefit}</span>
                          </li>
                        ))}
                        {tier.benefits.length > 5 && (
                          <li className="text-sm text-tpahla-gold">+ {tier.benefits.length - 5} more benefits</li>
                        )}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setSelectedTier(tier.id);
                          setFormData(prev => ({ ...prev, sponsorshipType: tier.name }));
                          setContactDialogOpen(true);
                        }}
                      >
                        Select {tier.name}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              
              {sponsorshipTiers.map(tier => (
                <TabsContent key={tier.id} value={tier.id} className="max-w-3xl mx-auto">
                  <Card className={`overflow-hidden ${tier.featured ? 'ring-2 ring-tpahla-gold' : ''}`}>
                    <div className={`${tier.color} ${tier.textColor} p-8`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-4xl">{tier.emoji}</span>
                        <Badge className="bg-white/20 text-white">{tier.tagline}</Badge>
                      </div>
                      <h3 className="text-2xl font-bold">{tier.name}</h3>
                      <div className="text-4xl font-bold mt-2">{tier.price}</div>
                      <p className="mt-3 text-lg opacity-90">{tier.description}</p>
                    </div>
                    <CardContent className="pt-8">
                      <h4 className="font-medium text-xl mb-4">Full Benefits:</h4>
                      <ul className="space-y-3">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-tpahla-gold mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-tpahla-text-secondary">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-center pt-4 pb-8">
                      <Button 
                        size="lg"
                        className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90"
                        onClick={() => {
                          setSelectedTier(tier.id);
                          setFormData(prev => ({ ...prev, sponsorshipType: tier.name }));
                          setContactDialogOpen(true);
                        }}
                      >
                        Become a {tier.name.split(' ')[0]} Sponsor
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              ))}
              
              <TabsContent value="other" className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sponsorshipTiers.filter(t => t.id === 'exhibition' || t.id === 'custom').map(tier => (
                    <Card key={tier.id} className="overflow-hidden">
                      <div className={`${tier.color} ${tier.textColor} p-6`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl">{tier.emoji}</span>
                          <Badge className="bg-white/20 text-white">{tier.tagline}</Badge>
                        </div>
                        <h3 className="text-xl font-bold">{tier.name}</h3>
                        <div className="text-3xl font-bold mt-2">{tier.price}</div>
                        <p className="mt-2 text-sm opacity-90">{tier.description}</p>
                      </div>
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-3">Key Benefits:</h4>
                        <ul className="space-y-2">
                          {tier.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="h-4 w-4 text-tpahla-gold mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-tpahla-text-secondary">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSelectedTier(tier.id);
                            setFormData(prev => ({ ...prev, sponsorshipType: tier.name }));
                            setContactDialogOpen(true);
                          }}
                        >
                          Select {tier.name}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Resource Center Section */}
      <section className="py-16 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">
              Your Sponsorship Powers The Pan-African Humanitarian Resource Centre
            </h2>
            <p className="text-lg mb-8">
              By sponsoring TPAHLA, you invest in Africa's future through TPAHRC, a continental hub for 
              humanitarian innovation, learning, and sustainable development. It's your chance to support 
              capacity-building for NGOs, social entrepreneurs, and public sector leaders.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 p-6 rounded-lg">
                <BarChart className="h-12 w-12 mx-auto mb-4 text-tpahla-gold" />
                <h3 className="text-xl font-bold mb-2">Research & Innovation</h3>
                <p className="text-sm text-gray-300">Supporting cutting-edge humanitarian research and innovative solutions</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg">
                <Users className="h-12 w-12 mx-auto mb-4 text-tpahla-gold" />
                <h3 className="text-xl font-bold mb-2">Capacity Building</h3>
                <p className="text-sm text-gray-300">Empowering the next generation of humanitarian leaders across Africa</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg">
                <Globe className="h-12 w-12 mx-auto mb-4 text-tpahla-gold" />
                <h3 className="text-xl font-bold mb-2">Continental Impact</h3>
                <p className="text-sm text-gray-300">Creating sustainable solutions to Africa's most pressing challenges</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Details Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center text-tpahla-gold">
              Payment Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {bankDetails.map((account, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-tpahla-neutral">
                    <div className="flex items-center gap-3">
                      <Building className="h-6 w-6 text-tpahla-gold" />
                      <CardTitle>{account.currency} Account</CardTitle>
                    </div>
                    <CardDescription>{account.bank}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Account Name</p>
                        <p className="font-medium">{account.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-medium">{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Currency</p>
                        <Badge>{account.currency}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-tpahla-neutral p-6 rounded-lg border border-tpahla-gold/20 text-center">
              <h3 className="text-xl font-bold mb-4 text-tpahla-gold">Your Participation Fuels a Continental Vision</h3>
              <p className="text-tpahla-text-secondary mb-6">
                All donations, sponsorships, and participation proceeds directly support the development and 
                sustainability of The Pan-African Humanitarian Resource Centre (TPAHRC), Africa's foremost hub 
                for humanitarian research, capacity building, innovation, and impact-led collaboration.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <DialogTrigger asChild onClick={() => setContactDialogOpen(true)}>
                  <Button className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                    Become a Sponsor Today
                  </Button>
                </DialogTrigger>
                <a href={brochureUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Brochure
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-tpahla-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-8 text-tpahla-gold">
              Ready to Become a Sponsor?
            </h2>
            <p className="text-lg text-tpahla-text-secondary mb-8">
              Align your organization with Africa's top-tier platform for humanitarian transformation. 
              Whether you're a mission-driven corporation, donor agency, or government institution, 
              TPAHLA offers unrivaled access to influence, insight, and impact.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <Mail className="h-10 w-10 text-tpahla-gold mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-center">Email Us</h3>
                  <div className="text-center text-tpahla-text-secondary">
                    <p>2025@tpahla.africa</p>
                    <p>tpahla@ihsd-ng.org</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <Phone className="h-10 w-10 text-tpahla-gold mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-center">Call Us</h3>
                  <div className="text-center text-tpahla-text-secondary">
                    <p>+234-802-368-6143</p>
                    <p>+234-806-039-6906</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <Globe className="h-10 w-10 text-tpahla-gold mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-center">Visit Us Online</h3>
                  <div className="text-center text-tpahla-text-secondary">
                    <p>www.tpahla.africa</p>
                    <p>www.ihsd-ng.org/TPAHLA</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <p className="text-tpahla-text-secondary italic">
              TPAHLA 2025, Where Honor Meets Purpose, and Every Contribution Builds Africa's Humanitarian Future.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sponsorship Inquiry</DialogTitle>
            <DialogDescription>
              Complete the form below to express your interest in sponsoring TPAHLA 2025.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" value={formData.organization} onChange={handleInputChange} required />
              </div>
              
              <div>
                <Label htmlFor="sponsorshipType">Sponsorship Type</Label>
                <Select value={formData.sponsorshipType} onValueChange={handleSponsorshipTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sponsorship type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsorshipTiers.map(tier => (
                      <SelectItem key={tier.id} value={tier.name}>
                        {tier.name} ({tier.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">Additional Information</Label>
                <Textarea 
                  id="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Please share any specific requirements or questions you have."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Inquiry</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sponsors;