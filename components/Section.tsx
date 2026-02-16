"use client";

import React, { useRef, useEffect } from "react";
import { useNavigation, useAspectRatio } from "@/app/providers/PresentationProvider";
import type { SectionInfo } from "@/lib/engine/types";

interface SectionProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, children, className = "" }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { registerSection, unregisterSection, currentIndex, sections } =
    useNavigation();
  const { getCurrentRatio } = useAspectRatio();

  // 마운트 시 섹션 ref 업데이트 (섹션 자체는 이미 정적 레지스트리에 등록됨)
  useEffect(() => {
    registerSection(id, sectionRef, title);  // 내부적으로 updateSectionRef 호출

    // 언마운트 시 ref만 제거 (섹션 메타데이터는 유지)
    return () => {
      unregisterSection(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, title]);

  // 현재 섹션의 인덱스 찾기
  const currentSection = sections.find((s: SectionInfo) => s.id === id);

  // 비율 계산
  const ratio = getCurrentRatio();

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`h-screen snap-start snap-always flex items-center justify-center overflow-hidden relative section-bg-pattern ${className}`}
      data-section-id={id}
      data-section-index={currentSection?.index}
    >
      {/* 비율 제한 컨테이너 */}
      <div className="w-full h-full flex items-center justify-center p-0">
        <div
          className="relative w-full max-w-full max-h-full overflow-hidden bg-background shadow-2xl"
          style={{
            aspectRatio: `${ratio.width} / ${ratio.height}`,
          }}
        >
          <div className="w-full h-full overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
