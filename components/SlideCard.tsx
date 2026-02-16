"use client";

import { motion } from "framer-motion";
import { GripVertical, Copy, Trash2, Eye } from "lucide-react";
import { SlideWithProps } from "@/lib/types/slides";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  TitleSlide,
  SectionTitle,
  ContentSlide,
  TwoColumn,
  BulletPoints,
  QuoteSlide,
  ImageWithCaption,
  ThankYou,
} from "@/components/templates";

interface SlideCardProps {
  slide: SlideWithProps;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onInspector: () => void;
  dragHandleProps?: any;
  isDragging?: boolean;
}

export function SlideCard({
  slide,
  index,
  isActive,
  onClick,
  onDuplicate,
  onDelete,
  onInspector,
  dragHandleProps,
  isDragging = false,
}: SlideCardProps) {
  // Render mini preview of slide
  const renderMiniSlide = () => {
    const props = slide.props;

    switch (slide.type) {
      case "TitleSlide":
        return <TitleSlide {...props} />;
      case "SectionTitle":
        return <SectionTitle {...props} />;
      case "ContentSlide":
        return <ContentSlide {...props} />;
      case "TwoColumn":
        return <TwoColumn {...props} />;
      case "BulletPoints":
        return <BulletPoints {...props} />;
      case "QuoteSlide":
        return <QuoteSlide {...props} />;
      case "ImageWithCaption":
        return <ImageWithCaption {...props} />;
      case "ThankYou":
        return <ThankYou {...props} />;
      default:
        return null;
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isDragging ? 0.5 : 1,
            y: 0,
            scale: isDragging ? 1.05 : 1,
          }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            type: "tween",
            ease: [0.25, 0.1, 0.25, 1],
            duration: 0.2
          }}
          className={`group relative flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            isActive
              ? "bg-primary/10 border-primary ring-2 ring-primary/20"
              : "bg-muted/30 border-border hover:bg-muted/50 hover:border-primary/30"
          } ${isDragging ? "shadow-2xl" : ""}`}
          onClick={onClick}
        >
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Slide Number */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>

          {/* Thumbnail Preview */}
          <div className="flex-1 min-w-0">
            <div className="relative aspect-video bg-gradient-to-br from-background to-muted/20 rounded-md overflow-hidden border border-border/50 mb-2 shadow-sm">
              {/* Mini preview with better scaling */}
              <div
                className="absolute inset-0 origin-top-left pointer-events-none"
                style={{
                  transform: 'scale(0.15)',
                  transformOrigin: 'top left',
                  width: '666.67%',
                  height: '666.67%',
                }}
              >
                <div className="w-[1920px] h-[1080px] bg-white dark:bg-gray-900">
                  {renderMiniSlide()}
                </div>
              </div>

              {/* Overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
            </div>

            {/* Slide Info */}
            <div>
              <p className="text-sm font-medium truncate">{slide.name}</p>
              <p className="text-xs text-muted-foreground truncate">{slide.type}</p>
            </div>
          </div>
        </motion.div>
      </ContextMenuTrigger>

      {/* Context Menu */}
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onInspector}>
          <Eye className="w-4 h-4 mr-2" />
          Inspector
          <ContextMenuShortcut>⌘I</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
