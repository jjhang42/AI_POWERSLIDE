"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Trash2,
  FileText,
  Heading1,
  Columns2,
  List,
  Quote,
  Image as ImageIcon,
  Smile,
  Square,
} from "lucide-react";

export type TemplateType =
  | "TitleSlide"
  | "SectionTitle"
  | "ContentSlide"
  | "TwoColumn"
  | "BulletPoints"
  | "QuoteSlide"
  | "ImageWithCaption"
  | "ThankYou";

export interface Slide {
  id: string;
  type: TemplateType;
  name: string;
}

interface TemplatesSidebarProps {
  slides: Slide[];
  currentSlideIndex: number;
  onAddSlide: (type: TemplateType) => void;
  onSelectSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
}

const TEMPLATES = [
  { type: "TitleSlide" as TemplateType, name: "Title Slide", icon: Heading1 },
  { type: "SectionTitle" as TemplateType, name: "Section", icon: Square },
  { type: "ContentSlide" as TemplateType, name: "Content", icon: FileText },
  { type: "TwoColumn" as TemplateType, name: "Two Column", icon: Columns2 },
  { type: "BulletPoints" as TemplateType, name: "Bullet Points", icon: List },
  { type: "QuoteSlide" as TemplateType, name: "Quote", icon: Quote },
  { type: "ImageWithCaption" as TemplateType, name: "Image", icon: ImageIcon },
  { type: "ThankYou" as TemplateType, name: "Thank You", icon: Smile },
];

export function TemplatesSidebar({
  slides,
  currentSlideIndex,
  onAddSlide,
  onSelectSlide,
  onDeleteSlide,
}: TemplatesSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 left-6 z-40"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="rounded-full px-4 py-2 bg-card/80 backdrop-blur-md border border-border shadow-lg hover:bg-card/90 transition-all"
          >
            <PanelLeftOpen className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Templates</span>
          </Button>
        </motion.div>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-card border-r border-border shadow-2xl z-30 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold">Slide Templates</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Click to add a new slide
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="rounded-full w-9 h-9 p-0"
              >
                <PanelLeftClose className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Template Grid */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Add Template
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map((template) => {
                    const Icon = template.icon;
                    return (
                      <Button
                        key={template.type}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary transition-all"
                        onClick={() => onAddSlide(template.type)}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-xs font-medium text-center">
                          {template.name}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Slides List */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Slides ({slides.length})
                </h3>
                {slides.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No slides yet</p>
                    <p className="text-xs mt-1">Add a template to start</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {slides.map((slide, index) => (
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`group flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                          index === currentSlideIndex
                            ? "bg-primary/10 border-primary"
                            : "bg-muted/30 border-border hover:bg-muted/50"
                        }`}
                        onClick={() => onSelectSlide(index)}
                      >
                        {/* Slide Number */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                            index === currentSlideIndex
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Slide Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {slide.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {slide.type}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSlide(index);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
