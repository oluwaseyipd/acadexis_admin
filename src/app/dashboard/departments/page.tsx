"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Folder, Search, MoreVertical, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import adminService from "@/services/adminService";
import type { Department, Faculty } from "@/types";
import { toast } from "@/hooks/use-toast";
import { DepartmentDetailsDialog } from "@/components/dashboard/dialogs/DepartmentDetailsDialog";
import { DepartmentFormDialog } from "@/components/dashboard/dialogs/DepartmentFormDialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/dialogs/DeleteConfirmationDialog";

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<string>("all");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Dialog States
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number | boolean> = {};
        if (search) params.search = search;
        if (facultyFilter !== "all") params.faculty = facultyFilter;
        const data = await adminService.getDepartments(params);
        setDepartments(data.results || data);
      } catch (err: unknown) {
        console.error("Failed to fetch departments:", err);
        const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
        const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to load departments";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchDepartments();
    }, 0);
    return () => clearTimeout(timer);
  }, [search, facultyFilter, refreshTrigger]);

  useEffect(() => {
    const fetchFacs = async () => {
      try {
        const data = await adminService.getFaculties();
        setFaculties(data.results || data || []);
      } catch (err) {
        console.error("Failed to fetch faculties:", err);
      }
    };
    const timer = setTimeout(() => {
      fetchFacs();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteDepartment = async (id: string) => {
    try {
      await adminService.deleteDepartment(id);
      toast.success("Department deleted successfully");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      console.error("Failed to delete department:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to delete department";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground mt-1">Manage departments within faculties.</p>
        </div>
        <Button className="gap-2" onClick={() => { setSelectedDepartment(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search departments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculties</SelectItem>
                {faculties.map((fac) => (
                  <SelectItem key={fac.id} value={fac.id}>
                    {fac.name}
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
            <Folder className="h-5 w-5" />
            Departments ({departments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-card/30">
              <Folder className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No departments found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept, i) => (
                <motion.div key={dept.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Folder className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline">{dept.code}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedDepartment(dept); setDetailsOpen(true); }}>
                          <Eye className="h-4 w-4 mr-2" />View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedDepartment(dept); setFormOpen(true); }}>
                          <Edit className="h-4 w-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedDepartment(dept); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{dept.name}</h3>
                  <Badge variant="secondary">{dept.facultyName}</Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DepartmentDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        department={selectedDepartment}
      />

      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        department={selectedDepartment}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          if (selectedDepartment) {
            await handleDeleteDepartment(selectedDepartment.id);
          }
        }}
        title="Delete Department"
        description="Are you sure you want to delete this department? All associated courses and student enrollments will be deleted. This action cannot be undone."
        itemName={selectedDepartment?.name}
        confirmText="Delete"
      />
    </div>
  );
}