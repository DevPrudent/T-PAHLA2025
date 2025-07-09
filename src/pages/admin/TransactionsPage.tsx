import { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  Loader2, 
  AlertCircle, 
  Filter, 
  Calendar, 
  CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import PaginatedTable from '@/components/admin/PaginatedTable';

interface Transaction {
  id: string;
  amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
  paid_at: string | null;
  transaction_id: string | null;
  registration: {
    full_name: string;
    email: string;
    participation_type: string;
  } | null;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, [selectedDate]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('payments')
        .select(`
          id,
          amount,
          payment_status,
          payment_method,
          created_at,
          paid_at,
          transaction_id,
          registrations (
            full_name,
            email,
            participation_type
          )
        `)
        .order('created_at', { ascending: false });
      
      // Add date filter if provided
      if (selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        // Filter by date (this assumes created_at is in ISO format)
        query = query.gte('created_at', `${dateStr}T00:00:00`)
                    .lt('created_at', `${dateStr}T23:59:59`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!filteredTransactions.length) {
      toast.error('No data to export');
      return;
    }
    
    // Convert transactions to CSV
    const headers = ['ID', 'Date', 'Name', 'Email', 'Amount', 'Method', 'Status', 'Transaction ID'];
    const csvRows = [headers.join(',')];
    
    filteredTransactions.forEach(tx => {
      const row = [
        tx.id,
        tx.created_at ? format(new Date(tx.created_at), 'yyyy-MM-dd') : 'N/A',
        tx.registration?.full_name || 'Unknown',
        tx.registration?.email || 'Unknown',
        tx.amount,
        tx.payment_method || 'N/A',
        tx.payment_status,
        tx.transaction_id || 'N/A'
      ].map(value => `"${value}"`);
      
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tpahla-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (!searchTerm && !selectedStatus) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (tx.id && tx.id.toLowerCase().includes(searchLower)) ||
      (tx.registration?.full_name && tx.registration.full_name.toLowerCase().includes(searchLower)) ||
      (tx.registration?.email && tx.registration.email.toLowerCase().includes(searchLower)) ||
      (tx.transaction_id && tx.transaction_id.toLowerCase().includes(searchLower));
    
    const matchesStatus = !selectedStatus || tx.payment_status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const columns = [
    { 
      header: 'Transaction ID', 
      accessor: (row: Transaction) => row.transaction_id || row.id,
      className: 'font-mono text-xs'
    },
    { 
      header: 'Date', 
      accessor: (row: Transaction) => {
        const date = row.paid_at || row.created_at;
        return date ? format(new Date(date), 'PPP') : 'N/A';
      }
    },
    { 
      header: 'Participant', 
      accessor: (row: Transaction) => (
        <div>
          <div className="font-medium">{row.registration?.full_name || 'Unknown'}</div>
          <div className="text-xs text-muted-foreground">{row.registration?.email || 'No email'}</div>
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: (row: Transaction) => (
        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-gray-200 bg-gray-100 text-gray-800">
          {row.registration?.participation_type || 'Unknown'}
        </span>
      )
    },
    { 
      header: 'Amount', 
      accessor: (row: Transaction) => `$${row.amount?.toLocaleString() || '0'}`
    },
    { 
      header: 'Payment Method', 
      accessor: (row: Transaction) => (
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.payment_method || 'Unknown'}
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (row: Transaction) => {
        const statusVariant = 
          row.payment_status === 'completed' ? 'success' :
          row.payment_status === 'failed' || row.payment_status === 'cancelled' ? 'destructive' :
          'outline';
        
        return (
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold 
            ${statusVariant === 'success' ? 'border-transparent bg-green-100 text-green-800' : 
              statusVariant === 'destructive' ? 'border-transparent bg-red-100 text-red-800' : 
              'border-gray-200 bg-gray-100 text-gray-800'}`}>
            {row.payment_status}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">View Transactions</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportCSV}
          disabled={isLoading || !transactions.length}
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Full transaction logs for all award nominations and registration payments. 
        You can search, filter, and export transaction data.
      </p>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Error loading transactions: {error}</p>
        </div>
      ) : (
        <PaginatedTable
          data={filteredTransactions}
          columns={columns}
          caption="A list of all transactions"
          itemsPerPage={10}
          searchPlaceholder="Search by ID, Name, Email..."
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
          showDateFilter={true}
          onDateChange={setSelectedDate}
          selectedDate={selectedDate}
          showStatusFilter={true}
          statusOptions={statusOptions}
          onStatusChange={setSelectedStatus}
          selectedStatus={selectedStatus}
        />
      )}
    </div>
  );
};

export default TransactionsPage;