import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { 
  Eye, 
  Loader2, 
  AlertCircle, 
  Inbox, 
  Download,
  Mail,
  Phone,
  User,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { format } from 'date-fns';
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
import { Badge } from "@/components/ui/badge";
import PaginatedTable from '@/components/admin/PaginatedTable';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type RegistrationRow = Database['public']['Tables']['registrations']['Row'];
type RegistrationStatusEnum = Database['public']['Enums']['registration_status_enum'];

const fetchRegistrations = async (date?: Date): Promise<RegistrationRow[]> => {
  let query = supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Add date filter if provided
  if (date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    // Filter by date (this assumes created_at is in ISO format)
    query = query.gte('created_at', `${dateStr}T00:00:00`)
                .lt('created_at', `${dateStr}T23:59:59`);
  }

  const { data, error } = await query;

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  const { data: registrations, isLoading, error, refetch } = useQuery<RegistrationRow[], Error>({
    queryKey: ['registrations', selectedDate?.toISOString().split('T')[0]],
    queryFn: () => fetchRegistrations(selectedDate),
  });

  // Refetch when date changes
  React.useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  // Filtered registrations based on search term and status (client-side for now)
  const filteredRegistrations = React.useMemo(() => {
    if (!registrations) return [];
    
    return registrations.filter(registration => {
      // Apply search filter
      const matchesSearch = !searchTerm || 
        (registration.id && registration.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (registration.full_name && registration.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (registration.email && registration.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (registration.phone && registration.phone.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply status filter
      const matchesStatus = selectedStatus === 'all' || !selectedStatus || registration.registration_status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [registrations, searchTerm, selectedStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex);

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

  const sendPaymentReminders = async (sendToAll = false, specificRegistrationId = null) => {
    setIsSendingReminders(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-payment-reminder', {
        body: {
          registrationId: specificRegistrationId,
          sendToAll: sendToAll
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success(`Payment reminders sent: ${data.successCount} successful, ${data.failureCount} failed`);
    } catch (error) {
      console.error('Error sending payment reminders:', error);
      toast.error(`Failed to send payment reminders: ${error.message}`);
    } finally {
      setIsSendingReminders(false);
    }
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending_payment', label: 'Pending Payment' },
    { value: 'paid', label: 'Paid' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const columns = [
    { 
      header: 'Name', 
      accessor: 'full_name',
      className: 'font-medium'
    },
    { 
      header: 'Email', 
      accessor: 'email'
    },
    { 
      header: 'Type', 
      accessor: (row: RegistrationRow) => (
        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-gray-200 bg-gray-100 text-gray-800">
          {row.participation_type}
        </span>
      )
    },
    { 
      header: 'Amount', 
      accessor: (row: RegistrationRow) => `$${row.total_amount.toLocaleString()}`
    },
    { 
      header: 'Date', 
      accessor: (row: RegistrationRow) => {
        const submissionDate = row.submitted_at || row.created_at;
        return submissionDate ? format(new Date(submissionDate), 'PP') : 'N/A';
      }
    },
    { 
      header: 'Status', 
      accessor: (row: RegistrationRow) => {
        const statusVariant = 
          row.registration_status === "paid" ? "success" : 
          row.registration_status === "cancelled" ? "destructive" :
          "outline";
        
        return (
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold 
            ${statusVariant === 'success' ? 'border-transparent bg-green-100 text-green-800' : 
              statusVariant === 'destructive' ? 'border-transparent bg-red-100 text-red-800' : 
              'border-gray-200 bg-gray-100 text-gray-800'}`}>
            {row.registration_status || 'N/A'}
          </span>
        );
      }
    },
  ];

  const renderRowActions = (registration: RegistrationRow) => (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="ghost" onClick={() => handleViewDetails(registration)}>
        <Eye size={16} className="mr-1" /> View
      </Button>
      {registration.registration_status === "pending_payment" && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-blue-600 hover:text-blue-700"
          onClick={() => sendPaymentReminders(false, registration.id)}
          disabled={isSendingReminders}
        >
          {isSendingReminders ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Mail size={16} className="mr-1" />}
          Send Reminder
        </Button>
      )}
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
  );

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
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isSendingReminders || !registrations?.some(r => r.registration_status === 'pending_payment')}
              >
                {isSendingReminders ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail size={16} />}
                Send Payment Reminders
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Send Payment Reminders</AlertDialogTitle>
                <AlertDialogDescription>
                  This will send payment reminder emails to all registrations with pending payment status. 
                  The emails will include the payment link and registration details.
                  Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => sendPaymentReminders(true)}>
                  Send Reminders
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Review and manage all registrations. You can view details and update status.
      </p>

      <PaginatedTable
        data={filteredRegistrations} 
        columns={columns}
        caption={`List of all registrations (${filteredRegistrations.length} total).`}
        itemsPerPage={10}
        searchPlaceholder="Search by ID, Name, Email, Phone..."
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        showDateFilter={true}
        onDateChange={setSelectedDate}
        selectedDate={selectedDate}
        showStatusFilter={true}
        statusOptions={statusOptions}
        onStatusChange={setSelectedStatus}
        selectedStatus={selectedStatus}
        renderRowActions={renderRowActions}
      />

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