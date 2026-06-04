"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { IssueReport } from "@/types";

const mockReports: IssueReport[] = [
  { id: "1", user: "u1", userName: "John Student", title: "Cannot access course materials", description: "Getting 403 error when trying to access PDF files", severity: "high", resolved: false, created_at: "2025-06-01T10:00:00Z" },
  { id: "2", user: "u2", userName: "Sarah Lecturer", title: "Quiz submission failed", description: "Students reported issues submitting quiz answers", severity: "critical", resolved: false, created_at: "2025-06-02T14:00:00Z" },
  { id: "3", user: "u3", userName: "Mike User", title: "Login timeout issue", description: "Session expires too quickly", severity: "medium", resolved: true, created_at: "2025-05-28T09:00:00Z" },
  { id: "4", user: "u4", userName: "Emily White", title: "Wrong grade displayed", description: "Grade showing incorrect percentage", severity: "low", resolved: false, created_at: "2025-06-03T11:00:00Z" },
];

const severityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-red-600 text-white",
};

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      let filtered = mockReports;
      if (statusFilter === "resolved") filtered = filtered.filter((r) => r.resolved);
      else if (statusFilter === "unresolved") filtered = filtered.filter((r) => !r.resolved);
      setReports(filtered);
      setLoading(false);
    }, 300);
  }, [statusFilter]);

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Issue Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage user-reported issues.</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Reports ({reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report, i) => (
                <motion.div key={report.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{report.title}</h3>
                      <Badge className={severityColors[report.severity]}>{report.severity}</Badge>
                    </div>
                    {report.resolved ? (
                      <Badge variant="outline" className="text-success border-success/20"><Check className="h-3 w-3 mr-1" />Resolved</Badge>
                    ) : (
                      <Badge variant="outline" className="text-warning border-warning/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Reported by {report.userName} on {new Date(report.created_at).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      {!report.resolved && <Button size="sm" variant="outline"><Check className="h-4 w-4 mr-1" />Resolve</Button>}
                      <Button size="sm" variant="ghost" className="text-destructive"><X className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}