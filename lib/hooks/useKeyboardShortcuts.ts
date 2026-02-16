"use client";

import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const metaMatch = shortcut.metaKey ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey;
        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey : !shortcut.ctrlKey || !e.ctrlKey;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.altKey ? e.altKey : !e.altKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          metaMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, enabled]);
}

// Predefined shortcuts for common actions
export const SHORTCUTS = {
  INSPECTOR: { key: "i", metaKey: true, description: "Toggle Inspector (⌘+I)" },
  DELETE_SLIDE: { key: "Backspace", metaKey: true, description: "Delete Slide (⌘+⌫)" },
  DUPLICATE: { key: "d", metaKey: true, description: "Duplicate Slide (⌘+D)" },
  PREV_SLIDE: { key: "ArrowLeft", metaKey: true, description: "Previous Slide (⌘+←)" },
  NEXT_SLIDE: { key: "ArrowRight", metaKey: true, description: "Next Slide (⌘+→)" },
  UNDO: { key: "z", metaKey: true, description: "Undo (⌘+Z)" },
  REDO: { key: "z", metaKey: true, shiftKey: true, description: "Redo (⌘+⇧+Z)" },
};
