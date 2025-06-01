import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Loader2 } from "lucide-react"; // For loading state

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
      <div className="flex items-center justify-center min-h-screen bg-tpahla-darkgreen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-12 w-12 animate-spin text-tpahla-gold" />
          <p className="mt-4 text-tpahla-gold text-center">Loading admin panel...</p>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    // This case should ideally be handled by the useEffect redirect,
    // but as a fallback, prevent rendering child routes.
    return null; 
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-tpahla-neutral-light">
        <AdminSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 py-4">
            <SidebarTrigger className="sm:hidden" />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <h1 className="text-lg font-medium text-tpahla-gold">TPAHLA Admin Dashboard</h1>
            </motion.div>
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet /> {/* Render child routes only if authenticated */}
            </motion.div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;