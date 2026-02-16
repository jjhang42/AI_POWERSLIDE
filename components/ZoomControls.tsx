"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Maximize2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  minZoom = 0.5,
  maxZoom = 2,
}: ZoomControlsProps) {
  const canZoomIn = zoom < maxZoom;
  const canZoomOut = zoom > minZoom;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-card/95 backdrop-blur-xl border border-border rounded-full px-3 py-2 shadow-lg"
    >
      <Button
        onClick={onZoomOut}
        size="sm"
        variant="ghost"
        disabled={!canZoomOut}
        className="h-8 w-8 p-0 rounded-full"
        title="Zoom Out (⌘-)"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <button
        onClick={onFitToScreen}
        className="min-w-[4ch] text-sm font-medium hover:text-primary transition-colors px-2"
        title="Click to fit to screen"
      >
        {Math.round(zoom * 100)}%
      </button>

      <Button
        onClick={onZoomIn}
        size="sm"
        variant="ghost"
        disabled={!canZoomIn}
        className="h-8 w-8 p-0 rounded-full"
        title="Zoom In (⌘+)"
      >
        <Plus className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-4 mx-1" />

      <Button
        onClick={onFitToScreen}
        size="sm"
        variant="ghost"
        className="h-8 px-3 rounded-full text-xs"
        title="Fit to Screen"
      >
        <Maximize2 className="w-3 h-3 mr-1" />
        Fit
      </Button>
    </motion.div>
  );
}
