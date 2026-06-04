"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import adminService from "@/services/adminService";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, setUser, setLoading, sidebarOpen } = useAppStore();
  const tokenValid = typeof window !== "undefined" && adminService.isAuthenticated();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isAuthenticated && !tokenValid) {
        router.push("/auth/login");
        return;
      }

      if (!isAuthenticated && tokenValid) {
        const currentUser = await adminService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, [isAuthenticated, router, setUser, setLoading, tokenValid]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If not authenticated and no valid token, don't render anything (will redirect)
  if (!isAuthenticated && !tokenValid) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}