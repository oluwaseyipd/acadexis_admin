"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Bell, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function AdminTopBar() {
  const { user, sidebarOpen, setSidebarOpen, searchQuery, setSearchQuery } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = () => {
    if (user?.profile?.first_name && user?.profile?.last_name) {
      return `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase();
    }
    if (user?.name) {
      return user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    }
    return "SA";
  };

  if (!mounted) {
    return (
      <header className="h-16 shrink-0 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 z-30">
        <div className="flex items-center gap-3">
          <div className="h-12 flex items-center px-4 shrink-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              A
            </div>
            <span className="text-base font-bold tracking-tight text-foreground ml-3">
              Acadexis
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search dashboard..." 
              className="pl-9 bg-muted/50" 
              disabled 
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled>
            <Bell className="h-5 w-5" />
          </Button>
          <div className="border-l border-border pl-2 ml-1">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 shrink-0 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 z-30">
      {/* Mobile Menu Action Trigger & Welcome String */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
         <div className="h-12 flex items-center px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            A
          </div>
            <span className="text-base font-bold tracking-tight text-foreground transition-opacity duration-200">
              Acadexis
            </span>
        </Link>
      </div>


        <div className="hidden sm:block">
          <h2 className="text-sm font-medium text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">{user?.profile?.first_name || user?.name || "Admin"}</span>
          </h2>
        </div>
      </div>

      {/* Global Application Search Shell */}
      <div className="flex-1 min-w-0 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search dashboard..." 
            className="pl-9 bg-muted/50 focus-visible:bg-background transition-colors" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {/* Action System Block */}
      <div className="flex items-center gap-2">
        {mounted && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <div className="border-l border-border pl-2 ml-1">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}