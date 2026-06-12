"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, Shield, ShieldCheck, ShieldAlert, BookOpen, GraduationCap, Building2 } from "lucide-react";
import type { AdminUser } from "@/types";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
}

export function UserDetailsDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
  if (!user) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            Admin
          </Badge>
        );
      case "lecturer":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Lecturer
          </Badge>
        );
      default:
        return (
          <Badge className="bg-info/10 text-info border-info/20">
            <Shield className="w-3.5 h-3.5 mr-1" />
            Student
          </Badge>
        );
    }
  };

  const getInitials = () => {
    const first = user.profile?.first_name?.[0] || "";
    const last = user.profile?.last_name?.[0] || "";
    return (first + last).toUpperCase() || user.name?.[0]?.toUpperCase() || "U";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about the platform user account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4 border-b border-border">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20 shadow-sm">
            {getInitials()}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">
              {user.profile?.first_name || user.profile?.last_name
                ? `${user.profile.first_name || ""} ${user.profile.last_name || ""}`
                : user.name || "Anonymous User"}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            {getRoleBadge(user.role)}
            {user.is_staff && (
              <Badge className="bg-primary/10 text-primary border-primary/20">Staff</Badge>
            )}
            <Badge variant={user.is_active ? "default" : "destructive"}>
              {user.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 text-sm">
          <div className="space-y-1">
            <Label className="text-muted-foreground">User ID</Label>
            <p className="font-mono text-xs text-foreground truncate select-all">{user.id}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">Date Joined</Label>
            <p className="text-foreground flex items-center gap-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {new Date(user.date_joined).toLocaleDateString()} {new Date(user.date_joined).toLocaleTimeString()}
            </p>
          </div>

          <div className="space-y-1 col-span-2">
            <Label className="text-muted-foreground">University</Label>
            <p className="text-foreground flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {user.universityName || "None"}
            </p>
          </div>

          {user.profile?.identification_number && (
            <div className="space-y-1">
              <Label className="text-muted-foreground">ID Number</Label>
              <p className="text-foreground">{user.profile.identification_number}</p>
            </div>
          )}

          {user.profile?.level && (
            <div className="space-y-1">
              <Label className="text-muted-foreground">Level / Rank</Label>
              <p className="text-foreground flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                {user.profile.level}
              </p>
            </div>
          )}

          {user.profile?.departmentName && (
            <div className="space-y-1 col-span-2">
              <Label className="text-muted-foreground">Department</Label>
              <p className="text-foreground flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                {user.profile.departmentName}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
