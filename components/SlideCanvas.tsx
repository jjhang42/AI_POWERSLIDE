"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import { AspectRatio, ASPECT_RATIOS } from "./AspectRatioSelector";
import { AlertTriangle } from "lucide-react";

interface SlideCanvasProps {
  children: ReactNode;
  aspectRatio: AspectRatio;
  isFullscreen?: boolean;
}

interface OverflowInfo {
  element: string;
  overflowRight: number;
  overflowBottom: number;
  overflowLeft: number;
  overflowTop: number;
}

export function SlideCanvas({ children, aspectRatio, isFullscreen = false }: SlideCanvasProps) {
  const dimensions = ASPECT_RATIOS[aspectRatio];
  const ratio = dimensions.width / dimensions.height;
  const slideContentRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState<OverflowInfo[]>([]);

  // Overflow detection function
  const checkOverflow = () => {
    if (!slideContentRef.current) return;

    const container = slideContentRef.current;
    const containerRect = container.getBoundingClientRect();
    const detectedOverflows: OverflowInfo[] = [];

    // Get all child elements recursively
    const getAllElements = (parent: Element): Element[] => {
      const elements: Element[] = [];
      const children = Array.from(parent.children);

      children.forEach(child => {
        elements.push(child);
        elements.push(...getAllElements(child));
      });

      return elements;
    };

    const allElements = getAllElements(container);

    allElements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      // Calculate overflow in all directions
      const overflowRight = Math.max(0, rect.right - containerRect.right);
      const overflowBottom = Math.max(0, rect.bottom - containerRect.bottom);
      const overflowLeft = Math.max(0, containerRect.left - rect.left);
      const overflowTop = Math.max(0, containerRect.top - rect.top);

      // If any overflow exists
      if (overflowRight > 0 || overflowBottom > 0 || overflowLeft > 0 || overflowTop > 0) {
        const elementIdentifier =
          element.id ||
          element.className ||
          element.tagName.toLowerCase();

        detectedOverflows.push({
          element: elementIdentifier,
          overflowRight,
          overflowBottom,
          overflowLeft,
          overflowTop,
        });
      }
    });

    setOverflows(detectedOverflows);

    // Log to console if overflows detected
    if (detectedOverflows.length > 0) {
      console.error("🚨 Slide Overflow Detected!");
      detectedOverflows.forEach((overflow, index) => {
        console.error(`Element ${index + 1}: ${overflow.element}`);
        if (overflow.overflowRight > 0) console.error(`  → Right: +${overflow.overflowRight.toFixed(2)}px`);
        if (overflow.overflowBottom > 0) console.error(`  → Bottom: +${overflow.overflowBottom.toFixed(2)}px`);
        if (overflow.overflowLeft > 0) console.error(`  → Left: +${overflow.overflowLeft.toFixed(2)}px`);
        if (overflow.overflowTop > 0) console.error(`  → Top: +${overflow.overflowTop.toFixed(2)}px`);
      });
    }
  };

  // Monitor content changes and check overflow
  useEffect(() => {
    if (!slideContentRef.current) return;

    // Initial check
    checkOverflow();

    // Create observers
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    const mutationObserver = new MutationObserver(() => {
      checkOverflow();
    });

    // Observe the container
    resizeObserver.observe(slideContentRef.current);
    mutationObserver.observe(slideContentRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [children, aspectRatio, isFullscreen]);

  return (
    <div
      className="w-full h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Slide Container */}
      <div
        className="relative bg-white dark:bg-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-black/5 dark:ring-white/10"
        style={{
          aspectRatio: `${ratio}`,
          width: isFullscreen ? "100vw" : "90vw",
          height: isFullscreen ? "100vh" : "90vh",
          maxWidth: isFullscreen ? "100vw" : `min(90vw, calc(90vh * ${ratio}))`,
          maxHeight: isFullscreen ? "100vh" : `min(90vh, calc(90vw / ${ratio}))`,
        }}
      >
        {/* Actual Slide Content */}
        <div
          ref={slideContentRef}
          className="w-full h-full overflow-hidden"
          data-slide-content="true"
        >
          {children}
        </div>

        {/* Overflow Warning */}
        {overflows.length > 0 && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-destructive text-destructive-foreground text-sm font-semibold rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <div>
              <div>Overflow Detected: {overflows.length} element{overflows.length > 1 ? 's' : ''}</div>
              <div className="text-xs opacity-90 mt-1">
                {overflows.slice(0, 3).map((overflow, idx) => {
                  const total = overflow.overflowRight + overflow.overflowBottom + overflow.overflowLeft + overflow.overflowTop;
                  return (
                    <div key={idx}>
                      {overflow.element}: +{total.toFixed(0)}px
                    </div>
                  );
                })}
                {overflows.length > 3 && <div>...and {overflows.length - 3} more</div>}
              </div>
            </div>
          </div>
        )}

        {/* Aspect Ratio Label */}
        {!isFullscreen && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm font-mono rounded">
            {aspectRatio} ({dimensions.width}×{dimensions.height})
          </div>
        )}
      </div>
    </div>
  );
}
