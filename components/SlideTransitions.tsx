"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wand2, X } from "lucide-react";

export type TransitionType = "fade" | "slide" | "scale" | "cube" | "none";

interface SlideTransitionsProps {
  currentTransition: TransitionType;
  onTransitionChange: (transition: TransitionType) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TRANSITIONS: { type: TransitionType; name: string; description: string }[] = [
  { type: "none", name: "None", description: "Instant change" },
  { type: "fade", name: "Fade", description: "Smooth crossfade" },
  { type: "slide", name: "Slide", description: "Push from side" },
  { type: "scale", name: "Scale", description: "Zoom in/out" },
  { type: "cube", name: "Cube", description: "3D rotation" },
];

export function SlideTransitions({
  currentTransition,
  onTransitionChange,
  isOpen,
  onOpenChange,
}: SlideTransitionsProps) {
  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "tween",
                ease: [0.25, 0.1, 0.25, 1],
                duration: 0.3,
              }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Slide Transitions</h2>
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {TRANSITIONS.map((transition, index) => (
                  <motion.button
                    key={transition.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onTransitionChange(transition.type);
                      onOpenChange(false);
                    }}
                    className={`
                      w-full text-left py-3 px-4 rounded-lg transition-all
                      ${
                        currentTransition === transition.type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/30 hover:bg-muted/50"
                      }
                    `}
                  >
                    <div className="font-medium">{transition.name}</div>
                    <div
                      className={`text-sm ${
                        currentTransition === transition.type
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {transition.description}
                    </div>
                  </motion.button>
                ))}
              </div>

              <p className="mt-6 text-xs text-center text-muted-foreground">
                Transitions apply when navigating between slides
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Transition variants for use in slide rendering
export const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  slide: (direction: number) => ({
    initial: { x: direction > 0 ? 300 : -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: direction > 0 ? -300 : 300, opacity: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  cube: (direction: number) => ({
    initial: {
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
    },
    exit: {
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
    },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: { duration: 0 },
  },
};
