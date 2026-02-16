"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  onSave?: () => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  onChange,
  onSave,
  className,
  multiline = false,
  placeholder = "Click to edit",
}: EditableTextProps) {
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
    setIsEditing(true);
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative cursor-text rounded-md transition-all duration-150",
          "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]",
          "hover:backdrop-blur-sm",
          className
        )}
        whileHover={{ scale: 1.005 }}
        transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.15 }}
      >
        {value || <span className="text-muted-foreground">{placeholder}</span>}

        {/* Subtle edit icon on hover */}
        <AnimatePresence>
          {isHovered && !isEditing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute -right-2 -top-2 p-1 bg-background rounded-full shadow-sm border border-border"
            >
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save feedback */}
        <AnimatePresence>
          {showSavedFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -right-8 top-0 text-xs text-green-600 dark:text-green-400 font-medium"
            >
              ✓
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
