"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileText, Download, Calendar, User, Info, MessageSquare } from "lucide-react";
import adminService from "@/services/adminService";
import type { AdminCourse, CourseEnrollment } from "@/types";

interface CourseMaterial {
  id: string;
  file_name?: string;
  title?: string;
  file_type?: string;
  file?: string;
}

interface CourseDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: AdminCourse | null;
}

export function CourseDetailsDialog({ open, onOpenChange, course }: CourseDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    if (course && open) {
      const fetchExtraData = async () => {
        setLoadingExtra(true);
        try {
          const [materialsRes, enrollmentsRes] = await Promise.allSettled([
            adminService.getCourseMaterials(course.id),
            adminService.getCourseEnrollments(course.id),
          ]);

          if (materialsRes.status === "fulfilled") {
            setMaterials(materialsRes.value.results || materialsRes.value || []);
          }
          if (enrollmentsRes.status === "fulfilled") {
            setEnrollments(enrollmentsRes.value || []);
          }
        } catch (err) {
          console.error("Failed to fetch course detail additions:", err);
        } finally {
          setLoadingExtra(false);
        }
      };

      fetchExtraData();
    }
  }, [course, open]);

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold px-2 py-0.5">
              {course.code}
            </Badge>
            <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
              {course.level} Level
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold truncate mt-2">{course.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground truncate">
            {course.department_name || "No Department"} Department
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden mt-4">
          <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "details"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Info className="h-3.5 w-3.5" />
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("students")}
              className={`flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "students"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Enrolled ({loadingExtra ? "..." : enrollments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("materials")}
              className={`flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === "materials"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Materials ({loadingExtra ? "..." : materials.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 py-4 custom-scrollbar">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-4 m-0 outline-none">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-line bg-muted/30 p-3 rounded-lg border border-border/50">
                    {course.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Lecturer</Label>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {course.lecturer_name || "Not Assigned"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Created At</Label>
                    <p className="text-sm text-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(course.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {course.lecturer_remark && (
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Lecturer Remarks
                    </Label>
                    <p className="text-sm text-foreground bg-success/5 p-3 rounded-lg border border-success/10 italic">
                      &quot;{course.lecturer_remark}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
              <div className="m-0 outline-none">
                {loadingExtra ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No students enrolled in this course.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {enrollments.map((enr) => {
                      const studentInitials = (
                        (enr.student.profile?.first_name?.[0] || "") +
                        (enr.student.profile?.last_name?.[0] || "")
                      ).toUpperCase() || "S";
                      return (
                        <div key={enr.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {studentInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {enr.student.profile?.first_name} {enr.student.profile?.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{enr.student.email}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(enr.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === "materials" && (
              <div className="m-0 outline-none">
                {loadingExtra ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No course materials uploaded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {materials.map((mat) => (
                      <div key={mat.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded bg-muted text-muted-foreground shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {mat.file_name || mat.title || "Untitled File"}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase">{mat.file_type || "File"}</p>
                          </div>
                        </div>
                        {mat.file && (
                          <a
                            href={mat.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full hover:bg-muted text-primary transition-colors shrink-0"
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
