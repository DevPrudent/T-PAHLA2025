import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
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
  Eye, 
  Loader2, 
  AlertCircle, 
  Inbox, 
  Search, 
  Download,
  Mail,
  Phone,
  User,
  Calendar
} from "lucide-react";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type RegistrationRow = Database['public']['Tables']['registrations']['Row'];
type RegistrationStatusEnum = Database['public']['Enums']['registration_status_enum'];

const fetchRegistrations = async (): Promise<RegistrationRow[]> => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrations:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const RegistrationsPage = () => {
  const queryClient = useQueryClient();
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: registrations, isLoading, error } = useQuery<RegistrationRow[], Error>({
    queryKey: ['registrations'],
    queryFn: fetchRegistrations,
  });

  const filteredRegistrations = React.useMemo(() => {
    if (!registrations) return [];
    if (!searchTerm) return registrations;
    return registrations.filter(registration => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (registration.id && registration.id.toLowerCase().includes(searchLower)) ||
        (registration.full_name && registration.full_name.toLowerCase().includes(searchLower)) ||
        (registration.email && registration.email.toLowerCase().includes(searchLower)) ||
        (registration.phone && registration.phone.toLowerCase().includes(searchLower))
      );
    });
  }, [registrations, searchTerm]);

  const updateStatusMutation = useMutation<
    RegistrationRow | null,
    Error,
    { registrationId: string; status: RegistrationStatusEnum }
  >({
    mutationFn: async ({ registrationId, status }) => {
      const { data, error: updateError } = await supabase
        .from('registrations')
        .update({ registration_status: status, updated_at: new Date().toISOString() })
        .eq('id', registrationId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating registration status:', updateError);
        throw updateError;
      }
      return data;
    },
    onSuccess: (updatedRegistration) => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      toast.success(`Registration status updated to ${updatedRegistration?.registration_status}!`);
    },
    onError: (err) => {
      toast.error(`Failed to update status: ${err.message}`);
    },
  });

  const handleUpdateStatus = (registrationId: string, status: RegistrationStatusEnum) => {
    updateStatusMutation.mutate({ registrationId, status });
  };

  const handleViewDetails = (registration: RegistrationRow) => {
    setSelectedRegistration(registration);
  };

  const handleExportCSV = () => {
    if (!filteredRegistrations.length) {
      toast.error('No data to export');
      return;
    }
    
    // Convert registrations to CSV
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'Type', 'Status', 'Amount', 'Date'];
    const csvRows = [headers.join(',')];
    
    filteredRegistrations.forEach(reg => {
      const row = [
        reg.id,
        reg.full_name,
        reg.email,
        reg.phone,
        reg.country,
        reg.participation_type,
        reg.registration_status,
        reg.total_amount,
        reg.created_at ? format(new Date(reg.created_at), 'yyyy-MM-dd') : 'N/A'
      ].map(value => `"${value}"`);
      
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tpahla-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading registrations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Registrations</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <div className="text-center py-10">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No registrations found yet.</p>
        <p className="text-sm text-muted-foreground">Once registrations are submitted, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Registrations</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportCSV}
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Review and manage all registrations. You can view details and update status.
      </p>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by ID, Name, Email, Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full max-w-md mb-4" 
        />
      </div>
      
      <Table>
        <TableCaption>List of all registrations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRegistrations.map((registration) => {
            const submissionDate = registration.submitted_at || registration.created_at;

            return (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">{registration.full_name || 'N/A'}</TableCell>
                <TableCell>{registration.email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {registration.participation_type}
                  </Badge>
                </TableCell>
                <TableCell>${registration.total_amount.toLocaleString()}</TableCell>
                <TableCell>{submissionDate ? format(new Date(submissionDate), 'PP') : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={
                    registration.registration_status === "paid" ? "success" : 
                    registration.registration_status === "cancelled" ? "destructive" :
                    "outline" 
                  }>
                    {registration.registration_status || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleViewDetails(registration)}>
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                    {registration.registration_status === "pending_payment" && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleUpdateStatus(registration.id, 'paid')}
                      >
                        Mark as Paid
                      </Button>
                    )}
                    {registration.registration_status !== "cancelled" && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleUpdateStatus(registration.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Registration Details Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={(open) => !open && setSelectedRegistration(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Registration ID: {selectedRegistration?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRegistration && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Full Name</p>
                        <p className="text-muted-foreground">{selectedRegistration.full_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">{selectedRegistration.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">{selectedRegistration.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Registration Date</p>
                        <p className="text-muted-foreground">
                          {selectedRegistration.created_at 
                            ? format(new Date(selectedRegistration.created_at), 'PPpp') 
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Country</p>
                      <p className="text-muted-foreground">{selectedRegistration.country}</p>
                    </div>
                    {selectedRegistration.organization && (
                      <div>
                        <p className="font-medium">Organization</p>
                        <p className="text-muted-foreground">{selectedRegistration.organization}</p>
                      </div>
                    )}
                    {selectedRegistration.position && (
                      <div>
                        <p className="font-medium">Position</p>
                        <p className="text-muted-foreground">{selectedRegistration.position}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Registration Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Registration Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Participation Type</p>
                      <Badge className="mt-1">{selectedRegistration.participation_type}</Badge>
                    </div>
                    <div>
                      <p className="font-medium">Status</p>
                      <Badge 
                        variant={
                          selectedRegistration.registration_status === "paid" ? "success" : 
                          selectedRegistration.registration_status === "cancelled" ? "destructive" :
                          "outline"
                        }
                        className="mt-1"
                      >
                        {selectedRegistration.registration_status}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Nominee-specific information */}
                  {selectedRegistration.participation_type === 'nominee' && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Nominee Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedRegistration.nominee_category && (
                          <div>
                            <p className="text-sm text-muted-foreground">Award Category</p>
                            <p>{selectedRegistration.nominee_category}</p>
                          </div>
                        )}
                        {selectedRegistration.tier && (
                          <div>
                            <p className="text-sm text-muted-foreground">Recognition Tier</p>
                            <p>{selectedRegistration.tier}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Group-specific information */}
                  {selectedRegistration.participation_type === 'group' && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Group Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedRegistration.group_name && (
                          <div>
                            <p className="text-sm text-muted-foreground">Group Name</p>
                            <p>{selectedRegistration.group_name}</p>
                          </div>
                        )}
                        {selectedRegistration.group_type && (
                          <div>
                            <p className="text-sm text-muted-foreground">Group Type</p>
                            <p>{selectedRegistration.group_type}</p>
                          </div>
                        )}
                        {selectedRegistration.number_of_seats && (
                          <div>
                            <p className="text-sm text-muted-foreground">Number of Seats</p>
                            <p>{selectedRegistration.number_of_seats}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Sponsor-specific information */}
                  {selectedRegistration.participation_type === 'sponsor' && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Sponsorship Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedRegistration.sponsorship_type && (
                          <div>
                            <p className="text-sm text-muted-foreground">Sponsorship Type</p>
                            <p>{selectedRegistration.sponsorship_type}</p>
                          </div>
                        )}
                        {selectedRegistration.custom_amount && (
                          <div>
                            <p className="text-sm text-muted-foreground">Custom Amount</p>
                            <p>${selectedRegistration.custom_amount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* Payment Information */}
                  <div>
                    <h4 className="font-medium">Payment Information</h4>
                    <div className="mt-2 p-4 bg-muted rounded-md">
                      <div className="flex justify-between items-center">
                        <span>Total Amount:</span>
                        <span className="font-bold text-xl">${selectedRegistration.total_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Special Requests */}
                  {selectedRegistration.special_requests && (
                    <div>
                      <h4 className="font-medium">Special Requests</h4>
                      <p className="mt-1 p-4 bg-muted rounded-md text-muted-foreground">
                        {selectedRegistration.special_requests}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRegistration(null)}>Close</Button>
            {selectedRegistration && selectedRegistration.registration_status === "pending_payment" && (
              <Button 
                variant="default"
                onClick={() => {
                  handleUpdateStatus(selectedRegistration.id, 'paid');
                  setSelectedRegistration(null);
                }}
              >
                Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationsPage;