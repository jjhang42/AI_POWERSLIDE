"use client";

import { useState, useCallback } from "react";

interface UndoRedoOptions<T> {
  maxHistorySize?: number;
}

export function useUndoRedo<T>(
  initialState: T,
  options: UndoRedoOptions<T> = {}
) {
  const { maxHistorySize = 50 } = options;

  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = history[currentIndex];

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const set = useCallback(
    (newState: T) => {
      setHistory((prev) => {
        // Remove any redo history
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(newState);

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          setCurrentIndex(maxHistorySize - 1);
        } else {
          setCurrentIndex(newHistory.length - 1);
        }

        return newHistory;
      });
    },
    [currentIndex, maxHistorySize]
  );

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canRedo]);

  const reset = useCallback((newState: T) => {
    setHistory([newState]);
    setCurrentIndex(0);
  }, []);

  return {
    state: current,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}
