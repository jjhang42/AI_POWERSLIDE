"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { SlideWithProps } from "@/lib/types/slides";

interface PresentModeProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideWithProps[];
  initialSlideIndex: number;
  renderSlide: (slide: SlideWithProps) => React.ReactNode;
}

export function PresentMode({
  isOpen,
  onClose,
  slides,
  initialSlideIndex,
  renderSlide,
}: PresentModeProps) {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [direction, setDirection] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialSlideIndex);
      // Request fullscreen
      document.documentElement.requestFullscreen?.();
    } else {
      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  }, [isOpen, initialSlideIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "Enter":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prevSlide();
          break;
        case "Home":
          e.preventDefault();
          setCurrentIndex(0);
          break;
        case "End":
          e.preventDefault();
          setCurrentIndex(slides.length - 1);
          break;
      }
    };

    // Auto-hide controls
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!isPaused) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isOpen, currentIndex, slides.length, isPaused]);

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[200]">
      {/* Current Slide */}
      <div className="h-full flex items-center justify-center p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.5 },
              opacity: { duration: 0.3 },
            }}
            className="w-full h-full flex items-center justify-center"
          >
            {slides[currentIndex] && renderSlide(slides[currentIndex])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Click areas for navigation */}
      <div className="absolute inset-0 grid grid-cols-3 pointer-events-auto">
        <div
          className="cursor-w-resize"
          onClick={prevSlide}
          title="Previous slide"
        />
        <div className="cursor-default" onClick={() => setIsPaused(!isPaused)} />
        <div
          className="cursor-e-resize"
          onClick={nextSlide}
          title="Next slide"
        />
      </div>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
              {/* Slide counter */}
              <div className="flex items-center gap-4">
                <span className="text-white text-lg font-medium">
                  {currentIndex + 1} / {slides.length}
                </span>
                <span className="text-white/60 text-sm">
                  {slides[currentIndex]?.name}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => setIsPaused(!isPaused)}
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                >
                  {isPaused ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  onClick={nextSlide}
                  disabled={currentIndex === slides.length - 1}
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-white/20 mx-2" />

                <Button
                  onClick={onClose}
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentIndex + 1) / slides.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help text */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 right-6 text-white/60 text-sm pointer-events-none"
          >
            Press ESC to exit • ←/→ to navigate • Click sides to navigate
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
