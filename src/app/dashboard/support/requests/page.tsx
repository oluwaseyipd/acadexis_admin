"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Search, Check, X, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminRequest } from "@/types";
import adminService from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

const statusColors = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: { status?: 'pending' | 'approved' | 'rejected' } = {};
      if (statusFilter !== "all") {
        params.status = statusFilter as 'pending' | 'approved' | 'rejected';
      }
      const data = await adminService.getAdminRequests(params);
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to fetch admin requests:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveAdminRequest(id);
      toast.success("Request approved successfully");
      await fetchRequests();
    } catch (err) {
      console.error("Failed to approve request:", err);
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectAdminRequest(id);
      toast.success("Request rejected successfully");
      await fetchRequests();
    } catch (err) {
      console.error("Failed to reject request:", err);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Requests</h1>
          <p className="text-muted-foreground mt-1">Manage admin access requests.</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request, i) => (
                <motion.div key={request.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{request.userName}</h3>
                      <p className="text-sm text-muted-foreground">{request.userEmail}</p>
                    </div>
                    <Badge className={statusColors[request.status]}>
                      {request.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {request.status === "approved" && <Check className="h-3 w-3 mr-1" />}
                      {request.status === "rejected" && <X className="h-3 w-3 mr-1" />}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Requested on {new Date(request.created_at).toLocaleDateString()}</span>
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => handleApprove(request.id)}>
                          <Check className="h-4 w-4 mr-1" />Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                          <X className="h-4 w-4 mr-1" />Reject
                        </Button>
                      </div>
                    )}
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