/**
 * ⚠️ AI MODIFICATION RESTRICTED ⚠️
 * This file contains user-controlled positioning system.
 * AI can USE this component but CANNOT MODIFY this code.
 * Only human developers can edit this file.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface Position {
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
}

interface DraggableElementProps {
  children: React.ReactNode;
  position?: Position;
  onPositionChange?: (position: Position) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
}

export function DraggableElement({
  children,
  position = { x: 0, y: 0, rotation: 0, scale: 1 },
  onPositionChange,
  isSelected = false,
  onSelect,
  disabled = false,
  className = "",
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Handle keyboard movement
  useEffect(() => {
    if (!isSelected || disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const step = e.shiftKey ? 10 : 1;
      const newPosition = { ...position };

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          newPosition.y = (position.y || 0) - step;
          break;
        case "ArrowDown":
          e.preventDefault();
          newPosition.y = (position.y || 0) + step;
          break;
        case "ArrowLeft":
          e.preventDefault();
          newPosition.x = (position.x || 0) - step;
          break;
        case "ArrowRight":
          e.preventDefault();
          newPosition.x = (position.x || 0) + step;
          break;
        default:
          return;
      }

      onPositionChange?.(newPosition);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, disabled]);

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (position.x || 0),
      y: e.clientY - (position.y || 0),
    });
    onSelect?.();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        ...position,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      onPositionChange?.(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart.x, dragStart.y]);

  return (
    <motion.div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className={`
        ${disabled ? "" : "cursor-move"}
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
        ${className}
      `}
      style={{
        position: "relative",
        userSelect: isDragging ? "none" : "auto",
        transform: `translate(${position.x || 0}px, ${position.y || 0}px) rotate(${position.rotation || 0}deg) scale(${position.scale || 1})`,
      }}
    >
      {children}

      {/* Selection indicator */}
      {isSelected && !disabled && (
        <div className="absolute -top-8 left-0 px-2 py-1 bg-blue-500 text-white text-xs rounded pointer-events-none">
          x: {Math.round(position.x || 0)}, y: {Math.round(position.y || 0)}
          {position.rotation !== 0 && ` ∠${Math.round(position.rotation || 0)}°`}
        </div>
      )}
    </motion.div>
  );
}
