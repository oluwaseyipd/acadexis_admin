"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, GraduationCap, Info } from "lucide-react";
import adminService from "@/services/adminService";
import type { University, Faculty } from "@/types";

interface UniversityDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  university: University | null;
}

export function UniversityDetailsDialog({ open, onOpenChange, university }: UniversityDetailsDialogProps) {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);

  useEffect(() => {
    if (university && open) {
      const fetchFaculties = async () => {
        setLoadingFaculties(true);
        try {
          const data = await adminService.getFaculties({ university: university.id });
          setFaculties(data.results || data || []);
        } catch (err) {
          console.error("Failed to fetch university faculties:", err);
        } finally {
          setLoadingFaculties(false);
        }
      };

      fetchFaculties();
    }
  }, [university, open]);

  if (!university) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold px-2.5 py-0.5">
              {university.code || "UNI"}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold mt-2 truncate flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {university.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground truncate">
            University details and academic divisions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-4 custom-scrollbar">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              About Institution
            </Label>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line bg-muted/30 p-3 rounded-lg border border-border/50">
              {university.description || "No description provided for this university."}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              Faculties / Divisions ({loadingFaculties ? "..." : faculties.length})
            </Label>

            {loadingFaculties ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : faculties.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-card/30">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-35" />
                <p className="text-xs">No faculties associated with this university yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {faculties.map((fac) => (
                  <div key={fac.id} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                    <div className="w-7 h-7 rounded bg-success/10 flex items-center justify-center text-success shrink-0">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{fac.name}</p>
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
