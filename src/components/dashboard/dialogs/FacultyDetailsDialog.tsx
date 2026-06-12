"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Folder, Building2 } from "lucide-react";
import adminService from "@/services/adminService";
import type { Faculty, Department } from "@/types";

interface FacultyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty | null;
}

export function FacultyDetailsDialog({ open, onOpenChange, faculty }: FacultyDetailsDialogProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    if (faculty && open) {
      const fetchDepartments = async () => {
        setLoadingDepartments(true);
        try {
          const data = await adminService.getDepartments({ faculty: faculty.id });
          setDepartments(data.results || data || []);
        } catch (err) {
          console.error("Failed to fetch faculty departments:", err);
        } finally {
          setLoadingDepartments(false);
        }
      };

      fetchDepartments();
    }
  }, [faculty, open]);

  if (!faculty) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold mt-2 truncate flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-success" />
            {faculty.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground truncate">
            Faculty divisions and details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-4 custom-scrollbar">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              Affiliated University
            </Label>
            <p className="text-sm font-medium text-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
              {faculty.universityName || "No affiliated university."}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <Folder className="h-3.5 w-3.5" />
              Departments ({loadingDepartments ? "..." : departments.length})
            </Label>

            {loadingDepartments ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : departments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-card/30">
                <Folder className="h-8 w-8 mx-auto mb-2 opacity-35" />
                <p className="text-xs">No departments associated with this faculty yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                    <div className="w-7 h-7 rounded bg-warning/10 flex items-center justify-center text-warning shrink-0">
                      <Folder className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{dept.name}</p>
                      <Badge variant="outline" className="text-xs shrink-0">{dept.code}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
