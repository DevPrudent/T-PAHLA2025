
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/40">
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
    </SidebarProvider>
  );
};

export default AdminLayout;
