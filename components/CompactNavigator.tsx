"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash2, ArrowUp, ArrowDown, Keyboard, ChevronDown } from "lucide-react";
import { SlideWithProps } from "@/lib/types/slides";
import { TEMPLATE_REGISTRY, TEMPLATES, TemplateType } from "@/components/templates";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CompactNavigatorProps {
  slides: SlideWithProps[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: (type: TemplateType) => void;
  onOpenShortcuts: () => void;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
}

export function CompactNavigator({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onAddSlide,
  onOpenShortcuts,
  onDeleteSlide,
  onDuplicateSlide,
  onMoveSlide,
}: CompactNavigatorProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // SSR과 첫 클라이언트 렌더를 일치시키기 위해 마운트 전에는 빈 슬라이드로 처리
  const displaySlides = mounted ? slides : [];

  return (
    <div className="fixed left-0 top-0 h-screen w-[220px] bg-background/80 backdrop-blur-2xl border-r border-border/50 shadow-2xl z-30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-b from-background/50 to-transparent">
        <div className="flex gap-1">
          {/* Main Button - Quick Add Title Slide */}
          <Button
            onClick={() => onAddSlide('TitleSlide')}
            className="flex-1 justify-start gap-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Slide</span>
          </Button>

          {/* Dropdown for Template Selection */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-2"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {TEMPLATES.map((template) => {
                const Icon = template.icon;
                return (
                  <DropdownMenuItem
                    key={template.type}
                    onClick={() => onAddSlide(template.type)}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Slides List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {displaySlides.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-muted-foreground">
              No slides yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "New Slide" to start
            </p>
          </div>
        ) : (
          displaySlides.map((slide, index) => {
            const isActive = index === currentSlideIndex;
            const canMoveUp = index > 0;
            const canMoveDown = index < slides.length - 1;

            return (
              <ContextMenu key={slide.id}>
                <ContextMenuTrigger asChild>
                  <motion.div
                    onClick={() => onSelectSlide(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectSlide(index)}
                    className={`w-full text-left p-2 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "hover:bg-muted"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Slide Number */}
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs font-medium truncate">
                        {slide.name}
                      </span>
                    </div>

                    {/* Mini Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-background to-muted/20 rounded border border-border/50 overflow-hidden">
                      <div
                        className="origin-top-left pointer-events-none"
                        style={{
                          transform: 'scale(0.1)',
                          transformOrigin: 'top left',
                          width: '1000%',
                          height: '1000%',
                        }}
                      >
                        <div className="w-[1920px] h-[1080px] bg-white dark:bg-gray-900">
                          {(() => {
                            const TemplateComponent = TEMPLATE_REGISTRY[slide.type]?.component;
                            return TemplateComponent ? (
                              <TemplateComponent {...(slide.props as any)} />
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                  <ContextMenuItem
                    onClick={() => onDuplicateSlide(index)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => onMoveSlide(index, index - 1)}
                    disabled={!canMoveUp}
                    className="flex items-center gap-2"
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span>Move Up</span>
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => onMoveSlide(index, index + 1)}
                    disabled={!canMoveDown}
                    className="flex items-center gap-2"
                  >
                    <ArrowDown className="w-4 h-4" />
                    <span>Move Down</span>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => onDeleteSlide(index)}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          onClick={onOpenShortcuts}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Keyboard className="w-4 h-4" />
          <span className="text-sm">Shortcuts</span>
        </Button>
      </div>
    </div>
  );
}
