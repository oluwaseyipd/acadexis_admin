"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, BookOpen, Building2, GraduationCap, 
  Folder, AlertTriangle, MessageSquare, UserPlus, ChevronLeft, 
  ChevronRight, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";
import adminService from "@/services/adminService";
import { useState, useEffect } from "react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { 
    title: "Institutions", 
    href: "/dashboard/universities", 
    icon: Building2, 
    children: [
      { title: "Universities", href: "/dashboard/universities", icon: Building2 },
      { title: "Faculties", href: "/dashboard/faculties", icon: GraduationCap },
      { title: "Departments", href: "/dashboard/departments", icon: Folder },
    ] 
  },
  { 
    title: "Support", 
    href: "/dashboard/support", 
    icon: AlertTriangle, 
    children: [
      { title: "Reports", href: "/dashboard/support/reports", icon: AlertTriangle },
      { title: "Contacts", href: "/dashboard/support/contacts", icon: MessageSquare },
      { title: "Requests", href: "/dashboard/support/requests", icon: UserPlus },
    ] 
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, sidebarOpen, setSidebarOpen, logout } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = () => {
    if (user?.profile) {
      return `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase();
    }
    if (user?.name) {
      return user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    }
    return "SA";
  };

  const handleLogout = async () => {
    try {
      await adminService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      router.push("/auth/login");
    }
  };
  const handleLinkClick = (hasChildren: boolean) => {
    if (hasChildren) return;
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
  if (!mounted) {
    return (
      <aside className="fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-border bg-card py-4 w-64 lg:relative lg:translate-x-0">
        <div className="h-12 flex items-center px-6 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            A
          </div>
          <span className="ml-3 text-base font-bold tracking-tight text-foreground">
            Acadexis
          </span>
        </div>
        <div className="flex-1 px-4 py-6 space-y-3">
          <div className="h-9 bg-muted/60 rounded-md animate-pulse" />
          <div className="h-9 bg-muted/60 rounded-md animate-pulse" />
          <div className="h-9 bg-muted/60 rounded-md animate-pulse" />
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-border bg-card py-4 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "w-64 translate-x-0" : "w-16 -translate-x-full lg:translate-x-0"
      )}
    >
      

      {/* Central Scrollable Navigation List */}
      <nav className="flex-1 space-y-1 px-2 overflow-y-auto custom-scrollbar">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <div key={item.title} className="space-y-1">
              <Link 
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all group",
                  isActive && "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary",
                  !sidebarOpen && "justify-center px-0 h-10 w-10 mx-auto"
                )}
                title={!sidebarOpen ? item.title : undefined}
                onClick={() => handleLinkClick(!!item.children)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                {sidebarOpen && <span className="text-sm tracking-wide">{item.title}</span>}
              </Link>

              {/* Collapsible Child Link Submenus */}
              {item.children && sidebarOpen && isActive && (
                <div className="ml-4 pl-3 border-l border-border space-y-1 mt-1">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link 
                        key={child.href} 
                        href={child.href} 
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                          isChildActive && "text-primary font-semibold"
                        )}
                        onClick={() => handleLinkClick(false)}
                      >
                        <child.icon className="h-3.5 w-3.5" />
                        <span>{child.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Fixed Context System Actions Footer */}
      <div className="p-2 border-t border-border bg-card shrink-0 space-y-1.5">
        <div className={cn("flex items-center gap-3 px-2 py-1.5 rounded-md", !sidebarOpen && "justify-center px-0")}>
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.profile ? `${user.profile.first_name} ${user.profile.last_name}` : user?.name || "Super Admin"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email || "admin@acadexis.com"}</p>
            </div>
          )}
        </div>

        <div className="space-y-0.5 pt-1">
          <Button 
            variant="ghost" 
            size="sm"
            className={cn("w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-start", !sidebarOpen && "justify-center px-0")}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="ml-2 text-xs">Logout</span>}
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            className="w-full text-muted-foreground justify-center lg:flex" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </aside>
  );
}