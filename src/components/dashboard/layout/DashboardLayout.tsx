"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import adminService from "@/services/adminService";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, setUser, setLoading, sidebarOpen, setSidebarOpen } = useAppStore();
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
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && !tokenValid) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-muted/40 font-sans antialiased">
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Persistent Left Drawer Block */}
      <AdminSidebar />

      {/* Main Structural Column Frame */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}