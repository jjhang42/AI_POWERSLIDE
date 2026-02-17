/**
 * ⚠️ AI MODIFICATION RESTRICTED ⚠️
 * This file contains user-controlled positioning system.
 * AI can USE this component but CANNOT MODIFY this code.
 * Only human developers can edit this file.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Move, RotateCw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface PositionManagerProps {
  isEnabled: boolean;
  onToggle: () => void;
  selectedElementId: string | null;
  onReset?: () => void;
}

export function PositionManager({
  isEnabled,
  onToggle,
  selectedElementId,
  onReset,
}: PositionManagerProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-lg p-2 flex items-center gap-2">
      {/* Toggle Button */}
      <Button
        variant={isEnabled ? "default" : "ghost"}
        size="sm"
        onClick={onToggle}
        className="gap-2"
      >
        <Move className="w-4 h-4" />
        {isEnabled ? "Positioning ON" : "Positioning OFF"}
      </Button>

      {isEnabled && (
        <>
          <div className="w-px h-6 bg-border" />

          {/* Status */}
          <div className="text-xs text-muted-foreground px-2">
            {selectedElementId ? (
              <span className="text-blue-500 font-medium">
                Element selected - Use arrow keys or drag
              </span>
            ) : (
              "Click an element to position it"
            )}
          </div>

          {selectedElementId && (
            <>
              <div className="w-px h-6 bg-border" />

              {/* Reset Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Reset
              </Button>
            </>
          )}

          <div className="w-px h-6 bg-border" />

          {/* Keyboard Shortcuts Help */}
          <div className="text-xs text-muted-foreground px-2">
            <kbd className="px-1 py-0.5 bg-background rounded border text-[10px]">↑↓←→</kbd>{" "}
            Move 1px
            <span className="mx-2">|</span>
            <kbd className="px-1 py-0.5 bg-background rounded border text-[10px]">Shift+↑↓←→</kbd>{" "}
            Move 10px
          </div>
        </>
      )}
    </div>
  );
}
