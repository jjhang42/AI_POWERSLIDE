"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SimpleSettingsSidebar } from "@/components/SimpleSettingsSidebar";
import { AspectRatio } from "@/components/AspectRatioSelector";
import {
  TEMPLATE_REGISTRY,
  TemplateType,
} from "@/components/templates";
import { useSlides } from "@/lib/hooks/useSlides";
import { FloatingInspector } from "@/components/editor/FloatingInspector";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { CommandPalette } from "@/components/CommandPalette";
import { PresentMode } from "@/components/PresentMode";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { SlideTransitions, TransitionType, transitionVariants } from "@/components/SlideTransitions";
import { GridGuides } from "@/components/GridGuides";
import { UndoRedoToast } from "@/components/UndoRedoToast";
import { KeyboardIndicator } from "@/components/KeyboardIndicator";
import { HistoryPanel } from "@/components/HistoryPanel";
import { EditProvider } from "@/lib/contexts/EditContext";
import { UnifiedToolbar } from "@/components/UnifiedToolbar";
import { CompactNavigator } from "@/components/CompactNavigator";
import { TemplatesSidebar } from "@/components/TemplatesSidebar";

// AIHelpers 로드 (window.aiHelpers로 노출됨)
import "@/lib/ai-helpers";

export default function Home() {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>("fade");
  const [slideDirection, setSlideDirection] = useState(1);
  const [isPositioningEnabled, setIsPositioningEnabled] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showTransitionsModal, setShowTransitionsModal] = useState(false);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastAction, setToastAction] = useState<"undo" | "redo">("undo");
  const [toastDescription, setToastDescription] = useState("");

  // Keyboard indicator state
  const [showKeyboardIndicator, setShowKeyboardIndicator] = useState(false);
  const [keyboardKeys, setKeyboardKeys] = useState<string[]>([]);

  // History panel state
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

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
    lastActionDescription,
    undo,
    redo,
    goToHistoryIndex,
    canUndo,
    canRedo,
    historyStates,
    currentHistoryIndex,
  } = useSlides();

  // Adjust currentSlideIndex when slides length changes
  useEffect(() => {
    if (slides.length === 0) {
      setCurrentSlideIndex(0);
    } else if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(slides.length - 1);
    }
  }, [slides.length, currentSlideIndex]);

  // Add new slide
  const handleAddSlide = (type: TemplateType) => {
    const newIndex = addSlide(type, TEMPLATE_REGISTRY[type].name);
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

  const canZoomIn = zoom < ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
  const canZoomOut = zoom > ZOOM_LEVELS[0];

  // Present mode
  const handleStartPresent = () => {
    setIsPresentMode(true);
  };

  const handleExitPresent = () => {
    setIsPresentMode(false);
  };

  // Undo/Redo handlers with toast
  const handleUndo = () => {
    if (canUndo) {
      // Show keyboard indicator
      setKeyboardKeys(["⌘", "Z"]);
      setShowKeyboardIndicator(true);
      setTimeout(() => setShowKeyboardIndicator(false), 600);

      undo();
      setToastAction("undo");
      setToastDescription(lastActionDescription || "Action undone");
      setShowToast(true);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      // Show keyboard indicator
      setKeyboardKeys(["⌘", "⇧", "Z"]);
      setShowKeyboardIndicator(true);
      setTimeout(() => setShowKeyboardIndicator(false), 600);

      redo();
      setToastAction("redo");
      setToastDescription(lastActionDescription || "Action redone");
      setShowToast(true);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: "z",
        metaKey: true,
        callback: handleUndo,
        description: "Undo",
      },
      {
        key: "z",
        metaKey: true,
        shiftKey: true,
        callback: handleRedo,
        description: "Redo",
      },
      {
        key: "h",
        metaKey: true,
        callback: () => setShowHistoryPanel((prev) => !prev),
        description: "History",
      },
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

      // Don't handle arrow keys if positioning mode is enabled
      if (isPositioningEnabled && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
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
  }, [slides.length, currentSlideIndex, isPositioningEnabled]);

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

    // Use safe index to prevent accessing undefined slide
    const safeIndex = Math.min(currentSlideIndex, slides.length - 1);
    const currentSlide = slides[safeIndex];

    // Extra safety check
    if (!currentSlide) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p>Loading slide...</p>
        </div>
      );
    }

    const props = currentSlide.props; // 슬라이드별 props 사용

    // onUpdate 핸들러
    const handleUpdate = (newProps: Partial<any>) => {
      updateSlideProps(currentSlideIndex, newProps);
    };

    const TemplateComponent = TEMPLATE_REGISTRY[currentSlide.type]?.component;

    if (!TemplateComponent) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p>Template not found: {currentSlide.type}</p>
        </div>
      );
    }

    return (
      <TemplateComponent
        {...props}
        onUpdate={handleUpdate}
        isPositioningEnabled={isPositioningEnabled}
        selectedElementId={selectedElementId}
        onSelectElement={setSelectedElementId}
      />
    );
  };

  // Reset position handler
  const handleResetPosition = () => {
    if (selectedElementId && slides.length > 0) {
      const currentSlide = slides[currentSlideIndex];
      const updatedPositions = { ...currentSlide.props.positions };
      delete updatedPositions[selectedElementId];
      updateSlideProps(currentSlideIndex, { positions: updatedPositions });
      setSelectedElementId(null);
    }
  };

  return (
    <EditProvider>
      <>
        <main className="relative min-h-screen">
          {/* Finder-style Layout */}
          {!isFullscreen && !isPresentMode && (
            <>
              {/* Compact Navigator - Fixed Left Sidebar */}
              <CompactNavigator
                slides={slides}
                currentSlideIndex={currentSlideIndex}
                onSelectSlide={handleSelectSlide}
                onOpenTemplates={() => setIsTemplatesOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenShortcuts={() => setShowShortcuts(true)}
                onDeleteSlide={handleDeleteSlide}
                onDuplicateSlide={handleDuplicateSlide}
                onMoveSlide={(fromIndex, toIndex) => {
                  reorderSlides(fromIndex, toIndex);
                  setCurrentSlideIndex(toIndex);
                }}
              />

              {/* Unified Toolbar - Full Width */}
              <UnifiedToolbar
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onOpenHistory={() => setShowHistoryPanel(true)}
                currentSlideIndex={currentSlideIndex}
                totalSlides={slides.length}
                isPositioningEnabled={isPositioningEnabled}
                onTogglePositioning={() => {
                  setIsPositioningEnabled(!isPositioningEnabled);
                  setSelectedElementId(null);
                }}
                showGrid={showGrid}
                onToggleGrid={() => setShowGrid(!showGrid)}
                onOpenTransitions={() => setShowTransitionsModal(true)}
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                canZoomIn={canZoomIn}
                canZoomOut={canZoomOut}
                aspectRatio={aspectRatio}
                onAspectRatioChange={setAspectRatio}
                lastSaved={lastSaved}
                isSaving={isSaving}
              />
            </>
          )}

          {/* Main Content Area - Fixed margin for sidebar and toolbar */}
          <div
            className="transition-all duration-300 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
            style={{
              marginLeft: !isFullscreen && !isPresentMode ? "220px" : "0",
              marginTop: !isFullscreen && !isPresentMode ? "0" : "0",
              minHeight: "100vh",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                minHeight: "100vh",
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
          </div>

          {/* Settings Sidebar (Modal) */}
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

          {/* Editor Panel */}
          {editingSlideIndex !== null && (
            <EditorPanel
              slide={slides[editingSlideIndex] || null}
              onClose={() => setEditingSlideIndex(null)}
              onUpdate={(newProps) => {
                if (editingSlideIndex !== null) {
                  updateSlideProps(editingSlideIndex, newProps);
                }
              }}
            />
          )}

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

              const TemplateComponent = TEMPLATE_REGISTRY[slide.type]?.component;
              if (!TemplateComponent) return null;

              return <TemplateComponent {...props} onUpdate={handleUpdate} />;
            }}
          />

          {/* Keyboard Shortcuts Help */}
          <KeyboardShortcutsHelp isOpen={showShortcuts} onOpenChange={setShowShortcuts} />

          {/* Slide Transitions Modal (no floating button) */}
          {slides.length > 0 && !isFullscreen && !isPresentMode && (
            <SlideTransitions
              currentTransition={transitionType}
              onTransitionChange={setTransitionType}
              isOpen={showTransitionsModal}
              onOpenChange={setShowTransitionsModal}
            />
          )}

          {/* Grid & Guides Overlay (no floating button) */}
          {slides.length > 0 && !isFullscreen && !isPresentMode && showGrid && (
            <GridGuides aspectRatio={aspectRatio} />
          )}
        </main>

        {/* Undo/Redo Toast */}
        <UndoRedoToast
          open={showToast}
          onClose={() => setShowToast(false)}
          action={toastAction}
          description={toastDescription}
          onActionClick={toastAction === "undo" ? handleRedo : handleUndo}
        />

        {/* Keyboard Indicator */}
        <KeyboardIndicator keys={keyboardKeys} show={showKeyboardIndicator} />

        {/* History Panel */}
        <HistoryPanel
          open={showHistoryPanel}
          onClose={() => setShowHistoryPanel(false)}
          historyStates={historyStates || []}
          currentIndex={currentHistoryIndex || 0}
          onGoToIndex={(index) => {
            goToHistoryIndex(index);
            setShowHistoryPanel(false);
          }}
          lastActionDescription={lastActionDescription}
        />

        {/* Templates Sidebar */}
        <TemplatesSidebar
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onAddSlide={handleAddSlide}
          onSelectSlide={handleSelectSlide}
          onDeleteSlide={handleDeleteSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onReorderSlides={(fromIndex, toIndex) => {
            reorderSlides(fromIndex, toIndex);
            setCurrentSlideIndex(toIndex);
          }}
          onOpenInspector={() => setIsInspectorOpen(true)}
          onOpenEditor={setEditingSlideIndex}
          isOpen={isTemplatesOpen}
          onToggle={setIsTemplatesOpen}
        />
      </>
    </EditProvider>
  );
}
