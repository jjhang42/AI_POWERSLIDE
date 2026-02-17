"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, History, Circle, CircleDot } from "lucide-react";
import { Button } from "./ui/button";
import { SlideWithProps } from "@/lib/types/slides";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  historyStates: SlideWithProps[][];
  currentIndex: number;
  onGoToIndex: (index: number) => void;
  lastActionDescription: string;
}

export function HistoryPanel({
  open,
  onClose,
  historyStates,
  currentIndex,
  onGoToIndex,
  lastActionDescription,
}: HistoryPanelProps) {
  const getActionDescription = (index: number) => {
    if (index === 0) return "Initial state";

    const prevState = historyStates[index - 1];
    const currentState = historyStates[index];

    if (currentState.length > prevState.length) {
      const newSlide = currentState[currentState.length - 1];
      return `Added ${newSlide.name}`;
    } else if (currentState.length < prevState.length) {
      return `Deleted slide`;
    } else {
      return `Updated slide`;
    }
  };

  const formatTime = (index: number) => {
    // 간단한 시간 표시 (실제로는 timestamp를 저장해야 함)
    const minutesAgo = historyStates.length - index;
    if (minutesAgo === 0) return "Just now";
    if (minutesAgo === 1) return "1 min ago";
    return `${minutesAgo} min ago`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border shadow-2xl z-[100] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b bg-card/95 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold">History</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {historyStates.length} states • Click to jump
              </p>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {historyStates.map((state, index) => {
                const isCurrent = index === currentIndex;
                const description = getActionDescription(index);

                return (
                  <motion.button
                    key={index}
                    onClick={() => onGoToIndex(index)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-all
                      ${isCurrent
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted"
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Indicator */}
                      <div className="mt-0.5">
                        {isCurrent ? (
                          <CircleDot className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4 opacity-40" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {description}
                        </div>
                        <div className={`text-xs mt-1 ${isCurrent ? "opacity-90" : "text-muted-foreground"}`}>
                          {state.length} slide{state.length !== 1 ? "s" : ""} • {formatTime(index)}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t bg-muted/50 text-xs text-muted-foreground">
              <p>💡 Tip: Use ⌘Z to undo, ⌘⇧Z to redo</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
