"use client";

import { useEffect } from "react";
import { useNavigation } from "@/lib/contexts/NavigationContext";

/**
 * 스크롤 동기화 훅
 * IntersectionObserver를 사용하여 섹션 가시성을 모니터링하고
 * 현재 보이는 섹션에 따라 currentIndex를 업데이트합니다.
 */
export function useScrollSync() {
  const { sections, setCurrentIndex, isTransitioning } = useNavigation();

  useEffect(() => {
    if (sections.length === 0) return;

    // IntersectionObserver 콜백
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // 트랜지션 중에는 업데이트 스킵 (프로그래매틱 스크롤 간섭 방지)
      if (isTransitioning) {
        return;
      }

      // 가장 많이 보이는 섹션 찾기
      let mostVisibleEntry: IntersectionObserverEntry | undefined;
      let maxRatio = 0;

      entries.forEach((entry) => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      // 50% 이상 보이는 섹션이 있으면 currentIndex 업데이트
      if (mostVisibleEntry && mostVisibleEntry.intersectionRatio >= 0.5) {
        const sectionId = mostVisibleEntry.target.getAttribute("data-section-id");
        if (sectionId) {
          const section = sections.find((s) => s.id === sectionId);
          if (section) {
            setCurrentIndex(section.index);
          }
        }
      }
    };

    // IntersectionObserver 생성
    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // viewport 기준
      rootMargin: "0px",
      threshold: [0, 0.25, 0.5, 0.75, 1.0], // 0%, 25%, 50%, 75%, 100% 가시성
    });

    // 모든 섹션 관찰 시작
    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✓ Scroll sync active");
    }

    // cleanup
    return () => {
      observer.disconnect();
    };
  }, [sections, setCurrentIndex, isTransitioning]);
}
