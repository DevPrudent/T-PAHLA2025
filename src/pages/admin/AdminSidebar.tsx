import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  ChevronDown,
  ChevronRight,
  FileCheck2,
  FileClock,
  UserCheck,
  UserX,
  CreditCard,
  UserPlus,
  Clock as ClockIcon,
  CheckCircle,
  DollarSign,
  Handshake,
  Award
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type AdminNavItem = {
  href?: string;
  label: string;
  icon: React.ElementType;
  children?: AdminNavItem[];
  onClick?: () => void;
  isInitiallyOpen?: boolean;
  parentPath?: string;
  id: string;
};

export function AdminSidebar() {
  const location = useLocation();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const initialOpenSubmenus: { [key: string]: boolean } = {
    nominationsSubmenu: location.pathname.startsWith("/admin/nominations"),
    nomineeStatusSubmenu: location.pathname.startsWith("/admin/nominees/status"),
    registrationsSubmenu: location.pathname.startsWith("/admin/registrations"),
    sponsorsSubmenu: location.pathname.startsWith("/admin/sponsors"),
  };
  
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(initialOpenSubmenus);

  useEffect(() => {
    setOpenSubmenus(prev => ({
      ...prev,
      nominationsSubmenu: location.pathname.startsWith("/admin/nominations"),
      nomineeStatusSubmenu: location.pathname.startsWith("/admin/nominees/status"),
      registrationsSubmenu: location.pathname.startsWith("/admin/registrations"),
      sponsorsSubmenu: location.pathname.startsWith("/admin/sponsors"),
    }));
  }, [location.pathname]);

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const adminNavItems: AdminNavItem[] = [
    { id: "dashboard", href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { id: "awardCategories", href: "/admin/categories", label: "Award Categories", icon: Award },
    { 
      id: "nominationsSubmenu",
      label: "Nominations", 
      icon: Users, 
      onClick: () => toggleSubmenu("nominationsSubmenu"),
      parentPath: "/admin/nominations",
      children: [
        { id: "completedNominations", href: "/admin/nominations/completed", label: "Completed", icon: FileCheck2 },
        { id: "incompleteNominations", href: "/admin/nominations/incomplete", label: "Incomplete", icon: FileClock },
      ]
    },
    { 
      id: "nomineeStatusSubmenu",
      label: "Nominee Status", 
      icon: Users, 
      onClick: () => toggleSubmenu("nomineeStatusSubmenu"),
      parentPath: "/admin/nominees/status", 
      children: [
        { id: "approvedNominees", href: "/admin/nominees/status/approved", label: "Approved", icon: UserCheck },
        { id: "rejectedNominees", href: "/admin/nominees/status/rejected", label: "Rejected", icon: UserX },
      ]
    },
    { 
      id: "registrationsSubmenu",
      label: "Registrations", 
      icon: UserPlus, 
      onClick: () => toggleSubmenu("registrationsSubmenu"),
      parentPath: "/admin/registrations", 
      children: [
        { id: "allRegistrations", href: "/admin/registrations", label: "All Registrations", icon: Users },
        { id: "pendingRegistrations", href: "/admin/registrations/pending", label: "Pending Payment", icon: ClockIcon },
        { id: "paidRegistrations", href: "/admin/registrations/paid", label: "Paid", icon: CheckCircle },
      ]
    },
    { 
      id: "sponsorsSubmenu",
      label: "Sponsors", 
      icon: Handshake, 
      onClick: () => toggleSubmenu("sponsorsSubmenu"),
      parentPath: "/admin/sponsors", 
      children: [
        { id: "sponsorsTracking", href: "/admin/sponsors/tracking", label: "Sponsors Tracking", icon: BarChart3 },
        { id: "sponsorshipInquiries", href: "/admin/sponsors/inquiries", label: "Sponsorship Inquiries", icon: MessageSquare },
      ]
    },
    { id: "transactions", href: "/admin/transactions", label: "Transactions", icon: CreditCard },
    { id: "messages", href: "/admin/messages", label: "Messages", icon: MessageSquare },
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
          <motion.img 
            alt="TPAHLA Logo" 
            className="h-10" 
            src="/lovable-uploads/62fe4193-0108-4af1-94b9-a45993de1c9d.png"
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
          <motion.span 
            className="font-semibold text-lg text-tpahla-gold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Admin Panel
          </motion.span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
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
                        {openSubmenus[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </SidebarMenuButton>
                      {openSubmenus[item.id] && (
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.id}>
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