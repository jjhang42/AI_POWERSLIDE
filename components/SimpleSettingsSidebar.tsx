"use client";

import { useState } from "react"; // isExporting, exportProgress 상태용
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Maximize, Minimize, Download, FileImage, FileText, Presentation, Loader2 } from "lucide-react";
import { AspectRatioSelector, AspectRatio } from "./AspectRatioSelector";

interface SimpleSettingsSidebarProps {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  isFullscreen: boolean;
  onFullscreenChange: (fullscreen: boolean) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SimpleSettingsSidebar({
  aspectRatio,
  onAspectRatioChange,
  isFullscreen,
  onFullscreenChange,
  isOpen,
  onOpenChange,
}: SimpleSettingsSidebarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      onFullscreenChange(true);
    } else {
      document.exitFullscreen();
      onFullscreenChange(false);
    }
  };

  const getSlideElements = (): HTMLElement[] => {
    // SlideCanvas 내부의 슬라이드 컨텐츠 찾기
    const slideContent = document.querySelector("[data-slide-content='true']");

    if (slideContent) {
      // 슬라이드 컨텐츠 자체를 반환 (자식이 아니라 컨테이너 전체)
      return [slideContent as HTMLElement];
    }

    return [];
  };

  const handleExport = async (format: "jpg" | "pdf" | "pptx") => {
    const slides = getSlideElements();

    if (slides.length === 0) {
      alert("No slides found to export.");
      return;
    }

    setIsExporting(true);
    setExportProgress(`Exporting ${format.toUpperCase()}...`);

    try {
      const fileName = "iil-presentation";

      // Dynamic import로 브라우저 호환성 확보
      const exportModule = await import("@/lib/export");

      switch (format) {
        case "jpg":
          await exportModule.exportToJpg(slides, fileName);
          break;
        case "pdf":
          await exportModule.exportToPdf(slides, fileName);
          break;
        case "pptx":
          await exportModule.exportToPptx(slides, fileName);
          break;
      }

      setExportProgress("Complete!");
      setTimeout(() => setExportProgress(""), 2000);
    } catch (error) {
      console.error(`Export failed:`, error);
      alert(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setExportProgress("");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* 설정 버튼 */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 z-40"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(true)}
            className="rounded-full px-4 py-2 bg-card/80 backdrop-blur-md border border-border shadow-lg hover:bg-card/90 transition-all"
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Setting</span>
          </Button>
        </motion.div>
      )}

      {/* 배경 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* 우측 사이드바 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            {/* 헤더 */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Settings</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-full w-9 h-9 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 컨텐츠 */}
            <div className="p-6 space-y-8">
              {/* Aspect Ratio */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Aspect Ratio</h3>
                <AspectRatioSelector value={aspectRatio} onChange={onAspectRatioChange} />
              </div>

              {/* 구분선 */}
              <div className="border-t border-border" />

              {/* Display Mode */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Display Mode</h3>
                <Button
                  onClick={toggleFullscreen}
                  variant={isFullscreen ? "default" : "outline"}
                  className="w-full"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="w-4 h-4 mr-2" />
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <Maximize className="w-4 h-4 mr-2" />
                      Enter Fullscreen
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {isFullscreen ? "Fullscreen mode is active." : "Display presentation in fullscreen."}
                </p>
              </div>

              {/* 구분선 */}
              <div className="border-t border-border" />

              {/* Export */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Export</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleExport("jpg")}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileImage className="w-4 h-4 mr-2" />
                    )}
                    Export as JPG
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleExport("pdf")}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    Export as PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleExport("pptx")}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Presentation className="w-4 h-4 mr-2" />
                    )}
                    Export as PowerPoint
                  </Button>
                  {exportProgress && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {exportProgress}
                    </p>
                  )}
                  {!exportProgress && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Export your slides as JPG, PDF, or PowerPoint format.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
