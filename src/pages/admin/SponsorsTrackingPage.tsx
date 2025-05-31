import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Loader2, 
  Building, 
  DollarSign, 
  Users, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'sonner';

// Define types for sponsor registrations
interface SponsorRegistration {
  id: string;
  full_name: string;
  email: string;
  organization: string;
  sponsorship_type: string;
  total_amount: number;
  registration_status: string;
  created_at: string;
  country: string;
}

// Fetch sponsors (registrations with participation_type = 'sponsor')
const fetchSponsors = async (): Promise<SponsorRegistration[]> => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('participation_type', 'sponsor')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sponsors:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Calculate sponsorship statistics
const calculateSponsorshipStats = (sponsors: SponsorRegistration[]) => {
  const totalSponsors = sponsors.length;
  const totalAmount = sponsors.reduce((sum, sponsor) => sum + sponsor.total_amount, 0);
  const paidSponsors = sponsors.filter(s => s.registration_status === 'paid').length;
  const pendingSponsors = sponsors.filter(s => s.registration_status === 'pending_payment').length;
  
  // Sponsorship type distribution
  const sponsorshipTypes: Record<string, number> = {};
  sponsors.forEach(sponsor => {
    const type = sponsor.sponsorship_type || 'unknown';
    sponsorshipTypes[type] = (sponsorshipTypes[type] || 0) + 1;
  });
  
  // Country distribution
  const countries: Record<string, number> = {};
  sponsors.forEach(sponsor => {
    const country = sponsor.country || 'unknown';
    countries[country] = (countries[country] || 0) + 1;
  });
  
  return {
    totalSponsors,
    totalAmount,
    paidSponsors,
    pendingSponsors,
    sponsorshipTypes,
    countries
  };
};

const SponsorsTrackingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorRegistration | null>(null);
  
  const { data: sponsors, isLoading, error } = useQuery<SponsorRegistration[], Error>({
    queryKey: ['sponsors'],
    queryFn: fetchSponsors,
  });
  
  // Filter sponsors based on search term
  const filteredSponsors = React.useMemo(() => {
    if (!sponsors) return [];
    if (!searchTerm) return sponsors;
    
    const searchLower = searchTerm.toLowerCase();
    return sponsors.filter(sponsor => 
      sponsor.full_name.toLowerCase().includes(searchLower) ||
      sponsor.email.toLowerCase().includes(searchLower) ||
      sponsor.organization?.toLowerCase().includes(searchLower) ||
      sponsor.sponsorship_type?.toLowerCase().includes(searchLower)
    );
  }, [sponsors, searchTerm]);
  
  // Calculate statistics for charts
  const stats = React.useMemo(() => {
    if (!sponsors) return null;
    return calculateSponsorshipStats(sponsors);
  }, [sponsors]);
  
  // Prepare data for charts
  const sponsorshipTypeData = React.useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.sponsorshipTypes).map(([name, value]) => ({ name, value }));
  }, [stats]);
  
  const countryData = React.useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.countries)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 countries
  }, [stats]);
  
  const statusData = React.useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Paid', value: stats.paidSponsors },
      { name: 'Pending', value: stats.pendingSponsors }
    ];
  }, [stats]);
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const handleExportCSV = () => {
    if (!filteredSponsors.length) {
      toast.error('No data to export');
      return;
    }
    
    // Convert sponsors to CSV
    const headers = ['ID', 'Name', 'Email', 'Organization', 'Sponsorship Type', 'Amount', 'Status', 'Date'];
    const csvRows = [headers.join(',')];
    
    filteredSponsors.forEach(sponsor => {
      const row = [
        sponsor.id,
        sponsor.full_name,
        sponsor.email,
        sponsor.organization || 'N/A',
        sponsor.sponsorship_type || 'Custom',
        sponsor.total_amount,
        sponsor.registration_status,
        sponsor.created_at ? format(new Date(sponsor.created_at), 'yyyy-MM-dd') : 'N/A'
      ].map(value => `"${value}"`);
      
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tpahla-sponsors-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sponsors Tracking</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportCSV}
          disabled={isLoading || !sponsors?.length}
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Track and manage all sponsorships for TPAHLA 2025. Monitor sponsorship levels, payments, and engagement.
      </p>
      
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.totalSponsors}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sponsorship</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paid Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.paidSponsors}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{stats.pendingSponsors}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sponsorship Distribution</CardTitle>
              <CardDescription>Breakdown by sponsorship type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sponsorshipTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sponsorshipTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sponsors`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Sponsor Countries</CardTitle>
              <CardDescription>Geographic distribution of sponsors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={countryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Sponsors" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Name, Email, Organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2" disabled>
          <Filter size={16} />
          Filter
        </Button>
      </div>
      
      {/* Sponsors Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading sponsors...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Error loading sponsors: {error.message}</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all sponsors for TPAHLA 2025</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Sponsorship Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSponsors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchTerm ? 'No sponsors match your search' : 'No sponsors found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredSponsors.map((sponsor) => (
                <TableRow key={sponsor.id}>
                  <TableCell className="font-medium">{sponsor.organization || 'N/A'}</TableCell>
                  <TableCell>
                    <div>{sponsor.full_name}</div>
                    <div className="text-xs text-muted-foreground">{sponsor.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {sponsor.sponsorship_type || 'Custom'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">${sponsor.total_amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      sponsor.registration_status === 'paid' ? 'success' : 
                      sponsor.registration_status === 'cancelled' ? 'destructive' : 
                      'outline'
                    }>
                      {sponsor.registration_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sponsor.created_at ? format(new Date(sponsor.created_at), 'PPP') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedSponsor(sponsor)}
                    >
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      
      {/* Sponsor Details Dialog */}
      <Dialog open={!!selectedSponsor} onOpenChange={(open) => !open && setSelectedSponsor(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sponsor Details</DialogTitle>
            <DialogDescription>
              Viewing details for {selectedSponsor?.organization || selectedSponsor?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSponsor && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Organization Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Organization Name</p>
                      <p className="font-medium">{selectedSponsor.organization || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Country</p>
                      <p className="font-medium">{selectedSponsor.country || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sponsorship Type</p>
                      <Badge className="mt-1">{selectedSponsor.sponsorship_type || 'Custom'}</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{selectedSponsor.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedSponsor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Date</p>
                      <p className="font-medium">
                        {selectedSponsor.created_at ? format(new Date(selectedSponsor.created_at), 'PPP') : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sponsorship Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Sponsorship Amount</p>
                      <p className="text-2xl font-bold">${selectedSponsor.total_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <Badge variant={
                        selectedSponsor.registration_status === 'paid' ? 'success' : 
                        selectedSponsor.registration_status === 'cancelled' ? 'destructive' : 
                        'outline'
                      } className="text-lg px-3 py-1">
                        {selectedSponsor.registration_status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Sponsorship Benefits</h4>
                    <ul className="space-y-1 text-sm">
                      {selectedSponsor.sponsorship_type === 'Platinum Sponsorship' && (
                        <>
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
                        </>
                      )}
                      
                      {selectedSponsor.sponsorship_type === 'Gold Sponsorship' && (
                        <>
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
                            <span>Prime logo placement & media coverage</span>
                          </li>
                        </>
                      )}
                      
                      {selectedSponsor.sponsorship_type === 'Silver Sponsorship' && (
                        <>
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
                        </>
                      )}
                      
                      {selectedSponsor.sponsorship_type === 'Bronze Sponsorship' && (
                        <>
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
                        </>
                      )}
                      
                      {selectedSponsor.sponsorship_type === 'Exhibition Space' && (
                        <>
                          <li className="flex items-start">
                            <span className="text-tpahla-gold mr-2">✓</span>
                            <span>Dedicated 6-12 SQM Exhibition Booth</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-tpahla-gold mr-2">✓</span>
                            <span>Direct engagement with global participants</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-tpahla-gold mr-2">✓</span>
                            <span>Listing in event brochure and onsite signage</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-tpahla-gold mr-2">✓</span>
                            <span>Optional media feature & QR-enabled brand zone</span>
                          </li>
                        </>
                      )}
                      
                      {(!selectedSponsor.sponsorship_type || selectedSponsor.sponsorship_type === 'Custom Package') && (
                        <li className="text-muted-foreground">Custom sponsorship package - details to be confirmed</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsTrackingPage;