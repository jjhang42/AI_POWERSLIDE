"use client";

import { Undo2, Redo2 } from "lucide-react";
import { Button } from "./ui/button";

interface UndoRedoButtonsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function UndoRedoButtons({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: UndoRedoButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Undo Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={!canUndo}
        onClick={onUndo}
        className="h-8 w-8 p-0 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo (⌘Z)"
      >
        <Undo2 className="w-4 h-4" />
      </Button>

      {/* Redo Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={!canRedo}
        onClick={onRedo}
        className="h-8 w-8 p-0 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo (⌘⇧Z)"
      >
        <Redo2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
