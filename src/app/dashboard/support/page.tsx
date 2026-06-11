"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, UserPlus, MessageSquare, ArrowRight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import adminService from "@/services/adminService";
import Link from "next/link";

export default function SupportHubPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    reports: 0,
    requests: 0,
    contacts: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [reportsRes, requestsRes, contactsRes] = await Promise.allSettled([
          adminService.getIssueReports({ resolved: false }),
          adminService.getAdminRequests({ status: "pending" }),
          adminService.getContactMessages(),
        ]);

        const getLength = (res: PromiseSettledResult<any[]>) => {
          return res.status === "fulfilled" && Array.isArray(res.value) ? res.value.length : 0;
        };

        setCounts({
          reports: getLength(reportsRes),
          requests: getLength(requestsRes),
          contacts: getLength(contactsRes),
        });
      } catch (err) {
        console.error("Failed to load support counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const supportSections = [
    {
      title: "Issue Reports",
      description: "Manage and resolve user-reported system errors and bugs.",
      count: counts.reports,
      countLabel: "Active Reports",
      href: "/dashboard/support/reports",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "hover:border-destructive/30",
    },
    {
      title: "Admin Access Requests",
      description: "Approve or reject requests from staff needing admin control.",
      count: counts.requests,
      countLabel: "Pending Requests",
      href: "/dashboard/support/requests",
      icon: UserPlus,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "hover:border-warning/30",
    },
    {
      title: "Contact Messages",
      description: "Review general enquiries and help requests submitted by users.",
      count: counts.contacts,
      countLabel: "Total Messages",
      href: "/dashboard/support/contacts",
      icon: MessageSquare,
      color: "text-info",
      bgColor: "bg-info/10",
      borderColor: "hover:border-info/30",
    },
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support Center</h1>
        <p className="text-muted-foreground mt-1">
          Monitor platform health and handle user inquiries.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportSections.map((sec, i) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`h-full flex flex-col justify-between shadow-card border border-border transition-all duration-200 ${sec.borderColor}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${sec.bgColor} p-3 rounded-lg`}>
                    <sec.icon className={`h-5 w-5 ${sec.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{sec.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm line-clamp-2 mt-1">
                  {sec.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-4">
                <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {sec.countLabel}
                  </span>
                  {loading ? (
                    <Skeleton className="h-6 w-10" />
                  ) : (
                    <span className={`text-sm font-bold ${sec.count > 0 ? sec.color : "text-muted-foreground"}`}>
                      {sec.count}
                    </span>
                  )}
                </div>
                <Link href={sec.href} className="w-full">
                  <Button className="w-full gap-2 justify-center" variant="outline">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Uptime Monitoring Frame */}
      <Card className="shadow-card mt-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-success" />
            Support Diagnostics
          </CardTitle>
          <CardDescription>
            High level platform help center diagnostics overview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">Active Reports</p>
              <p className="text-xl font-bold mt-1 text-destructive">{loading ? "—" : counts.reports}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">Pending Registrations</p>
              <p className="text-xl font-bold mt-1 text-warning">{loading ? "—" : counts.requests}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">Contact Threads</p>
              <p className="text-xl font-bold mt-1 text-info">{loading ? "—" : counts.contacts}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">Support Status</p>
              <p className="text-xl font-bold mt-1 text-success">Online</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
