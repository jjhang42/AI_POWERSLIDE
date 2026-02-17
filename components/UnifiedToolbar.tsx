"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Undo2,
  Redo2,
  History,
  Grid3x3,
  Wand2,
  Minus,
  Plus,
  Monitor,
  ChevronDown,
  Maximize2,
  Download,
  FileImage,
  FileText,
  Presentation,
  Loader2,
} from "lucide-react";
import { useEdit } from "@/lib/contexts/EditContext";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { AspectRatio } from "./AspectRatioSelector";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UnifiedToolbarProps {
  // Edit History
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenHistory: () => void;

  // Context
  currentSlideIndex: number;
  totalSlides: number;

  // View Controls
  showGrid: boolean;
  onToggleGrid: () => void;
  onOpenTransitions: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;

  // Aspect Ratio
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;

  // Status
  lastSaved?: Date;
  isSaving: boolean;

  // Present Mode
  onStartPresent: () => void;

  // Export
  onExport: (format: "jpg" | "pdf" | "pptx") => void;
  isExporting: boolean;
}

export function UnifiedToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenHistory,
  currentSlideIndex,
  totalSlides,
  showGrid,
  onToggleGrid,
  onOpenTransitions,
  zoom,
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
  aspectRatio,
  onAspectRatioChange,
  lastSaved,
  isSaving,
  onStartPresent,
  onExport,
  isExporting,
}: UnifiedToolbarProps) {
  useEdit(); // EditContext 연결 유지
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 마운트 전 또는 슬라이드 없을 때는 렌더링하지 않음 (SSR과 클라이언트 일치)
  if (!mounted || totalSlides === 0) return null;

  return (
    <>
      {/* Main Toolbar - Full Width */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-[220px] right-0 z-50"
      >
        <div className="flex items-center justify-between h-14 px-6 bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-xl">
          {/* Left Group - Edit History & View Controls */}
          <div className="flex items-center gap-1">
            {/* Aspect Ratio Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md gap-1"
                  title="Aspect Ratio"
                >
                  <Monitor className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onAspectRatioChange("16:9")}>
                  <Monitor className="w-4 h-4 mr-2" />
                  16:9 (1920×1080)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAspectRatioChange("4:3")}>
                  <Monitor className="w-4 h-4 mr-2" />
                  4:3 (1600×1200)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onStartPresent}>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  전체화면 발표
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-border mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 w-8 p-0 rounded-md"
              title="Undo (⌘Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-8 w-8 p-0 rounded-md"
              title="Redo (⌘⇧Z)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenHistory}
              className="h-8 w-8 p-0 rounded-md"
              title="History (⌘H)"
            >
              <History className="w-4 h-4" />
            </Button>


            {/* View Controls */}
            <div className="w-px h-6 bg-border mx-2" />
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="sm"
              onClick={onToggleGrid}
              className="h-8 w-8 p-0 rounded-md"
              title="Toggle Grid & Guides"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenTransitions}
              className="h-8 w-8 p-0 rounded-md"
              title="Slide Transitions"
            >
              <Wand2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Center Group - Slide Counter */}
          <div className="absolute left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-mono text-muted-foreground">
            {currentSlideIndex + 1} / {totalSlides}
          </div>

          {/* Right Group - Mode & Status */}
          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-muted/30 rounded-md px-2 py-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                disabled={!canZoomOut}
                className="h-6 w-6 p-0 rounded"
                title="Zoom Out (⌘-)"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-xs font-mono min-w-[3ch] text-center text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                disabled={!canZoomIn}
                className="h-6 w-6 p-0 rounded"
                title="Zoom In (⌘+)"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md gap-1"
                  title="Export"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExport("jpg")}>
                  <FileImage className="w-4 h-4 mr-2" />
                  JPG로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("pdf")}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport("pptx")}>
                  <Presentation className="w-4 h-4 mr-2" />
                  PowerPoint로 내보내기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-border" />

            {/* AutoSave */}
            <AutoSaveIndicator
              lastSaved={lastSaved}
              isSaving={isSaving}
              compact
            />

          </div>
        </div>
      </motion.div>
    </>
  );
}
