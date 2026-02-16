"use client";

/**
 * SectionRenderer
 * react-live를 사용한 안전한 동적 렌더링
 */

import React from "react";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import type { Section } from "@/lib/editor/types";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { usePresentation } from "@/app/providers/PresentationProvider";
import { TimelineVisualization } from "@/components/ui/TimelineVisualization";
import { OverflowDetector } from "@/components/dev/OverflowDetector";

interface SectionRendererProps {
  section: Section;
}

// 섹션 ID를 번역 키로 매핑
const sectionIdToTranslationKey: Record<string, string> = {
  "hero": "hero",
  "why-now": "whyNow",
  "why-now-problem": "whyNow",
  "why-now-solution": "whyNow",
  "competition": "competition",
  "company-goal": "companyGoal",
  "products": "products",
  "mvp-demo": "mvpDemo",
  "go-to-market": "goToMarket",
  "market-opportunity": "marketOpportunity",
  "competitive-moat": "competitiveMoat",
  "team": "team",
  "roadmap": "roadmap",
  "pricing": "pricing",
  "investment-ask": "investmentAsk",
  "demo": "demo",
};

export function SectionRenderer({ section }: SectionRendererProps) {
  const engine = usePresentation();

  // 현재 언어의 번역 데이터 가져오기
  const translations = engine.getTranslations();
  const translationKey = sectionIdToTranslationKey[section.id];
  const sectionTranslation = translationKey ? translations[translationKey as keyof typeof translations] : null;

  // 편집 가능한 필드 값 (번역 적용)
  const fieldValues: Record<string, any> = {};
  for (const [key, field] of Object.entries(section.editableFields)) {
    // 번역이 있으면 번역 사용, 없으면 기본값 사용
    if (sectionTranslation && (sectionTranslation as any)[key] !== undefined) {
      fieldValues[key] = (sectionTranslation as any)[key];
    } else {
      fieldValues[key] = field.value;
    }
  }

  // scope 정의 (필드 값들도 포함)
  const scope = {
    React,
    motion,
    AnimatePresence,
    ...LucideIcons,
    TimelineVisualization,
    OverflowDetector,
    ...fieldValues, // 필드 값을 scope에 직접 추가
  };

  // 코드 준비
  let cleanCode = section.code
    .replace(/^export\s+/gm, "")
    .replace(/^import\s+.*$/gm, "")
    .trim();

  // window.FramerMotion을 motion으로 변환
  cleanCode = cleanCode.replace(/window\.FramerMotion/g, "FramerMotion");
  cleanCode = cleanCode.replace(/const\s+{\s*motion\s*}\s*=\s*window\.FramerMotion\s*\|\|\s*{};?/g, "");
  cleanCode = cleanCode.replace(/if\s*\(\s*!motion\s*\)\s*return\s*null;?/g, "");

  // 컴포넌트 이름 추출
  const componentMatch = cleanCode.match(/function\s+(\w+)/);
  const componentName = componentMatch ? componentMatch[1] : "Component";

  // props 객체 생성
  const propsString = Object.keys(fieldValues)
    .map(key => `${key}={${key}}`)
    .join(" ");

  // 실행 가능한 코드 생성 (noInline 모드용)
  const executableCode = `
${cleanCode}

render(<${componentName} ${propsString} />);
`;


  return (
    <div className="w-full h-full relative">
      <LiveProvider
        code={executableCode}
        scope={scope}
        noInline={true}
      >
        <div className="w-full h-full">
          <LivePreview className="w-full h-full" />
        </div>
        <LiveError
          className="fixed bottom-4 right-4 max-w-md p-4 bg-red-100 border-2 border-red-400 rounded-lg text-red-700 text-xs overflow-auto max-h-96 z-[9999] shadow-2xl font-mono"
        />
      </LiveProvider>
    </div>
  );
}
