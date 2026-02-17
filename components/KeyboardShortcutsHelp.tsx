"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { key: "⌘ + K", description: "Command Palette" },
  { key: "⌘ + I", description: "Toggle Inspector" },
  { key: "⌘ + D", description: "Duplicate Slide" },
  { key: "⌘ + ⌫", description: "Delete Slide" },
  { key: "⌘ + ←/→", description: "Previous/Next Slide" },
  { key: "⌘ + +/-", description: "Zoom In/Out" },
  { key: "⌘ + 0", description: "Fit to Screen" },
  { key: "F5", description: "Start Presentation" },
  { key: "←/→", description: "Navigate Slides" },
  { key: "Enter", description: "Save Edit (single line)" },
  { key: "⌘ + Enter", description: "Save Edit (multiline)" },
  { key: "Escape", description: "Cancel Edit" },
  { key: "?", description: "Show Shortcuts" },
];

interface KeyboardShortcutsHelpProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function KeyboardShortcutsHelp({ isOpen: controlledIsOpen, onOpenChange }: KeyboardShortcutsHelpProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  return (
    <>
      {/* Toggle Button - Only show if not controlled */}
      {controlledIsOpen === undefined && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 rounded-full"
        >
          <Keyboard className="w-4 h-4" />
        </Button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
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
                <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-3">
                {SHORTCUTS.map((shortcut, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-background rounded border border-border">
                      {shortcut.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              <p className="mt-6 text-xs text-center text-muted-foreground">
                Press <kbd className="px-1 py-0.5 bg-background rounded border">?</kbd> to toggle this menu
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
