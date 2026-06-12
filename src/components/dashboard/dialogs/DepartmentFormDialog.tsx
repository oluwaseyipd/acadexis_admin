"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import adminService from "@/services/adminService";
import type { Department, Faculty } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null; // Null if adding, object if editing
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function DepartmentFormDialog({ open, onOpenChange, department, onSuccess, trigger }: DepartmentFormDialogProps) {
  const isEdit = !!department;
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    faculty: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoadingFaculties(true);
      try {
        const data = await adminService.getFaculties();
        setFaculties(data.results || data || []);
      } catch (err) {
        console.error("Failed to fetch faculties:", err);
        toast({
          title: "Error",
          description: "Failed to load faculties list.",
        });
      } finally {
        setLoadingFaculties(false);
      }
    };

    if (open) {
      setTimeout(() => {
        fetchFaculties();
        if (department) {
          setFormData({
            name: department.name || "",
            code: department.code || "",
            faculty: department.faculty || "",
          });
        } else {
          setFormData({
            name: "",
            code: "",
            faculty: "",
          });
        }
      }, 0);
    }
  }, [department, open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required.",
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: "Error",
        description: "Department code is required.",
      });
      return;
    }

    if (!formData.faculty) {
      toast({
        title: "Error",
        description: "Please select a faculty.",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEdit && department) {
        await adminService.updateDepartment(department.id, {
          name: formData.name,
          code: formData.code,
          faculty: formData.faculty,
        });
        toast({
          title: "Success",
          description: "Department updated successfully.",
        });
      } else {
        await adminService.createDepartment({
          name: formData.name,
          code: formData.code,
          faculty: formData.faculty,
        });
        toast({
          title: "Success",
          description: "Department created successfully.",
        });
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Failed to save department:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to save department.";
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Department" : "Add Department"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update department details and faculty division." : "Create a new department field of study."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="faculty">Faculty *</Label>
            <Select
              value={formData.faculty}
              onValueChange={(value) => setFormData({ ...formData, faculty: value })}
              disabled={loading || loadingFaculties}
            >
              <SelectTrigger id="faculty">
                <SelectValue placeholder={loadingFaculties ? "Loading faculties..." : "Select a faculty"} />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((fac) => (
                  <SelectItem key={fac.id} value={fac.id}>
                    {fac.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {faculties.length === 0 && !loadingFaculties && (
              <p className="text-xs text-destructive mt-1">No faculties available. Please create a faculty first.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Computer Science"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="code">Department Code *</Label>
            <Input
              id="code"
              placeholder="e.g., CS"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
            <Button type="submit" disabled={loading || faculties.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                isEdit ? "Save Changes" : "Create Department"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
