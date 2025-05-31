import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Award, DollarSign, CheckCircle, Clock, ListChecks, Loader2, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const fetchCategoriesCount = async () => {
  const { count, error } = await supabase
    .from('award_categories')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error("Error fetching categories count:", error);
    return null;
  }
  return count;
};

const fetchNominationsCount = async () => {
  const { count, error } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error("Error fetching nominations count:", error);
    return null;
  }
  return count;
};

const fetchRegistrationsCount = async () => {
  const { count, error } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error("Error fetching registrations count:", error);
    return null;
  }
  return count;
};

const fetchApprovedNomineesCount = async () => {
  const { count, error } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');
  
  if (error) {
    console.error("Error fetching approved nominees count:", error);
    return null;
  }
  return count;
};

const fetchPendingNomineesCount = async () => {
  const { count, error } = await supabase
    .from('nominations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'submitted');
  
  if (error) {
    console.error("Error fetching pending nominees count:", error);
    return null;
  }
  return count;
};

const fetchTotalRevenue = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select('amount')
    .eq('payment_status', 'completed');
  
  if (error) {
    console.error("Error fetching total revenue:", error);
    return 0;
  }
  
  return data.reduce((total, payment) => total + (payment.amount || 0), 0);
};

const fetchRecentTransactions = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      payment_status,
      payment_method,
      paid_at,
      registrations (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error("Error fetching recent transactions:", error);
    return [];
  }
  
  return data;
};

const fetchRecentNominations = async () => {
  const { data, error } = await supabase
    .from('nominations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error("Error fetching recent nominations:", error);
    return [];
  }
  
  return data;
};

const fetchRecentRegistrations = async () => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error("Error fetching recent registrations:", error);
    return [];
  }
  
  return data;
};

const DashboardPage = () => {
  const { data: categoriesCount, isLoading: isLoadingCategoriesCount } = useQuery({
    queryKey: ['awardCategoriesCount'],
    queryFn: fetchCategoriesCount,
  });

  const { data: nominationsCount, isLoading: isLoadingNominationsCount } = useQuery({
    queryKey: ['nominationsCount'],
    queryFn: fetchNominationsCount,
  });

  const { data: registrationsCount, isLoading: isLoadingRegistrationsCount } = useQuery({
    queryKey: ['registrationsCount'],
    queryFn: fetchRegistrationsCount,
  });

  const { data: approvedNomineesCount, isLoading: isLoadingApprovedNomineesCount } = useQuery({
    queryKey: ['approvedNomineesCount'],
    queryFn: fetchApprovedNomineesCount,
  });

  const { data: pendingNomineesCount, isLoading: isLoadingPendingNomineesCount } = useQuery({
    queryKey: ['pendingNomineesCount'],
    queryFn: fetchPendingNomineesCount,
  });

  const { data: totalRevenue, isLoading: isLoadingTotalRevenue } = useQuery({
    queryKey: ['totalRevenue'],
    queryFn: fetchTotalRevenue,
  });

  const { data: recentTransactions, isLoading: isLoadingRecentTransactions } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: fetchRecentTransactions,
  });

  const { data: recentNominations, isLoading: isLoadingRecentNominations } = useQuery({
    queryKey: ['recentNominations'],
    queryFn: fetchRecentNominations,
  });

  const { data: recentRegistrations, isLoading: isLoadingRecentRegistrations } = useQuery({
    queryKey: ['recentRegistrations'],
    queryFn: fetchRecentRegistrations,
  });

  // Display values with loading states
  const displayNominationsCount = isLoadingNominationsCount ? <Loader2 className="h-5 w-5 animate-spin" /> : (nominationsCount ?? "0");
  const displayRegistrationsCount = isLoadingRegistrationsCount ? <Loader2 className="h-5 w-5 animate-spin" /> : (registrationsCount ?? "0");
  const displayTotalRevenue = isLoadingTotalRevenue ? <Loader2 className="h-5 w-5 animate-spin" /> : `$${(totalRevenue ?? 0).toLocaleString()}`;
  const displayApprovedNomineesCount = isLoadingApprovedNomineesCount ? <Loader2 className="h-5 w-5 animate-spin" /> : (approvedNomineesCount ?? "0");
  const displayPendingNomineesCount = isLoadingPendingNomineesCount ? <Loader2 className="h-5 w-5 animate-spin" /> : (pendingNomineesCount ?? "0");
  const displayCategoriesCount = isLoadingCategoriesCount ? <Loader2 className="h-5 w-5 animate-spin" /> : (categoriesCount ?? "0");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nominations</CardTitle>
            <Award className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayNominationsCount}</div>
            <p className="text-xs text-muted-foreground">Total nominations submitted</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Members</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayRegistrationsCount}</div>
            <p className="text-xs text-muted-foreground">Total registrations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayTotalRevenue}</div>
            <p className="text-xs text-muted-foreground">From all completed payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Nominees</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayApprovedNomineesCount}</div>
            <p className="text-xs text-muted-foreground">Approved nominations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayPendingNomineesCount}</div>
            <p className="text-xs text-muted-foreground">Nominations awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayCategoriesCount}</div>
            <p className="text-xs text-muted-foreground">Current award categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment activities</CardDescription>
            </div>
            <Link to="/admin/transactions">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingRecentTransactions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentTransactions && recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{transaction.registrations?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{transaction.registrations?.email || 'No email'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${transaction.amount?.toLocaleString() || '0'}</p>
                      <Badge variant={transaction.payment_status === 'completed' ? 'success' : 'outline'}>
                        {transaction.payment_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No transactions found</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>Latest registration submissions</CardDescription>
            </div>
            <Link to="/admin/registrations">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingRecentRegistrations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentRegistrations && recentRegistrations.length > 0 ? (
              <div className="space-y-4">
                {recentRegistrations.map((registration) => (
                  <div key={registration.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{registration.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{registration.email || 'No email'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">${registration.total_amount.toLocaleString()}</p>
                      <Badge variant={
                        registration.registration_status === 'paid' ? 'success' : 
                        registration.registration_status === 'cancelled' ? 'destructive' : 
                        'outline'
                      }>
                        {registration.registration_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No registrations found</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Nomination Entries</CardTitle>
              <CardDescription>Latest nomination submissions</CardDescription>
            </div>
            <Link to="/admin/nominees">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingRecentNominations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentNominations && recentNominations.length > 0 ? (
              <div className="space-y-4">
                {recentNominations.map((nomination) => (
                  <div key={nomination.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{nomination.nominee_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">ID: {nomination.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        nomination.status === 'approved' ? 'success' : 
                        nomination.status === 'rejected' ? 'destructive' : 
                        'outline'
                      }>
                        {nomination.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No nominations found</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Frequently used admin actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/categories">
                <Button variant="outline" className="w-full justify-start">
                  <Folder className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
              <Link to="/admin/nominees">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Review Nominations
                </Button>
              </Link>
              <Link to="/admin/registrations">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Manage Registrations
                </Button>
              </Link>
              <Link to="/admin/transactions">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  View Transactions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;