
import { Link, useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { LayoutDashboard, Folder, Users, ListChecks, Settings, BarChart3 } from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/nominees", label: "Nominees", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: ListChecks },
];

// Future items (can be added later)
const futureAdminNavItems = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <img alt="TPAHLA Logo" className="h-10" src="/lovable-uploads/62fe4193-0108-4af1-94b9-a45993de1c9d.png" />
          <span className="font-semibold text-lg text-tpahla-gold">Admin Panel</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href))}
                >
                  <Link to={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* Placeholder for future items if needed
        <SidebarGroup>
          <SidebarGroupLabel>Future</SidebarGroupLabel>
          <SidebarMenu>
            {futureAdminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.href}
                  disabled // Disabled for now
                >
                  <Link to={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        */}
      </SidebarContent>
      <SidebarFooter className="p-4">
        {/* Optional: Add footer content like user profile or logout */}
      </SidebarFooter>
    </Sidebar>
  );
}
