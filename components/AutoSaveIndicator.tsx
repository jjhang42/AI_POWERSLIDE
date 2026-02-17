"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Loader2, AlertCircle } from "lucide-react";

interface AutoSaveIndicatorProps {
  lastSaved?: Date;
  isSaving?: boolean;
  error?: string;
  compact?: boolean;
}

export function AutoSaveIndicator({
  lastSaved,
  isSaving = false,
  error,
  compact = false,
}: AutoSaveIndicatorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isSaving || error || lastSaved) {
      setShow(true);

      // Auto-hide after 2 seconds if saved successfully
      if (lastSaved && !isSaving && !error) {
        const timer = setTimeout(() => setShow(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [lastSaved, isSaving, error]);

  if (!show && !isSaving && !error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center gap-2 text-sm font-medium"
        title={
          isSaving
            ? "Saving..."
            : error
            ? "Error saving"
            : lastSaved
            ? `Saved at ${lastSaved.toLocaleTimeString()}`
            : undefined
        }
      >
        {isSaving && (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            {!compact && <span className="text-muted-foreground">Saving...</span>}
          </>
        )}

        {error && (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            {!compact && <span className="text-red-500">Error</span>}
          </>
        )}

        {!isSaving && !error && lastSaved && (
          <>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Cloud className="w-4 h-4 text-green-600 dark:text-green-400" />
            </motion.div>
            {!compact && <span className="text-green-600 dark:text-green-400">Saved</span>}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
