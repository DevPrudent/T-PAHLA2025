import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertTitle } from '@/components/ui/alert';
import PaginatedTable from '@/components/admin/PaginatedTable';

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];

const MessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, [selectedDate]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Add date filter if provided
      if (selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        // Filter by date (this assumes created_at is in ISO format)
        query = query.gte('created_at', `${dateStr}T00:00:00`)
                    .lt('created_at', `${dateStr}T23:59:59`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }
      setMessages(data || []);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setError(err.message || "Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  // Filter messages based on search term
  const filteredMessages = messages.filter(message => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (message.first_name && message.first_name.toLowerCase().includes(searchLower)) ||
      (message.last_name && message.last_name.toLowerCase().includes(searchLower)) ||
      (message.email && message.email.toLowerCase().includes(searchLower)) ||
      (message.subject && message.subject.toLowerCase().includes(searchLower)) ||
      (message.message && message.message.toLowerCase().includes(searchLower))
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  const columns = [
    { 
      header: 'Date', 
      accessor: (row: ContactMessage) => format(new Date(row.created_at), 'PPpp')
    },
    { 
      header: 'Name', 
      accessor: (row: ContactMessage) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'N/A',
      className: 'font-medium'
    },
    { 
      header: 'Email', 
      accessor: 'email'
    },
    { 
      header: 'Subject', 
      accessor: 'subject'
    },
    { 
      header: 'Message', 
      accessor: (row: ContactMessage) => (
        <div className="max-w-xs truncate">{row.message}</div>
      ),
      className: 'max-w-xs truncate'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <CardDescription>{error}</CardDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Received Messages</CardTitle>
          <CardDescription>List of messages submitted through the contact form.</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No messages yet.</p>
            </div>
          ) : (
            <PaginatedTable
              data={currentMessages}
              columns={columns}
              caption="Contact messages received through the website"
              itemsPerPage={10}
              searchPlaceholder="Search messages..."
              onSearch={setSearchTerm}
              searchTerm={searchTerm}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              showDateFilter={true}
              onDateChange={setSelectedDate}
              selectedDate={selectedDate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesPage;