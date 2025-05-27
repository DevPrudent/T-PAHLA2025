
import React, { useState } from "react"; // Added useState
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
  SidebarMenuSub, // Added for submenus
  SidebarMenuSubItem, // Added for submenus
  SidebarMenuSubButton, // Added for submenus
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
  ChevronDown, // Added for submenu toggle icon
  ChevronRight, // Added for submenu toggle icon
  FileCheck2, // Icon for Completed Nominations
  FileClock, // Icon for Incomplete Nominations
  UserCheck, // Icon for Approved Nominees
  UserX, // Icon for Rejected Nominees
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define a type for nav items that supports children for submenus
type AdminNavItem = {
  href?: string;
  label: string;
  icon: React.ElementType;
  children?: AdminNavItem[];
  onClick?: () => void; // For items that toggle submenus
  isInitiallyOpen?: boolean; // To control initial open state for submenus
  parentPath?: string; // To help with isActive logic for children
};

export function AdminSidebar() {
  const location = useLocation();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State for controlling submenu visibility
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    nominations: location.pathname.startsWith("/admin/nominations"),
    nominee: location.pathname.startsWith("/admin/nominees/status"), // Adjusted path for clarity
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const adminNavItems: AdminNavItem[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Award Categories", icon: Folder },
    { 
      label: "Nominations", 
      icon: Users, 
      onClick: () => toggleSubmenu("nominations"),
      isInitiallyOpen: openSubmenus.nominations,
      parentPath: "/admin/nominations",
      children: [
        { href: "/admin/nominations/completed", label: "Completed", icon: FileCheck2 },
        { href: "/admin/nominations/incomplete", label: "Incomplete", icon: FileClock },
      ]
    },
    { 
      label: "Nominee Status", // Changed label to avoid conflict with /admin/nominees route
      icon: Users,  // Can use a different icon if desired
      onClick: () => toggleSubmenu("nominee"),
      isInitiallyOpen: openSubmenus.nominee,
      parentPath: "/admin/nominees/status", // Unique parent path
      children: [
        { href: "/admin/nominees/status/approved", label: "Approved", icon: UserCheck },
        { href: "/admin/nominees/status/rejected", label: "Rejected", icon: UserX },
      ]
    },
    { href: "/admin/transactions", label: "Transactions", icon: ListChecks },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };
  
  const isSubmenuItemActive = (itemHref: string) => {
    return location.pathname === itemHref || location.pathname.startsWith(itemHref + "/");
  };

  const isParentActive = (item: AdminNavItem) => {
    if (item.href && (location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href)))) {
        return true;
    }
    if (item.children) {
        return item.children.some(child => child.href && isSubmenuItemActive(child.href));
    }
    return false;
  };


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
                <SidebarMenuItem key={item.label}>
                  {item.children ? (
                    <>
                      <SidebarMenuButton
                        onClick={item.onClick}
                        isActive={isParentActive(item)}
                        className="justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                        {openSubmenus[item.label.toLowerCase().replace(/\s+/g, '')] || item.isInitiallyOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </SidebarMenuButton>
                      {(openSubmenus[item.label.toLowerCase().replace(/\s+/g, '')] || item.isInitiallyOpen) && (
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.label}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={child.href ? isSubmenuItemActive(child.href) : false}
                              >
                                <Link to={child.href || "#"}>
                                  <child.icon className="h-4 w-4 mr-1" /> 
                                  {child.label}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={item.href ? isParentActive(item) : false}
                    >
                      <Link to={item.href || "#"}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
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
