"use client";

import { useKeyboardNavigation } from "@/lib/hooks/useKeyboardNavigation";
import { useScrollSync } from "@/lib/hooks/useScrollSync";
import type { ReactNode } from "react";

interface PresentationClientProps {
  children: ReactNode;
}

/**
 * 프레젠테이션 클라이언트 로직
 *
 * 키보드 네비게이션과 스크롤 동기화를 담당하는 클라이언트 컴포넌트
 * page.tsx를 서버 컴포넌트로 유지하면서 필요한 클라이언트 기능만 분리
 */
export function PresentationClient({ children }: PresentationClientProps) {
  // 클라이언트 측 hooks
  useKeyboardNavigation();
  useScrollSync();

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {children}
    </main>
  );
}
