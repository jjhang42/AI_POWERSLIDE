"use client";

import { useEdit } from "@/lib/contexts/EditContext";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";

export function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useEdit();

  return (
    <div className="fixed top-6 right-24 z-40">
      <Button
        variant={isEditMode ? "default" : "outline"}
        size="sm"
        onClick={toggleEditMode}
        className="rounded-full px-4"
      >
        {isEditMode ? (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </>
        ) : (
          <>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </>
        )}
      </Button>
    </div>
  );
}
