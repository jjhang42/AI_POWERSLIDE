"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Loader2, AlertCircle } from "lucide-react";

interface AutoSaveIndicatorProps {
  lastSaved?: Date;
  isSaving?: boolean;
  error?: string;
}

export function AutoSaveIndicator({
  lastSaved,
  isSaving = false,
  error,
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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center gap-2 text-sm font-medium"
      >
        {isSaving && (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Saving...</span>
          </>
        )}

        {error && (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-500">Error saving</span>
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
            <span className="text-green-600 dark:text-green-400">Saved</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
