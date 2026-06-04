"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  UserPlus,
  TrendingUp,
  Activity,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import adminService from "@/services/adminService";
import type { AdminStatistics } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          adminService.getUsers({ page_size: 1 }),
          adminService.getUsers({ role: 'student', page_size: 1 }),
          adminService.getUsers({ role: 'lecturer', page_size: 1 }),
          adminService.getUsers({ role: 'admin', page_size: 1 }),
          adminService.getCourses({ page_size: 1 }),
          adminService.getBulkEnrollments({ page_size: 1 }).catch(() => null),
          adminService.getStudySessions({ page_size: 1 }).catch(() => null),
          adminService.getIssueReports({ resolved: false }).catch(() => null),
          adminService.getAdminRequests({ status: 'pending' }).catch(() => null),
        ]);

        const count = (v: unknown): number => {
          type WithCount = { count?: number };
          if (v && typeof (v as WithCount).count === 'number') return (v as WithCount).count as number;
          if (Array.isArray(v)) return (v as unknown[]).length;
          return 0;
        };

        const getValue = (result: PromiseSettledResult<any>) => {
          return result.status === 'fulfilled' ? result.value : null;
        };

        setStats({
          totalUsers: count(getValue(results[0])),
          totalStudents: count(getValue(results[1])),
          totalLecturers: count(getValue(results[2])),
          totalAdmins: count(getValue(results[3])),
          totalCourses: count(getValue(results[4])),
          totalEnrollments: count(getValue(results[5])),
          activeSessions: count(getValue(results[6])),
          unresolvedReports: count(getValue(results[7])),
          pendingAdminRequests: count(getValue(results[8])),
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Students",
      value: stats?.totalStudents ?? 0,
      icon: GraduationCap,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      label: "Lecturers",
      value: stats?.totalLecturers ?? 0,
      icon: BookOpen,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Total Courses",
      value: stats?.totalCourses ?? 0,
      icon: FileText,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Enrollments",
      value: stats?.totalEnrollments ?? 0,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Sessions",
      value: stats?.activeSessions ?? 0,
      icon: Activity,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      label: "Open Reports",
      value: stats?.unresolvedReports ?? 0,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Admin Requests",
      value: stats?.pendingAdminRequests ?? 0,
      icon: UserPlus,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Admin 👋</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and management dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="shadow-card">
              <CardContent className="p-4">
                {loading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">
                        {stat.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/dashboard/users"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted hover:border-primary/50 transition-all text-center"
              >
                <Users className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Manage Users</span>
              </a>
              <a
                href="/dashboard/courses"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted hover:border-primary/50 transition-all text-center"
              >
                <BookOpen className="h-6 w-6 text-success" />
                <span className="text-sm font-medium">Manage Courses</span>
              </a>
              <a
                href="/dashboard/support/reports"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted hover:border-primary/50 transition-all text-center"
              >
                <AlertTriangle className="h-6 w-6 text-warning" />
                <span className="text-sm font-medium">View Reports</span>
              </a>
              <a
                href="/dashboard/support/requests"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted hover:border-primary/50 transition-all text-center"
              >
                <UserPlus className="h-6 w-6 text-info" />
                <span className="text-sm font-medium">Admin Requests</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users by Role */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-info" />
                  <span className="text-sm text-foreground">Students</span>
                </div>
                <span className="font-semibold">
                  {stats?.totalStudents?.toLocaleString() ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-foreground">Lecturers</span>
                </div>
                <span className="font-semibold">
                  {stats?.totalLecturers?.toLocaleString() ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-foreground">Admins</span>
                </div>
                <span className="font-semibold">
                  {stats?.totalAdmins?.toLocaleString() ?? "—"}
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {stats?.totalUsers?.toLocaleString() ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.activeSessions ?? 0}</p>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.unresolvedReports ?? 0}</p>
                <p className="text-sm text-muted-foreground">Open Reports</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}