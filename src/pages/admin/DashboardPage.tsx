
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Award, DollarSign, CheckCircle, Clock, ListChecks, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fetchCategoriesCount = async () => {
  const { count, error } = await supabase
    .from('award_categories')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error("Error fetching categories count:", error);
    return null; // Or throw error
  }
  return count;
};

const DashboardPage = () => {
  const { data: categoriesCount, isLoading: isLoadingCategoriesCount } = useQuery({
    queryKey: ['awardCategoriesCount'],
    queryFn: fetchCategoriesCount,
  });

  const stats = [
    { title: "Total Nominations", value: "0", icon: Award, change: "+0%" },
    { title: "Registered Members", value: "0", icon: Users, change: "+0%" },
    { title: "Total Inflow", value: "₦0", icon: DollarSign, change: "+0%" },
    { title: "Approved Nominees", value: "0", icon: CheckCircle, change: "+0%" },
    { title: "Pending Approvals", value: "0", icon: Clock, change: "-0%" },
  ];

  // Add categories count to stats if available
  const displayCategoriesCount = isLoadingCategoriesCount ? <Loader2 className="h-5 w-5 animate-spin" /> : (categoriesCount ?? "N/A");


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"> {/* Adjusted xl:grid-cols-3 for 6 cards */}
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
        {/* Category Count Card */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              <ListChecks className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayCategoriesCount}
              </div>
              <p className="text-xs text-muted-foreground">Current award categories</p>
            </CardContent>
          </Card>
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
