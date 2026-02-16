"use client";

import { useEffect } from "react";
import { useNavigation } from "@/lib/contexts/NavigationContext";

/**
 * 키보드 네비게이션 훅
 * - Space/Shift+Space: 다음/이전 섹션
 * - Arrow Up/Down: 이전/다음 섹션
 * - PageUp/PageDown: 이전/다음 섹션
 * - Home/End: 첫/마지막 섹션
 */
export function useKeyboardNavigation() {
  const { next, prev, goToSection, sections, isTransitioning } = useNavigation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Input/Textarea 포커스 시 동작 방지
      if (isInputFocused()) {
        return;
      }

      // 트랜지션 중에는 입력 무시
      if (isTransitioning) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (e.shiftKey) {
            prev();
          } else {
            next();
          }
          break;

        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          next();
          break;

        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prev();
          break;

        case "Home":
          e.preventDefault();
          goToSection(0);
          break;

        case "End":
          e.preventDefault();
          if (sections.length > 0) {
            goToSection(sections.length - 1);
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (process.env.NODE_ENV === "development") {
      console.log("✓ Keyboard navigation active");
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, prev, goToSection, sections, isTransitioning]);
}

/**
 * Input/Textarea 등 편집 가능한 요소에 포커스되어 있는지 확인
 */
function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  return (
    activeElement?.tagName === "INPUT" ||
    activeElement?.tagName === "TEXTAREA" ||
    activeElement?.getAttribute("contenteditable") === "true"
  );
}
