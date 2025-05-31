import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Loader2, AlertCircle, Inbox } from "lucide-react";
import { format } from 'date-fns';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

type RegistrationRow = Database['public']['Tables']['registrations']['Row'];

const fetchPendingRegistrations = async (): Promise<RegistrationRow[]> => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('registration_status', 'pending_payment')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending registrations:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const PendingRegistrationsPage = () => {
  const { data: registrations, isLoading, error } = useQuery<RegistrationRow[], Error>({
    queryKey: ['pendingRegistrations'],
    queryFn: fetchPendingRegistrations,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading pending registrations...</p>
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
        <p className="mt-4 text-muted-foreground">No pending registrations found.</p>
        <p className="text-sm text-muted-foreground">All registrations have been processed or no registrations have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pending Registrations</h1>
      </div>
      
      <p className="text-muted-foreground">
        These registrations are awaiting payment. You can view details or mark them as paid manually.
      </p>
      
      <Table>
        <TableCaption>List of registrations pending payment.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration) => {
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
                <TableCell className="text-right">
                  <Link to={`/admin/registrations?id=${registration.id}`}>
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingRegistrationsPage;