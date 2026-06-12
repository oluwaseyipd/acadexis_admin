"use client";
import { useEffect, useState } from "react";
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
  const { isAuthenticated, setUser, sidebarOpen, setSidebarOpen } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;

      if (!token || !cachedUser) {
        // Clear state and redirect to login
        setUser(null);
        router.push("/auth/login");
        return;
      }

      if (!isAuthenticated) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser);
        } catch (e) {
          setUser(null);
          router.push("/auth/login");
          return;
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [isAuthenticated, router, setUser]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
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