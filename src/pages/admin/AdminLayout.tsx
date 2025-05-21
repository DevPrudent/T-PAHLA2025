import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import NotificationBanner from "@/components/common/NotificationBanner";

const AdminLayout = () => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/admin/login', { replace: true });
    }
  }, [session, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null; 
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-muted/40">
        <NotificationBanner />
        <div className="flex flex-1">
          <AdminSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
              <SidebarTrigger className="sm:hidden" />
              {/* Breadcrumbs or page title can go here */}
            </header>
            <main className="flex-1 p-4 sm:px-6 sm:py-0">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
