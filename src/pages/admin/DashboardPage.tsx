
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Award, DollarSign, CheckCircle, Clock } from "lucide-react";

const DashboardPage = () => {
  // Placeholder data for stats
  const stats = [
    { title: "Total Nominations", value: "1,234", icon: Award, change: "+12%" },
    { title: "Registered Members", value: "567", icon: Users, change: "+5%" },
    { title: "Total Inflow", value: "₦10.5M", icon: DollarSign, change: "+20%" },
    { title: "Approved Nominees", value: "450", icon: CheckCircle, change: "+8%" },
    { title: "Pending Approvals", value: "32", icon: Clock, change: "-3%" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Placeholder for recent transactions table.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Transaction details will appear here.</p>
            {/* Placeholder for table component */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Nomination Entries</CardTitle>
            <CardDescription>Placeholder for recent nomination entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Nomination entries will appear here.</p>
            {/* Placeholder for list/table component */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
