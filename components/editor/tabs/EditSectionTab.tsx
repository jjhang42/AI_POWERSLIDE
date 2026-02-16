"use client";

/**
 * EditSectionTab
 * 섹션 편집 탭
 */

import React, { useEffect, useState } from "react";
import { useEditor } from "@/app/providers/PresentationProvider";
import { useNavigation, useLanguage, usePresentation } from "@/app/providers/PresentationProvider";
import { DynamicForm } from "../DynamicForm";
import { StaticSectionForm } from "../StaticSectionForm";
import { AISectionForm } from "../AISectionForm";
import { AlertCircle } from "lucide-react";
import type { DynamicSectionData } from "@/lib/editor/types";
import type { AISectionData } from "@/lib/editor/aiSections";
import { fetchAISections } from "@/lib/editor/aiSections";

// Wrapper to get translations data
function StaticSectionFormWrapper({ sectionId, language }: { sectionId: string; language: string }) {
  const engine = usePresentation();
  const translations = engine.getTranslations();

  // Map section ID to translation key
  const keyMapping: Record<string, string> = {
    "hero": "hero",
    "why-now": "whyNow",
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

  const key = keyMapping[sectionId];
  const originalData = key ? (translations as any)[key] : {};

  return (
    <StaticSectionForm
      sectionId={sectionId}
      originalData={originalData}
    />
  );
}

export function EditSectionTab() {
  const { dynamicSections, currentEditingId, setCurrentEditingId } = useEditor();
  const { currentIndex, sections } = useNavigation();
  const { language } = useLanguage();
  const [aiSections, setAiSections] = useState<AISectionData[]>([]);

  // AI 섹션 로드
  useEffect(() => {
    fetchAISections().then(setAiSections);
  }, []);

  // 현재 보고 있는 섹션을 자동 선택
  useEffect(() => {
    if (sections.length > 0 && currentIndex < sections.length) {
      const currentSection = sections[currentIndex];
      if (currentEditingId !== currentSection.id) {
        setCurrentEditingId(currentSection.id);
      }
    }
  }, [currentIndex, sections, currentEditingId, setCurrentEditingId]);

  // 현재 섹션 찾기 (정적 또는 동적)
  const currentSection = sections.find((s) => s.id === (currentEditingId || sections[currentIndex]?.id));

  if (!currentSection) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium mb-2">
          섹션을 찾을 수 없습니다
        </p>
      </div>
    );
  }

  // 섹션 타입 확인
  const isDynamic = currentSection.id.startsWith("dynamic-");
  const isAI = currentSection.id.startsWith("ai-section-");

  const dynamicSection = isDynamic
    ? dynamicSections.find((s: DynamicSectionData) => s.id === currentSection.id)
    : null;

  const aiSection = isAI
    ? aiSections.find((s: AISectionData) => s.id === currentSection.id)
    : null;

  return (
    <div>
      {/* 섹션 선택 */}
      {sections.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            편집할 섹션
          </label>
          <select
            value={currentSection.id}
            onChange={(e) => setCurrentEditingId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            {sections.map((section, index) => {
              const isD = section.id.startsWith("dynamic-");
              return (
                <option key={section.id} value={section.id}>
                  {isD ? `동적 섹션 #${index + 1}` : (section.title || section.id)}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* 섹션 정보 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase">
            {isAI ? "AI 생성 섹션" : isDynamic ? "동적 섹션" : "정적 섹션"}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          ID: {currentSection.id}
        </p>
        {dynamicSection && (
          <>
            <p className="text-sm text-gray-600">
              생성: {new Date(dynamicSection.createdAt).toLocaleString("ko-KR")}
            </p>
            {dynamicSection.updatedAt !== dynamicSection.createdAt && (
              <p className="text-sm text-gray-600">
                수정: {new Date(dynamicSection.updatedAt).toLocaleString("ko-KR")}
              </p>
            )}
          </>
        )}
      </div>

      {/* 편집 폼 */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          섹션 편집
        </h3>
        {isAI && aiSection ? (
          <AISectionForm section={aiSection} />
        ) : isDynamic && dynamicSection ? (
          <DynamicForm section={dynamicSection} />
        ) : (
          <StaticSectionFormWrapper
            sectionId={currentSection.id}
            language={language}
          />
        )}
      </div>
    </div>
  );
}
