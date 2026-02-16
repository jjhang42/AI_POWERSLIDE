"use client";

import { useState } from "react";

export type AspectRatio = "16:9" | "4:3";

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange("16:9")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          value === "16:9"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        16:9
      </button>
      <button
        onClick={() => onChange("4:3")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          value === "4:3"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        4:3
      </button>
    </div>
  );
}

// Aspect ratio dimensions
export const ASPECT_RATIOS = {
  "16:9": { width: 1920, height: 1080 },
  "4:3": { width: 1600, height: 1200 },
} as const;
