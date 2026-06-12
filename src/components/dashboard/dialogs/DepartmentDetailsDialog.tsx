"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, BookOpen, GraduationCap } from "lucide-react";
import adminService from "@/services/adminService";
import type { Department, AdminCourse } from "@/types";

interface DepartmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

export function DepartmentDetailsDialog({ open, onOpenChange, department }: DepartmentDetailsDialogProps) {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (department && open) {
      const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
          const data = await adminService.getCourses({ department: department.id });
          setCourses(data.results || data || []);
        } catch (err) {
          console.error("Failed to fetch department courses:", err);
        } finally {
          setLoadingCourses(false);
        }
      };

      fetchCourses();
    }
  }, [department, open]);

  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold px-2.5 py-0.5">
              {department.code || "DEPT"}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold mt-2 truncate flex items-center gap-2">
            <Folder className="h-5 w-5 text-warning" />
            {department.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground truncate">
            Department courses and divisions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-4 custom-scrollbar">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              Affiliated Faculty
            </Label>
            <p className="text-sm font-medium text-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
              {department.faculty_name || "No affiliated faculty."}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Offered Courses ({loadingCourses ? "..." : courses.length})
            </Label>

            {loadingCourses ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-card/30">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-35" />
                <p className="text-xs">No courses offered by this department yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                    <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{course.level} Level</p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{course.code}</Badge>
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
