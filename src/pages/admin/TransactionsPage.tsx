import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Search, 
  Loader2, 
  AlertCircle, 
  Filter, 
  Calendar, 
  CreditCard 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
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
    if (!transactions.length) {
      toast.error('No data to export');
      return;
    }
    
    // Convert transactions to CSV
    const headers = ['ID', 'Date', 'Name', 'Email', 'Amount', 'Method', 'Status', 'Transaction ID'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(tx => {
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
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (tx.id && tx.id.toLowerCase().includes(searchLower)) ||
      (tx.registration?.full_name && tx.registration.full_name.toLowerCase().includes(searchLower)) ||
      (tx.registration?.email && tx.registration.email.toLowerCase().includes(searchLower)) ||
      (tx.transaction_id && tx.transaction_id.toLowerCase().includes(searchLower))
    );
  });

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
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by ID, Name, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" disabled>
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2" disabled>
            <Calendar size={16} />
            Date Range
          </Button>
        </div>
      </div>
      
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
        <Table>
          <TableCaption>A list of all transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchTerm ? 'No transactions match your search' : 'No transactions found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-xs">{transaction.transaction_id || transaction.id}</TableCell>
                  <TableCell>
                    {transaction.paid_at 
                      ? format(new Date(transaction.paid_at), 'PPP') 
                      : transaction.created_at 
                        ? format(new Date(transaction.created_at), 'PPP')
                        : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.registration?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{transaction.registration?.email || 'No email'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {transaction.registration?.participation_type || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">${transaction.amount?.toLocaleString() || '0'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      {transaction.payment_method || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      transaction.payment_status === 'completed' ? 'success' :
                      transaction.payment_status === 'failed' ? 'destructive' :
                      'outline'
                    }>
                      {transaction.payment_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TransactionsPage;