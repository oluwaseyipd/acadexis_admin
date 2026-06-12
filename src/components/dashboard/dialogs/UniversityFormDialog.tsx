"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import adminService from "@/services/adminService";
import type { University } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UniversityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  university: University | null; // Null if adding, object if editing
  onSuccess?: () => void;
}

export function UniversityFormDialog({ open, onOpenChange, university, onSuccess }: UniversityFormDialogProps) {
  const isEdit = !!university;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (university) {
          setFormData({
            name: university.name || "",
            code: university.code || "",
            description: university.description || "",
          });
        } else {
          setFormData({
            name: "",
            code: "",
            description: "",
          });
        }
      }, 0);
    }
  }, [university, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "University name is required.",
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: "Error",
        description: "University code is required.",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEdit && university) {
        await adminService.updateUniversity(university.id, formData);
        toast({
          title: "Success",
          description: "University updated successfully.",
        });
      } else {
        await adminService.createUniversity(formData);
        toast({
          title: "Success",
          description: "University created successfully.",
        });
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Failed to save university:", err);
      const apiError = err as { response?: { data?: { detail?: string; message?: string } } };
      const msg = apiError.response?.data?.detail || apiError.response?.data?.message || "Failed to save university.";
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit University" : "Add University"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update name, code, or description of the university." : "Register a new university on the platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">University Name *</Label>
            <Input
              id="name"
              placeholder="e.g., University of Cape Town"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="code">University Code *</Label>
            <Input
              id="code"
              placeholder="e.g., UCT"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description of the institution..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              className="resize-none h-24"
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
                isEdit ? "Save Changes" : "Create University"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
