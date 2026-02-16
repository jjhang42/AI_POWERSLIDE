"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SimpleSettingsSidebar } from "@/components/SimpleSettingsSidebar";
import { AspectRatio } from "@/components/AspectRatioSelector";
import { TemplatesSidebar, TemplateType } from "@/components/TemplatesSidebar";
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
import { useSlides } from "@/lib/hooks/useSlides";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { FloatingInspector } from "@/components/editor/FloatingInspector";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { CommandPalette } from "@/components/CommandPalette";
import { ZoomControls } from "@/components/ZoomControls";
import { PresentMode } from "@/components/PresentMode";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { SlideTransitions, TransitionType, transitionVariants } from "@/components/SlideTransitions";
import { GridGuides } from "@/components/GridGuides";

// AIHelpers 로드 (window.aiHelpers로 노출됨)
import "@/lib/ai-helpers";

const TEMPLATE_NAMES: Record<TemplateType, string> = {
  TitleSlide: "Title Slide",
  SectionTitle: "Section Title",
  ContentSlide: "Content Slide",
  TwoColumn: "Two Column",
  BulletPoints: "Bullet Points",
  QuoteSlide: "Quote",
  ImageWithCaption: "Image with Caption",
  ThankYou: "Thank You",
};

export default function Home() {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>("fade");
  const [slideDirection, setSlideDirection] = useState(1);

  // useSlides 훅 사용
  const {
    slides,
    addSlide,
    updateSlideProps,
    deleteSlide,
    reorderSlides,
    duplicateSlide,
    lastSaved,
    isSaving,
  } = useSlides();

  // Add new slide
  const handleAddSlide = (type: TemplateType) => {
    const newIndex = addSlide(type, TEMPLATE_NAMES[type]);
    setCurrentSlideIndex(newIndex); // Move to new slide
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    deleteSlide(index);
    // Adjust current slide index
    const newLength = slides.length - 1;
    if (currentSlideIndex >= newLength) {
      setCurrentSlideIndex(Math.max(0, newLength - 1));
    }
  };

  // Select slide
  const handleSelectSlide = (index: number) => {
    setSlideDirection(index > currentSlideIndex ? 1 : -1);
    setCurrentSlideIndex(index);
  };

  // Duplicate slide (updated to use hook)
  const handleDuplicateSlide = (index?: number) => {
    const indexToDuplicate = index !== undefined ? index : currentSlideIndex;
    if (slides.length === 0) return;
    const newIndex = duplicateSlide(indexToDuplicate);
    setCurrentSlideIndex(newIndex);
  };

  // Zoom controls
  const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleZoomIn = () => {
    const currentLevelIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentLevelIndex < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[currentLevelIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentLevelIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentLevelIndex > 0) {
      setZoom(ZOOM_LEVELS[currentLevelIndex - 1]);
    }
  };

  const handleFitToScreen = () => {
    setZoom(1);
  };

  // Present mode
  const handleStartPresent = () => {
    setIsPresentMode(true);
  };

  const handleExitPresent = () => {
    setIsPresentMode(false);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: "i",
        metaKey: true,
        callback: () => setIsInspectorOpen((prev) => !prev),
        description: "Toggle Inspector",
      },
      {
        key: "Backspace",
        metaKey: true,
        callback: () => {
          if (slides.length > 0) {
            handleDeleteSlide(currentSlideIndex);
          }
        },
        description: "Delete Slide",
      },
      {
        key: "d",
        metaKey: true,
        callback: () => handleDuplicateSlide(),
        description: "Duplicate Slide",
      },
      {
        key: "ArrowLeft",
        metaKey: true,
        callback: () => {
          if (currentSlideIndex > 0) {
            setSlideDirection(-1);
            setCurrentSlideIndex(currentSlideIndex - 1);
          }
        },
        description: "Previous Slide",
      },
      {
        key: "ArrowRight",
        metaKey: true,
        callback: () => {
          if (currentSlideIndex < slides.length - 1) {
            setSlideDirection(1);
            setCurrentSlideIndex(currentSlideIndex + 1);
          }
        },
        description: "Next Slide",
      },
      {
        key: "=",
        metaKey: true,
        callback: handleZoomIn,
        description: "Zoom In",
      },
      {
        key: "-",
        metaKey: true,
        callback: handleZoomOut,
        description: "Zoom Out",
      },
      {
        key: "0",
        metaKey: true,
        callback: handleFitToScreen,
        description: "Fit to Screen",
      },
    ],
    slides.length > 0 && !isPresentMode
  );

  // F5 for present mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5" && slides.length > 0) {
        e.preventDefault();
        handleStartPresent();
      }
      if (e.key === "?" && !isPresentMode) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, isPresentMode]);

  // Basic keyboard navigation (without modifiers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (slides.length === 0) return;
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setSlideDirection(1);
            setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
          }
          break;
        case "ArrowLeft":
        case "ArrowUp":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setSlideDirection(-1);
            setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
        case "Home":
          e.preventDefault();
          setSlideDirection(-1);
          setCurrentSlideIndex(0);
          break;
        case "End":
          e.preventDefault();
          setSlideDirection(1);
          setCurrentSlideIndex(slides.length - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, currentSlideIndex]);

  // Render current slide
  const renderSlide = () => {
    if (slides.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
          <div className="text-center space-y-4">
            <h1 className="text-8xl font-black tracking-tighter">iil</h1>
            <p className="text-2xl text-muted-foreground">
              Click Templates to add slides
            </p>
          </div>
        </div>
      );
    }

    const currentSlide = slides[currentSlideIndex];
    const props = currentSlide.props; // 슬라이드별 props 사용

    // onUpdate 핸들러
    const handleUpdate = (newProps: Partial<any>) => {
      updateSlideProps(currentSlideIndex, newProps);
    };

    switch (currentSlide.type) {
      case "TitleSlide":
        return <TitleSlide {...props} onUpdate={handleUpdate} />;
      case "SectionTitle":
        return <SectionTitle {...props} onUpdate={handleUpdate} />;
      case "ContentSlide":
        return <ContentSlide {...props} onUpdate={handleUpdate} />;
      case "TwoColumn":
        return <TwoColumn {...props} onUpdate={handleUpdate} />;
      case "BulletPoints":
        return <BulletPoints {...props} onUpdate={handleUpdate} />;
      case "QuoteSlide":
        return <QuoteSlide {...props} onUpdate={handleUpdate} />;
      case "ImageWithCaption":
        return <ImageWithCaption {...props} onUpdate={handleUpdate} />;
      case "ThankYou":
        return <ThankYou {...props} onUpdate={handleUpdate} />;
      default:
        return null;
    }
  };

  return (
    <main className="relative">
      {/* Auto-save Indicator */}
      {slides.length > 0 && !isFullscreen && (
        <div className="fixed top-6 right-24 z-40">
          <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
        </div>
      )}

      {/* Slide Container with dynamic margin when sidebar is open */}
        <div
          className="transition-all duration-300"
          style={{
            marginLeft: isSidebarOpen && !isFullscreen ? "384px" : "0",
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center",
              transition: "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
            }}
          >
            <SlideCanvas aspectRatio={aspectRatio} isFullscreen={isFullscreen}>
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={currentSlideIndex}
                  custom={slideDirection}
                  {...(transitionType !== "none"
                    ? typeof transitionVariants[transitionType] === "function"
                      ? (transitionVariants[transitionType] as Function)(slideDirection)
                      : transitionVariants[transitionType]
                    : transitionVariants.none)}
                  className="w-full h-full"
                >
                  {renderSlide()}
                </motion.div>
              </AnimatePresence>
            </SlideCanvas>
          </div>
        </div>

        {/* Slide Counter */}
        {slides.length > 0 && !isFullscreen && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/70 text-white text-sm font-mono rounded-lg backdrop-blur-sm">
            {currentSlideIndex + 1} / {slides.length}
          </div>
        )}

        <TemplatesSidebar
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onAddSlide={handleAddSlide}
          onSelectSlide={handleSelectSlide}
          onDeleteSlide={handleDeleteSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onReorderSlides={reorderSlides}
          onOpenInspector={() => setIsInspectorOpen(true)}
          isOpen={isSidebarOpen}
          onToggle={setIsSidebarOpen}
        />

        <SimpleSettingsSidebar
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          isFullscreen={isFullscreen}
          onFullscreenChange={setIsFullscreen}
        />

        {/* Floating Inspector */}
        <FloatingInspector
          slide={slides[currentSlideIndex] || null}
          isOpen={isInspectorOpen && slides.length > 0}
          onClose={() => setIsInspectorOpen(false)}
          onUpdate={(newProps) => {
            updateSlideProps(currentSlideIndex, newProps);
          }}
        />

        {/* Command Palette */}
        <CommandPalette
          open={isCommandPaletteOpen}
          onOpenChange={setIsCommandPaletteOpen}
          onAddSlide={handleAddSlide}
          onDuplicateSlide={() => handleDuplicateSlide()}
          onDeleteSlide={() => handleDeleteSlide(currentSlideIndex)}
          onOpenInspector={() => setIsInspectorOpen(true)}
          onStartPresent={handleStartPresent}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onShowShortcuts={() => setShowShortcuts(true)}
          slides={slides}
          onGoToSlide={setCurrentSlideIndex}
        />

        {/* Zoom Controls */}
        {slides.length > 0 && !isFullscreen && !isPresentMode && (
          <ZoomControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitToScreen={handleFitToScreen}
          />
        )}

        {/* Present Mode */}
        <PresentMode
          isOpen={isPresentMode}
          onClose={handleExitPresent}
          slides={slides}
          initialSlideIndex={currentSlideIndex}
          renderSlide={(slide) => {
            const props = slide.props;
            const handleUpdate = (newProps: Partial<any>) => {
              const index = slides.findIndex((s) => s.id === slide.id);
              if (index !== -1) {
                updateSlideProps(index, newProps);
              }
            };

            switch (slide.type) {
              case "TitleSlide":
                return <TitleSlide {...props} onUpdate={handleUpdate} />;
              case "SectionTitle":
                return <SectionTitle {...props} onUpdate={handleUpdate} />;
              case "ContentSlide":
                return <ContentSlide {...props} onUpdate={handleUpdate} />;
              case "TwoColumn":
                return <TwoColumn {...props} onUpdate={handleUpdate} />;
              case "BulletPoints":
                return <BulletPoints {...props} onUpdate={handleUpdate} />;
              case "QuoteSlide":
                return <QuoteSlide {...props} onUpdate={handleUpdate} />;
              case "ImageWithCaption":
                return <ImageWithCaption {...props} onUpdate={handleUpdate} />;
              case "ThankYou":
                return <ThankYou {...props} onUpdate={handleUpdate} />;
              default:
                return null;
            }
          }}
        />

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp isOpen={showShortcuts} onOpenChange={setShowShortcuts} />

        {/* Slide Transitions */}
        {slides.length > 0 && !isFullscreen && !isPresentMode && (
          <SlideTransitions
            currentTransition={transitionType}
            onTransitionChange={setTransitionType}
          />
        )}

        {/* Grid & Guides */}
        {slides.length > 0 && !isFullscreen && !isPresentMode && (
          <GridGuides aspectRatio={aspectRatio} />
        )}
      </main>
  );
}
