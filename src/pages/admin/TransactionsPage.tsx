
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
import { Download } from "lucide-react";

// Mock transaction data for demonstration
const mockTransactions = [
  { 
    id: "TX123456", 
    date: "2025-05-18", 
    name: "John Smith", 
    amount: "₦25,000", 
    method: "Card", 
    status: "Successful" 
  },
  { 
    id: "TX123457", 
    date: "2025-05-17", 
    name: "Jane Doe", 
    amount: "₦15,000", 
    method: "Bank Transfer", 
    status: "Successful" 
  },
  { 
    id: "TX123458", 
    date: "2025-05-15", 
    name: "Robert Johnson", 
    amount: "₦10,000", 
    method: "Card", 
    status: "Failed" 
  },
  { 
    id: "TX123459", 
    date: "2025-05-14", 
    name: "Sarah Williams", 
    amount: "₦30,000", 
    method: "USSD", 
    status: "Successful" 
  }
];

const TransactionsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">View Transactions</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Full transaction logs for all award nominations payments. 
        You can search, filter, and export transaction data.
      </p>
      
      <Table>
        <TableCaption>A list of your recent transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Nominee</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.name}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.method}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === "Successful" ? "bg-green-100 text-green-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {transaction.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsPage;
