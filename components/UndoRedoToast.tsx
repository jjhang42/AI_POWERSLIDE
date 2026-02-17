"use client";

import { Undo2, Redo2 } from "lucide-react";
import { Toast } from "./ui/toast";
import { Button } from "./ui/button";

interface UndoRedoToastProps {
  open: boolean;
  onClose: () => void;
  action: "undo" | "redo";
  description: string;
  onActionClick?: () => void;
}

export function UndoRedoToast({
  open,
  onClose,
  action,
  description,
  onActionClick,
}: UndoRedoToastProps) {
  const isUndo = action === "undo";

  return (
    <Toast open={open} onClose={onClose} duration={2000}>
      {/* Icon */}
      <div className="flex-shrink-0">
        {isUndo ? (
          <Undo2 className="w-5 h-5 text-white" />
        ) : (
          <Redo2 className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Description */}
      <span className="text-[15px] text-white font-medium flex-1">
        {description}
      </span>

      {/* Action Button */}
      {onActionClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onActionClick();
            onClose();
          }}
          className="h-8 px-3 text-white hover:bg-white/10 font-medium"
        >
          {isUndo ? "Redo" : "Undo"}
        </Button>
      )}
    </Toast>
  );
}
