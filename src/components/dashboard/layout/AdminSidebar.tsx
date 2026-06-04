"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  GraduationCap,
  Folder,
  AlertTriangle,
  MessageSquare,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import adminService from "@/services/adminService";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Institutions",
    href: "/dashboard/universities",
    icon: Building2,
    children: [
      { title: "Universities", href: "/dashboard/universities", icon: Building2 },
      { title: "Faculties", href: "/dashboard/faculties", icon: GraduationCap },
      { title: "Departments", href: "/dashboard/departments", icon: Folder },
    ],
  },
  {
    title: "Support",
    href: "/dashboard/support",
    icon: AlertTriangle,
    children: [
      { title: "Reports", href: "/dashboard/support/reports", icon: AlertTriangle },
      { title: "Contacts", href: "/dashboard/support/contacts", icon: MessageSquare },
      { title: "Admin Requests", href: "/dashboard/support/requests", icon: UserPlus },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, logout } = useAppStore();
  const router = useRouter();

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

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 shadow-sidebar",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        {sidebarOpen ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
              A
            </div>
            <span className="text-lg font-semibold">Acadexis</span>
          </Link>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            A
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2 overflow-y-auto h-[calc(100vh-8rem)]">
        {sidebarItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground",
                !sidebarOpen && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
            </Link>

            {/* Children items */}
            {item.children && sidebarOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                      pathname === child.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <child.icon className="h-4 w-4" />
                    <span>{child.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            !sidebarOpen && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {sidebarOpen && <span className="ml-2">Logout</span>}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="mt-2 w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}