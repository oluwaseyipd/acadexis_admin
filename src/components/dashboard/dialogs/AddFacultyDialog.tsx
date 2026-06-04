"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader } from "lucide-react";
import adminService from "@/services/adminService";
import type { Faculty, University } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AddFacultyDialogProps {
  onFacultyAdded?: (faculty: Faculty) => void;
}

export function AddFacultyDialog({ onFacultyAdded }: AddFacultyDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
  });
  const { toast } = useToast();

  // Fetch universities when dialog opens
  useEffect(() => {
    if (open) {
      fetchUniversities();
    }
  }, [open]);

  const fetchUniversities = async () => {
    setLoadingUniversities(true);
    try {
      const data = await adminService.getUniversities();
      setUniversities(data.results || data);
    } catch (err) {
      console.error("Failed to fetch universities:", err);
      toast({
        title: "Error",
        description: "Failed to load universities",
      });
    } finally {
      setLoadingUniversities(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Faculty name is required",
      });
      return;
    }

    if (!formData.university) {
      toast({
        title: "Error",
        description: "Please select a university",
      });
      return;
    }

    setLoading(true);
    try {
      const newFaculty = await adminService.createFaculty({
        name: formData.name,
        university: formData.university,
      });

      toast({
        title: "Success",
        description: "Faculty created successfully",
      });

      setFormData({ name: "", university: "" });
      setOpen(false);
      onFacultyAdded?.(newFaculty);
    } catch (err) {
      console.error("Failed to create faculty:", err);
      toast({
        title: "Error",
        description: "Failed to create faculty",
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
          Add Faculty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Faculty</DialogTitle>
          <DialogDescription>
            Create a new faculty. Note: A faculty must belong to a university.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="university">University *</Label>
            <Select value={formData.university} onValueChange={(value) => setFormData({ ...formData, university: value })}>
              <SelectTrigger id="university" disabled={loadingUniversities}>
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
              <p className="text-sm text-destructive">No universities available. Please create a university first.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Faculty Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Faculty of Science"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || universities.length === 0}>
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Faculty"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
