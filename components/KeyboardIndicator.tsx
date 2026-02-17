"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Command } from "lucide-react";

interface KeyboardIndicatorProps {
  keys: string[];
  show: boolean;
}

export function KeyboardIndicator({ keys, show }: KeyboardIndicatorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-20 right-8 z-[100]"
        >
          <div className="flex items-center gap-1 px-4 py-3 bg-black/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20">
            {keys.map((key, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <span className="text-white/40 text-sm mx-1">+</span>
                )}

                {key === "⌘" ? (
                  <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-md">
                    <Command className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="min-w-[32px] h-8 px-2 flex items-center justify-center bg-white/10 rounded-md">
                    <span className="text-white font-semibold text-sm uppercase">
                      {key}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
