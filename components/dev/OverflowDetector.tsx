"use client";

import { useEffect, useRef } from "react";

interface OverflowDetectorProps {
  children: React.ReactNode;
  sectionName: string;
  enabled?: boolean;
}

/**
 * OverflowDetector
 * 개발 모드에서 텍스트/이미지가 슬라이드 밖으로 나가는지 체크
 * 1920x1080 기준으로 검사
 */
export function OverflowDetector({
  children,
  sectionName,
  enabled = process.env.NODE_ENV === "development",
}: OverflowDetectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const checkOverflow = () => {
      const container = containerRef.current;
      if (!container) return;

      // 모든 텍스트/이미지 요소 찾기
      const elements = container.querySelectorAll("h1, h2, h3, p, span, div, img");
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);

        // Overflow 체크
        const overflows = {
          right: rect.right > viewport.width,
          left: rect.left < 0,
          bottom: rect.bottom > viewport.height,
          top: rect.top < 0,
        };

        // 텍스트 overflow 체크
        const hasTextOverflow =
          element.scrollWidth > element.clientWidth ||
          element.scrollHeight > element.clientHeight;

        // 경고 출력
        if (overflows.right || overflows.left || overflows.bottom || overflows.top) {
          const elementInfo = {
            tag: element.tagName,
            text: element.textContent?.substring(0, 50),
            classes: (element as HTMLElement).className,
            position: {
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              top: Math.round(rect.top),
              bottom: Math.round(rect.bottom),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            },
            viewport: {
              width: viewport.width,
              height: viewport.height,
            },
            overflows: {
              right: overflows.right ? `${Math.round(rect.right - viewport.width)}px over` : 'OK',
              left: overflows.left ? `${Math.round(Math.abs(rect.left))}px over` : 'OK',
              bottom: overflows.bottom ? `${Math.round(rect.bottom - viewport.height)}px over` : 'OK',
              top: overflows.top ? `${Math.round(Math.abs(rect.top))}px over` : 'OK',
            },
            fontSize: computedStyle.fontSize,
          };

          console.error(`🚨 [${sectionName}] Overflow detected!`);
          console.table(elementInfo.position);
          console.log('Element:', elementInfo.tag, elementInfo.text);
          console.log('Classes:', elementInfo.classes);
          console.log('Overflows:', elementInfo.overflows);

          // 시각적 표시 (개발 모드)
          (element as HTMLElement).style.outline = "3px solid red";
          (element as HTMLElement).style.outlineOffset = "2px";
        }

        if (hasTextOverflow && computedStyle.overflow !== "hidden") {
          console.warn(
            `⚠️ [${sectionName}] Text overflow (scrollable)`,
            {
              element: element.tagName,
              text: element.textContent?.substring(0, 50) + "...",
              scrollWidth: element.scrollWidth,
              clientWidth: element.clientWidth,
              fontSize: computedStyle.fontSize,
            }
          );

          // 노란색 표시
          (element as HTMLElement).style.outline = "2px dashed orange";
        }
      });
    };

    // 초기 체크
    checkOverflow();

    // 리사이즈 시 재체크
    window.addEventListener("resize", checkOverflow);

    // 컨텐츠 로드 후 재체크
    const timeout = setTimeout(checkOverflow, 1000);

    return () => {
      window.removeEventListener("resize", checkOverflow);
      clearTimeout(timeout);
    };
  }, [enabled, sectionName]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} data-overflow-detector={sectionName}>
      {children}
    </div>
  );
}
