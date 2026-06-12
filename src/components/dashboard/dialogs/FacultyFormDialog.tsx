"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import adminService from "@/services/adminService";
import type { Faculty, University } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface FacultyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty | null; // Null if adding, object if editing
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function FacultyFormDialog({ open, onOpenChange, faculty, onSuccess, trigger }: FacultyFormDialogProps) {
  const isEdit = !!faculty;
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoadingUniversities(true);
      try {
        const data = await adminService.getUniversities();
        setUniversities(data.results || data || []);
      } catch (err) {
        console.error("Failed to fetch universities:", err);
        toast({
          title: "Error",
          description: "Failed to load universities list.",
        });
      } finally {
        setLoadingUniversities(false);
      }
    };

    if (open) {
      setTimeout(() => {
        fetchUniversities();
        if (faculty) {
          setFormData({
            name: faculty.name || "",
            university: faculty.university || "",
          });
        } else {
          setFormData({
            name: "",
            university: "",
          });
        }
      }, 0);
    }
  }, [faculty, open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Faculty name is required.",
      });
      return;
    }

    if (!formData.university) {
      toast({
        title: "Error",
        description: "Please select a university.",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEdit && faculty) {
        await adminService.updateFaculty(faculty.id, {
          name: formData.name,
          university: formData.university,
        });
        toast({
          title: "Success",
          description: "Faculty updated successfully.",
        });
      } else {
        await adminService.createFaculty({
          name: formData.name,
          university: formData.university,
        });
        toast({
          title: "Success",
          description: "Faculty created successfully.",
        });
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Failed to save faculty:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to save faculty.";
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
          <DialogTitle>{isEdit ? "Edit Faculty" : "Add Faculty"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update faculty details and university affiliation." : "Create a new faculty divisional structure."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="university">University *</Label>
            <Select
              value={formData.university}
              onValueChange={(value) => setFormData({ ...formData, university: value })}
              disabled={loading || loadingUniversities}
            >
              <SelectTrigger id="university">
                <SelectValue placeholder={loadingUniversities ? "Loading universities..." : "Select a university"} />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {universities.length === 0 && !loadingUniversities && (
              <p className="text-xs text-destructive mt-1">No universities available. Please create a university first.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Faculty Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Faculty of Engineering"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <Button type="submit" disabled={loading || universities.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                isEdit ? "Save Changes" : "Create Faculty"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
