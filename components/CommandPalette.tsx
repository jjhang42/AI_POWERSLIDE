"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Heading1,
  Columns2,
  List,
  Quote,
  Image as ImageIcon,
  Smile,
  Square,
  Search,
  Copy,
  Trash2,
  Eye,
  Play,
  ZoomIn,
  ZoomOut,
  Keyboard,
} from "lucide-react";
import { TemplateType, TEMPLATE_REGISTRY } from "@/components/templates";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSlide: (type: TemplateType) => void;
  onDuplicateSlide: () => void;
  onDeleteSlide: () => void;
  onOpenInspector: () => void;
  onStartPresent: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onShowShortcuts: () => void;
  slides: any[];
  onGoToSlide: (index: number) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onOpenInspector,
  onStartPresent,
  onZoomIn,
  onZoomOut,
  onShowShortcuts,
  slides,
  onGoToSlide,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Reset search when closing
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Command Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: "tween",
              ease: [0.25, 0.1, 0.25, 1],
              duration: 0.2,
            }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-2xl z-[100]"
          >
            <Command
              className="rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
              shouldFilter={true}
            >
              <div className="flex items-center border-b border-border px-4">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono bg-muted rounded border">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                {/* Add Slides */}
                <Command.Group heading="Add Slide" className="px-2 py-2">
                  <CommandItem
                    value="add title slide"
                    onSelect={() => {
                      onAddSlide("TitleSlide");
                      onOpenChange(false);
                    }}
                    icon={Heading1}
                  >
                    Title Slide
                  </CommandItem>
                  <CommandItem
                    value="add section title"
                    onSelect={() => {
                      onAddSlide("SectionTitle");
                      onOpenChange(false);
                    }}
                    icon={Square}
                  >
                    Section Title
                  </CommandItem>
                  <CommandItem
                    value="add content slide"
                    onSelect={() => {
                      onAddSlide("ContentSlide");
                      onOpenChange(false);
                    }}
                    icon={FileText}
                  >
                    Content Slide
                  </CommandItem>
                  <CommandItem
                    value="add two column"
                    onSelect={() => {
                      onAddSlide("TwoColumn");
                      onOpenChange(false);
                    }}
                    icon={Columns2}
                  >
                    Two Column
                  </CommandItem>
                  <CommandItem
                    value="add bullet points"
                    onSelect={() => {
                      onAddSlide("BulletPoints");
                      onOpenChange(false);
                    }}
                    icon={List}
                  >
                    Bullet Points
                  </CommandItem>
                  <CommandItem
                    value="add quote"
                    onSelect={() => {
                      onAddSlide("QuoteSlide");
                      onOpenChange(false);
                    }}
                    icon={Quote}
                  >
                    Quote
                  </CommandItem>
                  <CommandItem
                    value="add image"
                    onSelect={() => {
                      onAddSlide("ImageWithCaption");
                      onOpenChange(false);
                    }}
                    icon={ImageIcon}
                  >
                    Image with Caption
                  </CommandItem>
                  <CommandItem
                    value="add thank you"
                    onSelect={() => {
                      onAddSlide("ThankYou");
                      onOpenChange(false);
                    }}
                    icon={Smile}
                  >
                    Thank You
                  </CommandItem>
                </Command.Group>

                {/* Actions */}
                <Command.Group heading="Actions" className="px-2 py-2">
                  <CommandItem
                    value="duplicate slide"
                    onSelect={() => {
                      onDuplicateSlide();
                      onOpenChange(false);
                    }}
                    icon={Copy}
                    shortcut="⌘D"
                  >
                    Duplicate Slide
                  </CommandItem>
                  <CommandItem
                    value="delete slide"
                    onSelect={() => {
                      onDeleteSlide();
                      onOpenChange(false);
                    }}
                    icon={Trash2}
                    shortcut="⌘⌫"
                  >
                    Delete Slide
                  </CommandItem>
                  <CommandItem
                    value="inspector"
                    onSelect={() => {
                      onOpenInspector();
                      onOpenChange(false);
                    }}
                    icon={Eye}
                    shortcut="⌘I"
                  >
                    Inspector
                  </CommandItem>
                </Command.Group>

                {/* View */}
                <Command.Group heading="View" className="px-2 py-2">
                  <CommandItem
                    value="start presentation"
                    onSelect={() => {
                      onStartPresent();
                      onOpenChange(false);
                    }}
                    icon={Play}
                    shortcut="F5"
                  >
                    Start Presentation
                  </CommandItem>
                  <CommandItem
                    value="zoom in"
                    onSelect={() => {
                      onZoomIn();
                      onOpenChange(false);
                    }}
                    icon={ZoomIn}
                    shortcut="⌘+"
                  >
                    Zoom In
                  </CommandItem>
                  <CommandItem
                    value="zoom out"
                    onSelect={() => {
                      onZoomOut();
                      onOpenChange(false);
                    }}
                    icon={ZoomOut}
                    shortcut="⌘-"
                  >
                    Zoom Out
                  </CommandItem>
                  <CommandItem
                    value="keyboard shortcuts"
                    onSelect={() => {
                      onShowShortcuts();
                      onOpenChange(false);
                    }}
                    icon={Keyboard}
                    shortcut="?"
                  >
                    Keyboard Shortcuts
                  </CommandItem>
                </Command.Group>

                {/* Go to Slide */}
                {slides.length > 0 && (
                  <Command.Group heading="Go to Slide" className="px-2 py-2">
                    {slides.map((slide, index) => {
                      const Icon = TEMPLATE_REGISTRY[slide.type as TemplateType]?.icon;
                      return (
                        <CommandItem
                          key={slide.id}
                          value={`go to ${index + 1} ${slide.name}`}
                          onSelect={() => {
                            onGoToSlide(index);
                            onOpenChange(false);
                          }}
                          icon={Icon}
                        >
                          {index + 1}. {slide.name}
                        </CommandItem>
                      );
                    })}
                  </Command.Group>
                )}
              </Command.List>

              {/* Footer */}
              <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground flex items-center justify-between bg-muted/30">
                <span>Navigate with ↑↓, select with Enter</span>
                <span>Press ⌘K to toggle</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Command Item Component
function CommandItem({
  children,
  icon: Icon,
  shortcut,
  onSelect,
  value,
}: {
  children: React.ReactNode;
  icon?: any;
  shortcut?: string;
  onSelect?: () => void;
  value: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <kbd className="px-2 py-0.5 text-xs font-mono bg-muted rounded border">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
