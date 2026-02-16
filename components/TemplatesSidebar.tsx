"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  FileText,
  Heading1,
  Columns2,
  List,
  Quote,
  Image as ImageIcon,
  Smile,
  Square,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SlideCard } from "@/components/SlideCard";
import { SlideWithProps } from "@/lib/types/slides";
import { TEMPLATES, TemplateType } from "@/components/templates";

export interface Slide {
  id: string;
  type: TemplateType;
  name: string;
}

interface TemplatesSidebarProps {
  slides: SlideWithProps[];
  currentSlideIndex: number;
  onAddSlide: (type: TemplateType) => void;
  onSelectSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  onOpenInspector: () => void;
  onOpenEditor?: (index: number) => void;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

// Sortable Item wrapper
function SortableSlideCard({
  slide,
  index,
  isActive,
  onSelect,
  onDuplicate,
  onDelete,
  onInspector,
  onEditor,
}: {
  slide: SlideWithProps;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onInspector: () => void;
  onEditor?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <SlideCard
        slide={slide}
        index={index}
        isActive={isActive}
        onClick={onSelect}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onInspector={onInspector}
        onEditor={onEditor}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

export function TemplatesSidebar({
  slides,
  currentSlideIndex,
  onAddSlide,
  onSelectSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onReorderSlides,
  onOpenInspector,
  onOpenEditor,
  isOpen: controlledIsOpen,
  onToggle,
}: TemplatesSidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);

      onReorderSlides(oldIndex, newIndex);

      // Update current slide index if needed
      if (oldIndex === currentSlideIndex) {
        onSelectSlide(newIndex);
      } else if (oldIndex < currentSlideIndex && newIndex >= currentSlideIndex) {
        onSelectSlide(currentSlideIndex - 1);
      } else if (oldIndex > currentSlideIndex && newIndex <= currentSlideIndex) {
        onSelectSlide(currentSlideIndex + 1);
      }
    }
  };

  const handleToggle = (open: boolean) => {
    if (onToggle) {
      onToggle(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              type: "tween",
              ease: [0.25, 0.1, 0.25, 1],
              duration: 0.3
            }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl z-30 overflow-y-auto"
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
                onClick={() => handleToggle(false)}
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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={slides.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {slides.map((slide, index) => (
                          <SortableSlideCard
                            key={slide.id}
                            slide={slide}
                            index={index}
                            isActive={index === currentSlideIndex}
                            onSelect={() => onSelectSlide(index)}
                            onDuplicate={() => onDuplicateSlide(index)}
                            onDelete={() => onDeleteSlide(index)}
                            onInspector={onOpenInspector}
                            onEditor={onOpenEditor ? () => onOpenEditor(index) : undefined}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
