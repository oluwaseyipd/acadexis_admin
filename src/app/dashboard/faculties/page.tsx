"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Search, MoreVertical, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import adminService from "@/services/adminService";
import type { Faculty, University } from "@/types";
import { toast } from "@/hooks/use-toast";
import { FacultyDetailsDialog } from "@/components/dashboard/dialogs/FacultyDetailsDialog";
import { FacultyFormDialog } from "@/components/dashboard/dialogs/FacultyFormDialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/dialogs/DeleteConfirmationDialog";

export default function FacultiesPage() {
  const [search, setSearch] = useState("");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Dialog States
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number | boolean> = {};
        if (search) params.search = search;
        if (universityFilter !== "all") params.university = universityFilter;
        const data = await adminService.getFaculties(params);
        setFaculties(data.results || data);
      } catch (err: unknown) {
        console.error("Failed to fetch faculties:", err);
        const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
        const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to load faculties";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFaculties();
    }, 0);
    return () => clearTimeout(timer);
  }, [search, universityFilter, refreshTrigger]);

  useEffect(() => {
    const fetchUnis = async () => {
      try {
        const data = await adminService.getUniversities();
        setUniversities(data.results || data || []);
      } catch (err) {
        console.error("Failed to fetch universities:", err);
      }
    };
    const timer = setTimeout(() => {
      fetchUnis();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteFaculty = async (id: string) => {
    try {
      await adminService.deleteFaculty(id);
      toast.success("Faculty deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      console.error("Failed to delete faculty:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to delete faculty";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Faculties</h1>
          <p className="text-muted-foreground mt-1">Manage faculties within universities.</p>
        </div>
        <Button className="gap-2" onClick={() => { setSelectedFaculty(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search faculties..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Faculties ({faculties.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : faculties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-card/30">
              <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No faculties found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {faculties.map((faculty, i) => (
                <motion.div key={faculty.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedFaculty(faculty); setDetailsOpen(true); }}>
                          <Eye className="h-4 w-4 mr-2" />View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedFaculty(faculty); setFormOpen(true); }}>
                          <Edit className="h-4 w-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedFaculty(faculty); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{faculty.name}</h3>
                  <Badge variant="secondary">{faculty.university_name}</Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FacultyDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        faculty={selectedFaculty}
      />

      <FacultyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        faculty={selectedFaculty}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          if (selectedFaculty) {
            await handleDeleteFaculty(selectedFaculty.id);
          }
        }}
        title="Delete Faculty"
        description="Are you sure you want to delete this faculty? All associated departments, courses, and enrollments will be deleted. This action cannot be undone."
        itemName={selectedFaculty?.name}
        confirmText="Delete"
      />
    </div>
  );
}