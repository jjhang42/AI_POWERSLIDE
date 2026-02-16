"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2 } from "lucide-react";

export function FullscreenPrompt() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 전체화면 상태 감지
    const checkFullscreen = () => {
      const fullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(fullscreen);
    };

    checkFullscreen();

    // 전체화면 변경 이벤트 리스너
    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);
    document.addEventListener("mozfullscreenchange", checkFullscreen);
    document.addEventListener("msfullscreenchange", checkFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
      document.removeEventListener("mozfullscreenchange", checkFullscreen);
      document.removeEventListener("msfullscreenchange", checkFullscreen);
    };
  }, []);

  // 전체화면 진입
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        await (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error("전체화면 진입 실패:", error);
    }
  };

  // 전체화면이거나 사용자가 닫았으면 표시하지 않음
  if (isFullscreen || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[200]"
        onClick={() => setIsDismissed(true)}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
        onClick={() => setIsDismissed(true)}
      >
        <div
          className="bg-background rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="p-12 text-center">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Maximize2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            {/* Text */}
            <h2 className="text-3xl font-semibold mb-3 tracking-tight">
              전체화면으로 보기
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              더 나은 프레젠테이션 경험을 위해<br />
              전체화면을 권장합니다
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={enterFullscreen}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:bg-primary/90 transition-colors duration-200"
              >
                전체화면으로 시작
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="w-full py-4 text-muted-foreground hover:text-foreground transition-colors duration-200 text-base font-medium"
              >
                계속하기
              </button>
            </div>
          </div>

          {/* Hint */}
          <div className="px-12 pb-8 text-center">
            <p className="text-xs text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted/50 rounded text-xs font-mono">F11</kbd>
              {" "}키를 눌러 전체화면 전환
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
