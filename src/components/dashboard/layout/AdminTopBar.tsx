"use client";

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
    if (user?.profile) {
      return `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase();
    }

    if (user?.name) {
      return user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    return "SA";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User menu */}
        <div className="flex items-center gap-2 ml-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">
              {user?.name ||
                (user?.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "Super Admin")}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email || "admin@acadexis.com"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}