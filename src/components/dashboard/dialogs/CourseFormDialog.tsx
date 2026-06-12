"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import adminService from "@/services/adminService";
import type { AdminCourse, Department, AdminUser } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: AdminCourse | null; // Null if adding, object if editing
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CourseFormDialog({ open, onOpenChange, course, onSuccess, trigger }: CourseFormDialogProps) {
  const isEdit = !!course;
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lecturers, setLecturers] = useState<AdminUser[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    level: "100",
    department: "",
    lecturer: "",
    lecturer_remark: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const [deptData, lecturerData] = await Promise.all([
          adminService.getDepartments(),
          adminService.getUsers({ role: "lecturer", page_size: 100 }),
        ]);
        setDepartments(deptData.results || deptData || []);
        setLecturers(lecturerData.results || []);
      } catch (err) {
        console.error("Failed to load form options:", err);
        toast({
          title: "Error",
          description: "Failed to load department or lecturer lists.",
        });
      } finally {
        setLoadingOptions(false);
      }
    };

    if (open) {
      setTimeout(() => {
        fetchOptions();
        if (course) {
          setFormData({
            title: course.title || "",
            code: course.code || "",
            description: course.description || "",
            level: course.level || "100",
            department: course.department || "",
            lecturer: course.lecturer || "",
            lecturer_remark: course.lecturer_remark || "",
          });
        } else {
          setFormData({
            title: "",
            code: "",
            description: "",
            level: "100",
            department: "",
            lecturer: "",
            lecturer_remark: "",
          });
        }
      }, 0);
    }
  }, [course, open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Course title is required.",
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: "Error",
        description: "Course code is required.",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEdit && course) {
        await adminService.updateCourse(course.id, {
          title: formData.title,
          code: formData.code,
          description: formData.description,
          level: formData.level,
          department: formData.department || null,
          lecturer: formData.lecturer || null,
          lecturer_remark: formData.lecturer_remark,
        });
        toast({
          title: "Success",
          description: "Course updated successfully.",
        });
      } else {
        await adminService.createCourse({
          title: formData.title,
          code: formData.code,
          description: formData.description,
          level: formData.level,
          department: formData.department || null,
          lecturer: formData.lecturer || null,
          lecturer_remark: formData.lecturer_remark,
        });
        toast({
          title: "Success",
          description: "Course created successfully.",
        });
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Failed to save course:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to save course details.";
      toast({
        title: "Error",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Course" : "Add Course"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update course details and options." : "Create a new course on the platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Computer Science"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                placeholder="e.g., CS101"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a brief course description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              className="resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="level">Course Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
                disabled={loading}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                disabled={loading || loadingOptions}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder={loadingOptions ? "Loading..." : "Select department"} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lecturer">Lecturer</Label>
            <Select
              value={formData.lecturer}
              onValueChange={(value) => setFormData({ ...formData, lecturer: value })}
              disabled={loading || loadingOptions}
            >
              <SelectTrigger id="lecturer">
                <SelectValue placeholder={loadingOptions ? "Loading..." : "Select lecturer"} />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((lect) => (
                  <SelectItem key={lect.id} value={lect.id}>
                    {lect.profile?.first_name || lect.profile?.last_name
                      ? `${lect.profile.first_name || ""} ${lect.profile.last_name || ""}`
                      : lect.name || lect.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lecturer_remark">Lecturer Remarks</Label>
            <Input
              id="lecturer_remark"
              placeholder="e.g., Core course for first-year students"
              value={formData.lecturer_remark}
              onChange={(e) => setFormData({ ...formData, lecturer_remark: e.target.value })}
              disabled={loading}
            />
          </div>

          <DialogFooter className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                isEdit ? "Save Changes" : "Create Course"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
