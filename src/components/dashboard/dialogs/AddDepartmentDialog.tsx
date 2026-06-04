"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader } from "lucide-react";
import adminService from "@/services/adminService";
import type { Department, Faculty } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AddDepartmentDialogProps {
  onDepartmentAdded?: (department: Department) => void;
}

export function AddDepartmentDialog({ onDepartmentAdded }: AddDepartmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    faculty: "",
  });
  const { toast } = useToast();

  // Fetch faculties when dialog opens
  useEffect(() => {
    if (open) {
      fetchFaculties();
    }
  }, [open]);

  const fetchFaculties = async () => {
    setLoadingFaculties(true);
    try {
      const data = await adminService.getFaculties();
      setFaculties(data.results || data);
    } catch (err) {
      console.error("Failed to fetch faculties:", err);
      toast({
        title: "Error",
        description: "Failed to load faculties",
      });
    } finally {
      setLoadingFaculties(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: "Error",
        description: "Department code is required",
      });
      return;
    }

    if (!formData.faculty) {
      toast({
        title: "Error",
        description: "Please select a faculty",
      });
      return;
    }

    setLoading(true);
    try {
      const newDepartment = await adminService.createDepartment({
        name: formData.name,
        code: formData.code,
        faculty: formData.faculty,
      });

      toast({
        title: "Success",
        description: "Department created successfully",
      });

      setFormData({ name: "", code: "", faculty: "" });
      setOpen(false);
      onDepartmentAdded?.(newDepartment);
    } catch (err) {
      console.error("Failed to create department:", err);
      toast({
        title: "Error",
        description: "Failed to create department",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>
            Create a new department. Note: A department must belong to a faculty.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty *</Label>
            <Select value={formData.faculty} onValueChange={(value) => setFormData({ ...formData, faculty: value })}>
              <SelectTrigger id="faculty" disabled={loadingFaculties}>
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
              <p className="text-sm text-destructive">No faculties available. Please create a faculty first.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Computer Science"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Department Code *</Label>
            <Input
              id="code"
              placeholder="e.g., CS"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || faculties.length === 0}>
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Department"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
