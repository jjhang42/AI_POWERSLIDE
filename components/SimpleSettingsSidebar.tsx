"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Maximize, Minimize } from "lucide-react";

interface SimpleSettingsSidebarProps {
  isFullscreen: boolean;
  onFullscreenChange: (fullscreen: boolean) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SimpleSettingsSidebar({
  isFullscreen,
  onFullscreenChange,
  isOpen,
  onOpenChange,
}: SimpleSettingsSidebarProps) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      onFullscreenChange(true);
    } else {
      document.exitFullscreen();
      onFullscreenChange(false);
    }
  };

  return (
    <>
      {/* 설정 버튼 (슬라이드 없을 때만 우측 상단에 표시) */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
