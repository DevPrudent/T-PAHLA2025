
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Folder, 
  Users, 
  ListChecks, 
  Settings, 
  BarChart3, 
  LogOut, 
  MessageSquare,
  FileText,
  FileCheck2,
  FileClock,
  ChevronDown,
  CheckBadge // Example, assuming you might want a different icon for "Approved"
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/nominees", label: "Approved Nominees", icon: Users }, // Changed label
  { href: "/admin/transactions", label: "Transactions", icon: ListChecks },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

// Future items (can be added later)
const futureAdminNavItems = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const location = useLocation();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isNominationsOpen, setIsNominationsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
      // AuthContext's signOut already navigates to /admin/login
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  // Check if current path is under /admin/nominations/* for active state of parent
  const isNominationsPathActive = location.pathname.startsWith("/admin/nominations");
  const isCompletedNominationsActive = location.pathname === "/admin/nominations/completed";
  const isIncompleteNominationsActive = location.pathname === "/admin/nominations/incomplete";
  const isApprovedNominationsActive = location.pathname === "/admin/nominees";


  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <img alt="TPAHLA Logo" className="h-10" src="/lovable-uploads/62fe4193-0108-4af1-94b9-a45993de1c9d.png" />
          <span className="font-semibold text-lg text-tpahla-gold">Admin Panel</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                        location.pathname === item.href || 
                        (item.href === "/admin/nominees" && isApprovedNominationsActive) ||
                        (item.href !== "/admin" && item.href !== "/admin/nominees" && location.pathname.startsWith(item.href))
                    }
                  >
                    <Link to={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsNominationsOpen(!isNominationsOpen)}
                  isActive={isNominationsPathActive}
                  className="w-full justify-between"
                  data-state={isNominationsOpen ? 'open' : 'closed'}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Nominations</span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isNominationsOpen && "rotate-180"
                    )} 
                  />
                </SidebarMenuButton>
                {isNominationsOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild 
                        isActive={isCompletedNominationsActive}
                      >
                        <Link to="/admin/nominations/completed">
                          <FileCheck2 className="h-4 w-4 mr-2" />
                          Completed
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild 
                        isActive={isIncompleteNominationsActive}
                      >
                        <Link to="/admin/nominations/incomplete">
                          <FileClock className="h-4 w-4 mr-2" />
                          Incomplete
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        {user && (
          <div className="mb-4 text-sm text-muted-foreground">
            Logged in as: <span className="font-medium">{user.email}</span>
          </div>
        )}
        <Button variant="outline" className="w-full" onClick={handleLogout} disabled={authLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
