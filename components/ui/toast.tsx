"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  duration?: number;
}

export function Toast({ open, onClose, children, duration = 2000 }: ToastProps) {
  // Auto close after duration
  if (open && duration > 0) {
    setTimeout(onClose, duration);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="min-w-[320px] h-14 px-4 flex items-center gap-3 bg-black/80 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10">
            {children}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
