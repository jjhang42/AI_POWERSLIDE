"use client";

/**
 * EditorButton
 * 좌상단 Edit 버튼
 */

import React from "react";
import { Pencil } from "lucide-react";
import { useEditor } from "@/app/providers/PresentationProvider";
import { motion } from "framer-motion";

export function EditorButton() {
  const { isOpen, toggleSidebar } = useEditor();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isOpen ? 0 : 1,
        y: 0
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-6 left-6 z-[160]"
      style={{ pointerEvents: isOpen ? "none" : "auto" }}
    >
      <button
        onClick={toggleSidebar}
        className="rounded-full px-4 py-2 bg-card/80 backdrop-blur-md border border-border shadow-lg hover:bg-card/90 transition-all flex items-center gap-2"
        aria-label={isOpen ? "에디터 닫기" : "에디터 열기"}
      >
        <Pencil className="w-4 h-4" />
        <span className="text-sm font-medium">Edit</span>
      </button>
    </motion.div>
  );
}
