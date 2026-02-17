"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEdit } from "@/lib/contexts/EditContext";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  onSave?: () => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function EditableText({
  value,
  onChange,
  onSave,
  className,
  multiline = false,
  placeholder = "Click to edit",
  disabled = false,
}: EditableTextProps) {
  const { isEditMode } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!disabled && isEditMode) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
      onSave?.();

      // Show save feedback
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
    // ⌘+Enter to save (for multiline)
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && multiline) {
      e.preventDefault();
      handleBlur();
    }
  };

  if (!isEditing) {
    return (
      <motion.div
        onClick={handleClick}
        onMouseEnter={() => isEditMode && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative rounded-md transition-all duration-200",
          isEditMode && [
            "cursor-text",
            "hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
            "hover:ring-1 hover:ring-blue-200 dark:hover:ring-blue-800",
            "hover:shadow-sm hover:shadow-blue-100 dark:hover:shadow-blue-900/30",
          ],
          !isEditMode && "cursor-default",
          className
        )}
        whileHover={isEditMode ? { scale: 1.005 } : {}}
        transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.15 }}
      >
        {value || <span className="text-muted-foreground">{placeholder}</span>}

        {/* Subtle edit icon on hover - only in edit mode */}
        <AnimatePresence>
          {isEditMode && isHovered && !isEditing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute -right-3 -top-3 p-1.5 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 border border-blue-400"
            >
              <Pencil className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save feedback */}
        <AnimatePresence>
          {showSavedFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute -right-8 top-0 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg"
            >
              ✓ Saved
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  const Component = multiline ? "textarea" : "input";

  return (
    <motion.div
      initial={{ scale: 0.98 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Component
        ref={inputRef as any}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          className,
          "ring-2 ring-blue-500 dark:ring-blue-400",
          "shadow-lg shadow-blue-500/20",
          "rounded-md px-3 py-1 bg-background",
          "transition-all duration-200 ease-out",
          "focus:outline-none"
        )}
        rows={multiline ? 4 : undefined}
      />
    </motion.div>
  );
}
