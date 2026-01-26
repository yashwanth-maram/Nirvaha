import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Music,
  Headphones,
  ShoppingBag,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [contentOpen, setContentOpen] = useState(true);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      exact: true,
    },
    {
      title: "Companion Management",
      icon: Users,
      path: "/admin/companions",
    },
    {
      title: "Booking Management",
      icon: Calendar,
      path: "/admin/bookings",
    },
    {
      title: "Content Management",
      icon: FileText,
      children: [
        {
          title: "Meditation",
          icon: Music,
          path: "/admin/content/meditation",
        },
        {
          title: "Sound Healing",
          icon: Headphones,
          path: "/admin/content/sound",
        },
        {
          title: "Marketplace Products",
          icon: ShoppingBag,
          path: "/admin/content/products",
        },
      ],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
    {
      title: "User Management",
      icon: Shield,
      path: "/admin/users",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-gradient-to-b from-emerald-900/95 to-teal-900/95 border-r border-white/10 backdrop-blur-md">
          <SidebarHeader className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-lg truncate">Admin Panel</h2>
                <p className="text-white/70 text-xs truncate">Nirvaha Wellness</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    if (item.children) {
                      return (
                        <Collapsible
                          key={item.title}
                          open={contentOpen}
                          onOpenChange={setContentOpen}
                          asChild
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                isActive={item.children.some((child) =>
                                  isActive(child.path)
                                )}
                                className="w-full"
                                onClick={() => setContentOpen((v) => !v)}
                              >
                                <item.icon className="w-4 h-4" />
                                <span>{item.title}</span>
                                <ChevronRight
                                  className={cn(
                                    "ml-auto w-4 h-4 transition-transform",
                                    contentOpen && "rotate-90"
                                  )}
                                />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.children.map((child) => (
                                  <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuSubButton
                                      isActive={isActive(child.path)}
                                      onClick={() => navigate(child.path)}
                                    >
                                      <child.icon className="w-4 h-4" />
                                      <span>{child.title}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            isActive={isActive(item.path, item.exact)}
                            onClick={() => navigate(item.path)}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-white/70 text-xs truncate">
                  {user?.email || "admin@nirvaha.com"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-white/10" />
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-white/70">
                  Manage your wellness platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-sm font-medium">Administrator</span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <div
              className="min-h-full p-6 relative"
              style={{
                background:
                  "linear-gradient(180deg, #0a2f2a 0%, #0f3d38 14%, #1a5d54 28%, #2e7f74 42%, #4fa89d 56%, #6dc5b8 70%, #8dd9ce 84%, #a9e7da 100%)",
              }}
            >
              <div className="absolute inset-0 bg-teal-900/20 z-0" />
              <div className="relative z-10">{children || <Outlet />}</div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

