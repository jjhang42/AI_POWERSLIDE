"use client";

import { useEdit } from "@/lib/contexts/EditContext";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useEdit();

  return (
    <>
      {/* Edit Mode Indicator Bar */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 z-[200] shadow-lg shadow-blue-500/50"
            style={{ transformOrigin: "left" }}
          />
        )}
      </AnimatePresence>

      {/* Edit Mode Badge */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[199] px-4 py-1.5 bg-blue-500/90 backdrop-blur-md text-white text-xs font-medium rounded-full shadow-lg"
          >
            ✏️ Edit Mode Active - Click text to edit
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="fixed top-6 right-6 z-40">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
            className={`rounded-full px-4 ${
              isEditMode
                ? "bg-blue-500 hover:bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30"
                : ""
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </>
  );
}
