"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialSlideIndex);
      document.documentElement.requestFullscreen?.();
    } else {
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
          if (currentIndex < slides.length - 1) {
            setDirection(1);
            setCurrentIndex(currentIndex + 1);
          }
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(currentIndex - 1);
          }
          break;
        case "Home":
          e.preventDefault();
          setDirection(-1);
          setCurrentIndex(0);
          break;
        case "End":
          e.preventDefault();
          setDirection(1);
          setCurrentIndex(slides.length - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, slides.length, onClose]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -1000 : 1000, opacity: 0 }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[200]">
      <div className="h-full flex items-center justify-center">
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

      {/* 클릭으로 슬라이드 이동 (좌/우 절반) */}
      <div className="absolute inset-0 grid grid-cols-2 pointer-events-auto">
        <div
          className="cursor-w-resize"
          onClick={() => {
            if (currentIndex > 0) {
              setDirection(-1);
              setCurrentIndex(currentIndex - 1);
            }
          }}
        />
        <div
          className="cursor-e-resize"
          onClick={() => {
            if (currentIndex < slides.length - 1) {
              setDirection(1);
              setCurrentIndex(currentIndex + 1);
            }
          }}
        />
      </div>
    </div>
  );
}
