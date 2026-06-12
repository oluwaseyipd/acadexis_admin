"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Search, MoreVertical, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import adminService from "@/services/adminService";
import type { University } from "@/types";
import { toast } from "@/hooks/use-toast";
import { UniversityDetailsDialog } from "@/components/dashboard/dialogs/UniversityDetailsDialog";
import { UniversityFormDialog } from "@/components/dashboard/dialogs/UniversityFormDialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/dialogs/DeleteConfirmationDialog";

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Dialog States
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number | boolean> = {};
        if (search) params.search = search;
        const data = await adminService.getUniversities(params);
        if (!mounted) return;
        setUniversities(data.results || data);
      } catch (err: unknown) {
        console.error("Failed to fetch universities:", err);
        if (!mounted) return;
        const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
        const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to load universities";
        toast.error(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchUniversities();
    }, 0);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [search, refreshTrigger]);

  const handleDeleteUniversity = async (id: string) => {
    try {
      await adminService.deleteUniversity(id);
      toast.success("University deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      console.error("Failed to delete university:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to delete university";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Universities</h1>
          <p className="text-muted-foreground mt-1">Manage universities on the platform.</p>
        </div>
        <Button className="gap-2" onClick={() => { setSelectedUniversity(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add University
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search universities..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Universities ({universities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-card/30">
              <Building2 className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No universities found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {universities.map((uni, i) => (
                <motion.div key={uni.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Badge variant="outline">{uni.code}</Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedUniversity(uni); setDetailsOpen(true); }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedUniversity(uni); setFormOpen(true); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedUniversity(uni); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{uni.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{uni.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UniversityDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        university={selectedUniversity}
      />

      <UniversityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        university={selectedUniversity}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          if (selectedUniversity) {
            await handleDeleteUniversity(selectedUniversity.id);
          }
        }}
        title="Delete University"
        description="Are you sure you want to delete this university? All associated faculties, departments, courses, and enrollments will be deleted. This action cannot be undone."
        itemName={selectedUniversity?.name}
        confirmText="Delete"
      />
    </div>
  );
}