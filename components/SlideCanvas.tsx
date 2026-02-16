"use client";

import { ReactNode } from "react";
import { AspectRatio, ASPECT_RATIOS } from "./AspectRatioSelector";

interface SlideCanvasProps {
  children: ReactNode;
  aspectRatio: AspectRatio;
  isFullscreen?: boolean;
}

export function SlideCanvas({ children, aspectRatio, isFullscreen = false }: SlideCanvasProps) {
  const dimensions = ASPECT_RATIOS[aspectRatio];
  const ratio = dimensions.width / dimensions.height;

  return (
    <div
      className="w-full h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `repeating-linear-gradient(
          45deg,
          hsl(var(--muted)),
          hsl(var(--muted)) 10px,
          hsl(var(--muted) / 0.8) 10px,
          hsl(var(--muted) / 0.8) 20px
        )`,
      }}
    >
      {/* Slide Container */}
      <div
        className="relative bg-background shadow-2xl"
        style={{
          aspectRatio: `${ratio}`,
          width: isFullscreen ? "100vw" : "90vw",
          height: isFullscreen ? "100vh" : "90vh",
          maxWidth: isFullscreen ? "100vw" : `min(90vw, calc(90vh * ${ratio}))`,
          maxHeight: isFullscreen ? "100vh" : `min(90vh, calc(90vw / ${ratio}))`,
        }}
      >
        {/* Actual Slide Content */}
        <div className="w-full h-full overflow-hidden">
          {children}
        </div>

        {/* Aspect Ratio Label */}
        {!isFullscreen && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm font-mono rounded">
            {aspectRatio} ({dimensions.width}×{dimensions.height})
          </div>
        )}
      </div>
    </div>
  );
}
