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
} from "lucide-react";
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
import type { AdminUser, UserFilters } from "@/types";

// Mock data
const mockUsers: AdminUser[] = [
  {
    id: "1",
    email: "john.student@university.edu",
    role: "student",
    university: "u1",
    universityName: "University of Cape Town",
    is_active: true,
    is_staff: false,
    date_joined: "2025-09-01T10:00:00Z",
    profile: {
      id: "p1",
      first_name: "John",
      last_name: "Abiola",
      identification_number: "STU-001",
      level: "3rd Year",
      department: "d1",
      departmentName: "Computer Science",
      avatar: null,
    },
  },
  {
    id: "2",
    email: "prof.chen@university.edu",
    role: "lecturer",
    university: "u1",
    universityName: "University of Cape Town",
    is_active: true,
    is_staff: true,
    date_joined: "2024-01-15T08:00:00Z",
    profile: {
      id: "p2",
      first_name: "Sarah",
      last_name: "Chen",
      identification_number: "LEC-001",
      level: "Professor",
      department: "d1",
      departmentName: "Computer Science",
      avatar: null,
    },
  },
  {
    id: "3",
    email: "admin@acadexis.com",
    role: "admin",
    university: null,
    universityName: null,
    is_active: true,
    is_staff: true,
    date_joined: "2023-06-01T00:00:00Z",
    profile: {
      id: "p3",
      first_name: "Super",
      last_name: "Admin",
      identification_number: "ADM-001",
      level: "N/A",
      department: null,
      departmentName: null,
      avatar: null,
    },
  },
  {
    id: "4",
    email: "mary.jane@university.edu",
    role: "student",
    university: "u1",
    universityName: "University of Cape Town",
    is_active: true,
    is_staff: false,
    date_joined: "2025-09-02T12:00:00Z",
    profile: {
      id: "p4",
      first_name: "Mary",
      last_name: "Jane",
      identification_number: "STU-002",
      level: "2nd Year",
      department: "d3",
      departmentName: "Mathematics",
      avatar: null,
    },
  },
  {
    id: "5",
    email: "inactive.user@university.edu",
    role: "student",
    university: "u2",
    universityName: "Stellenbosch University",
    is_active: false,
    is_staff: false,
    date_joined: "2025-08-15T09:00:00Z",
    profile: {
      id: "p5",
      first_name: "Inactive",
      last_name: "User",
      identification_number: "STU-003",
      level: "1st Year",
      department: "d4",
      departmentName: "Physics",
      avatar: null,
    },
  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filtered = [...mockUsers];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.email.toLowerCase().includes(s) ||
            u.profile?.first_name.toLowerCase().includes(s) ||
            u.profile?.last_name.toLowerCase().includes(s)
        );
      }
      if (roleFilter !== "all") {
        filtered = filtered.filter((u) => u.role === roleFilter);
      }
      if (statusFilter === "active") {
        filtered = filtered.filter((u) => u.is_active);
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((u) => !u.is_active);
      }
      setUsers(filtered);
      setLoading(false);
    }, 300);
  }, [search, roleFilter, statusFilter]);

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
                      {user.universityName || "—"}
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
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Set as Student
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Set as Lecturer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Set as Admin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Deactivate User
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
                Showing {users.length} of {mockUsers.length} users
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
    </div>
  );
}