import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  Inbox, 
  Eye, 
  Mail, 
  Check, 
  X, 
  Clock 
} from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';

// Define types for sponsorship inquiries
interface SponsorshipInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  sponsorship_type: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'declined';
  created_at: string;
  updated_at: string;
  notes: string;
}

// Simulated data - in a real app, this would come from your database
const mockInquiries: SponsorshipInquiry[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1234567890',
    organization: 'Global Health Initiative',
    sponsorship_type: 'Platinum Sponsorship',
    message: 'We are interested in becoming a platinum sponsor for TPAHLA 2025. Please provide more details about the benefits and visibility opportunities.',
    status: 'new',
    created_at: '2025-05-15T10:30:00Z',
    updated_at: '2025-05-15T10:30:00Z',
    notes: ''
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@techforgood.org',
    phone: '+2345678901',
    organization: 'Tech For Good Foundation',
    sponsorship_type: 'Gold Sponsorship',
    message: 'Our foundation is looking to support humanitarian initiatives in Africa. We would like to discuss gold sponsorship options.',
    status: 'contacted',
    created_at: '2025-05-10T14:45:00Z',
    updated_at: '2025-05-12T09:15:00Z',
    notes: 'Called on May 12, scheduled follow-up meeting for May 20.'
  },
  {
    id: '3',
    name: 'Michael Wong',
    email: 'm.wong@africandev.org',
    phone: '+3456789012',
    organization: 'African Development Partners',
    sponsorship_type: 'Silver Sponsorship',
    message: 'We are considering sponsoring TPAHLA 2025 at the silver level. Please send us the detailed sponsorship package.',
    status: 'converted',
    created_at: '2025-05-05T11:20:00Z',
    updated_at: '2025-05-14T16:30:00Z',
    notes: 'Confirmed silver sponsorship on May 14. Payment pending.'
  },
  {
    id: '4',
    name: 'Amina Diallo',
    email: 'a.diallo@greenfuture.org',
    phone: '+4567890123',
    organization: 'Green Future Initiative',
    sponsorship_type: 'Bronze Sponsorship',
    message: 'We are a small NGO focused on environmental sustainability. We would like to know more about the bronze sponsorship package.',
    status: 'declined',
    created_at: '2025-05-08T09:10:00Z',
    updated_at: '2025-05-13T13:45:00Z',
    notes: 'Budget constraints, will reconsider for next year.'
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@globalaid.org',
    phone: '+5678901234',
    organization: 'Global Aid Network',
    sponsorship_type: 'Custom Package',
    message: 'We are interested in a custom sponsorship package that focuses on our youth empowerment initiatives. Please contact us to discuss options.',
    status: 'new',
    created_at: '2025-05-14T16:50:00Z',
    updated_at: '2025-05-14T16:50:00Z',
    notes: ''
  }
];

// In a real app, this would fetch from your database
const fetchSponsorshipInquiries = async (): Promise<SponsorshipInquiry[]> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockInquiries;
};

const SponsorshipInquiriesPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<SponsorshipInquiry | null>(null);
  const [notes, setNotes] = useState('');
  
  const { data: inquiries, isLoading, error } = useQuery<SponsorshipInquiry[], Error>({
    queryKey: ['sponsorshipInquiries'],
    queryFn: fetchSponsorshipInquiries,
  });
  
  // Filter inquiries based on search term
  const filteredInquiries = React.useMemo(() => {
    if (!inquiries) return [];
    if (!searchTerm) return inquiries;
    
    const searchLower = searchTerm.toLowerCase();
    return inquiries.filter(inquiry => 
      inquiry.name.toLowerCase().includes(searchLower) ||
      inquiry.email.toLowerCase().includes(searchLower) ||
      inquiry.organization.toLowerCase().includes(searchLower) ||
      inquiry.sponsorship_type.toLowerCase().includes(searchLower)
    );
  }, [inquiries, searchTerm]);
  
  // Simulated mutation for updating inquiry status
  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would update your database
      return { id, status, notes };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['sponsorshipInquiries'], (oldData: SponsorshipInquiry[] | undefined) => {
        if (!oldData) return [];
        
        return oldData.map(inquiry => 
          inquiry.id === data.id 
            ? { 
                ...inquiry, 
                status: data.status as any, 
                notes: data.notes,
                updated_at: new Date().toISOString()
              } 
            : inquiry
        );
      });
      
      toast.success(`Inquiry status updated to ${data.status}`);
      setSelectedInquiry(null);
    },
    onError: (error) => {
      toast.error(`Failed to update inquiry: ${error.message}`);
    }
  });
  
  const handleUpdateStatus = (id: string, status: string) => {
    updateInquiryMutation.mutate({ id, status, notes });
  };
  
  const handleViewInquiry = (inquiry: SponsorshipInquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">New</Badge>;
      case 'contacted':
        return <Badge variant="secondary">Contacted</Badge>;
      case 'converted':
        return <Badge variant="success">Converted</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sponsorship Inquiries</h1>
      </div>
      
      <p className="text-muted-foreground">
        Manage and track all sponsorship inquiries for TPAHLA 2025. Update status, add notes, and follow up with potential sponsors.
      </p>
      
      {/* Statistics Cards */}
      {inquiries && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inquiries</p>
                  <p className="text-2xl font-bold">{inquiries.length}</p>
                </div>
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">New</p>
                  <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'new').length}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Converted</p>
                  <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'converted').length}</p>
                </div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {inquiries.length > 0 
                      ? `${Math.round((inquiries.filter(i => i.status === 'converted').length / inquiries.length) * 100)}%` 
                      : '0%'}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by Name, Email, Organization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full max-w-md" 
        />
      </div>
      
      {/* Inquiries Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading sponsorship inquiries...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Error loading inquiries: {error.message}</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all sponsorship inquiries</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Sponsorship Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm ? 'No inquiries match your search' : 'No sponsorship inquiries found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.organization}</TableCell>
                  <TableCell>
                    <div>{inquiry.name}</div>
                    <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {inquiry.sponsorship_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(inquiry.created_at), 'PPP')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(inquiry.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewInquiry(inquiry)}
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
      
      {/* Inquiry Details Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sponsorship Inquiry Details</DialogTitle>
            <DialogDescription>
              Inquiry from {selectedInquiry?.organization} - {format(new Date(selectedInquiry?.created_at || new Date()), 'PPP')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Organization Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Organization Name</p>
                      <p className="font-medium">{selectedInquiry.organization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sponsorship Type</p>
                      <Badge className="mt-1">{selectedInquiry.sponsorship_type}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
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
                      <p className="font-medium">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedInquiry.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inquiry Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-tpahla-text-secondary whitespace-pre-wrap">{selectedInquiry.message}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes & Follow-up</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Internal Notes</Label>
                    <Textarea 
                      id="notes" 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="Add notes about follow-up actions, conversations, etc."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`mailto:${selectedInquiry.email}`)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'contacted')}
                      disabled={selectedInquiry.status === 'contacted'}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Mark as Contacted
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'converted')}
                      disabled={selectedInquiry.status === 'converted'}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Converted
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'declined')}
                      disabled={selectedInquiry.status === 'declined'}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Mark as Declined
                    </Button>
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

export default SponsorshipInquiriesPage;