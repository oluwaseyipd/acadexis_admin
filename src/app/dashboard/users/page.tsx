"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  MoreVertical,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { UserDetailsDialog } from "@/components/dashboard/dialogs/UserDetailsDialog";
import { EditUserDialog } from "@/components/dashboard/dialogs/EditUserDialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/dialogs/DeleteConfirmationDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import adminService from "@/services/adminService";
import type { AdminUser } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number | boolean> = { page };
        if (search) params.search = search;
        if (roleFilter !== "all") params.role = roleFilter;
        if (statusFilter === "active") params.is_active = true;
        if (statusFilter === "inactive") params.is_active = false;

        const data = await adminService.getUsers(params);
        if (!mounted) return;
        setUsers(data.results || data);
        setTotalCount(data.count || (data.results?.length || 0));
        setLoading(false);
      } catch (err: unknown) {
        console.error("Failed to fetch users:", err);
        if (!mounted) return;
        const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
        const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to load users";
        toast.error(msg);
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [search, roleFilter, statusFilter, page, refreshTrigger]);

  const handleUpdateRole = async (userId: string, newRole: "student" | "lecturer" | "admin") => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      console.error("Failed to update user role:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to update user role";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      if (currentActive) {
        await adminService.deactivateUser(userId);
        toast.success("User deactivated successfully");
      } else {
        await adminService.activateUser(userId);
        toast.success("User activated successfully");
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      console.error("Failed to toggle user status:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to update user status";
      toast.error(msg);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      toast.success("User account deleted completely");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      console.error("Failed to delete user:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to delete user";
      toast.error(msg);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "lecturer":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Lecturer
          </Badge>
        );
      default:
        return (
          <Badge className="bg-info/10 text-info border-info/20">
            <Shield className="w-3 h-3 mr-1" />
            Student
          </Badge>
        );
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage platform users, roles, and permissions.
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="lecturer">Lecturer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {getInitials(user.profile?.first_name, user.profile?.last_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {user.profile?.first_name} {user.profile?.last_name}
                      </p>
                      {!user.is_active && (
                        <Badge variant="outline" className="text-destructive border-destructive/20">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-center min-w-[120px]">
                    <span className="text-xs text-muted-foreground">University</span>
                    <span className="text-sm text-foreground truncate max-w-[120px]">
                      {user.university_name || "—"}
                    </span>
                  </div>
                  <div className="hidden lg:block">{getRoleBadge(user.role)}</div>
                  <div className="hidden xl:flex flex-col items-center min-w-[100px]">
                    <span className="text-xs text-muted-foreground">Joined</span>
                    <span className="text-sm text-foreground">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => { setSelectedUser(user); setDetailsOpen(true); }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedUser(user); setEditOpen(true); }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Account
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "student")}>
                        <Shield className="h-4 w-4 mr-2" />
                        Set as Student
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "lecturer")}>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Set as Lecturer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "admin")}>
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Set as Admin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className={user.is_active ? "text-destructive" : "text-success"}
                        onClick={() => {
                          if (user.is_active) {
                            setSelectedUser(user);
                            setDeactivateOpen(true);
                          } else {
                            handleToggleActive(user.id, false);
                          }
                        }}
                      >
                        {user.is_active ? "Deactivate User" : "Activate User"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onClick={() => {
                          setSelectedUser(user);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {users.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {users.length} of {totalCount} users
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Page {page}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={users.length < 10}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        user={selectedUser}
      />

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selectedUser}
        onUserUpdated={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <DeleteConfirmationDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        onConfirm={async () => {
          if (selectedUser) {
            await handleToggleActive(selectedUser.id, true);
          }
        }}
        title="Deactivate User Account"
        description="Are you sure you want to deactivate this user account? The user will lose access to the system until reactivated."
        itemName={selectedUser?.email}
        confirmText="Deactivate"
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          if (selectedUser) {
            await handleDeleteUser(selectedUser.id);
          }
        }}
        title="Delete User Account"
        description="Are you sure you want to completely delete this user account? This action is permanent and cannot be undone."
        itemName={selectedUser?.email}
        confirmText="Delete Permanently"
      />
    </div>
  );
}