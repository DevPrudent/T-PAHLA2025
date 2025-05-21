
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
import { CheckCircle, XCircle, Eye } from "lucide-react";

// Mock nominees data for demonstration
const mockNominees = [
  { 
    id: "N001", 
    name: "Dr. Aminata Diallo", 
    email: "aminata@example.com", 
    category: "Healthcare Leadership",
    date: "2025-05-10", 
    status: "Approved" 
  },
  { 
    id: "N002", 
    name: "Khalid Mensah", 
    email: "khalid@example.com", 
    category: "Youth Empowerment",
    date: "2025-05-12", 
    status: "Pending" 
  },
  { 
    id: "N003", 
    name: "Fatima Osei", 
    email: "fatima@example.com", 
    category: "Education Innovation",
    date: "2025-05-15", 
    status: "Pending" 
  },
  { 
    id: "N004", 
    name: "Nelson Adeyemi", 
    email: "nelson@example.com", 
    category: "Community Development",
    date: "2025-05-08", 
    status: "Rejected" 
  }
];

const NomineesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Nominees</h1>
        <div className="space-x-2">
          <Button variant="outline">Filter</Button>
          <Button variant="secondary">Bulk Actions</Button>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Review and manage all nominees. You can view entries, approve/reject nominees, and perform bulk actions.
      </p>
      
      <Table>
        <TableCaption>List of all nominees</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <input type="checkbox" className="rounded" />
            </TableHead>
            <TableHead>Nominee Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockNominees.map((nominee) => (
            <TableRow key={nominee.id}>
              <TableCell>
                <input type="checkbox" className="rounded" />
              </TableCell>
              <TableCell className="font-medium">{nominee.name}</TableCell>
              <TableCell>{nominee.email}</TableCell>
              <TableCell>{nominee.category}</TableCell>
              <TableCell>{nominee.date}</TableCell>
              <TableCell>
                <Badge variant={
                  nominee.status === "Approved" ? "success" : 
                  nominee.status === "Pending" ? "outline" : "destructive"
                }>
                  {nominee.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                  {nominee.status === "Pending" && (
                    <>
                      <Button size="sm" variant="ghost" className="text-green-600">
                        <CheckCircle size={16} className="mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600">
                        <XCircle size={16} className="mr-1" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NomineesPage;
