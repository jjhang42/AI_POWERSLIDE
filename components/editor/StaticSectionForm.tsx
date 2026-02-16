"use client";

/**
 * StaticSectionForm
 * 정적 섹션의 translations 데이터를 자동으로 폼으로 변환
 */

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/providers/PresentationProvider";
import { TextField } from "./fields/TextField";
import { TextAreaField } from "./fields/TextAreaField";
import { ArrayField } from "./fields/ArrayField";
import { useDebouncedCallback } from "use-debounce";
import {
  getSectionOverride,
  saveSectionOverride,
  deleteSectionOverride,
  mergeOverride,
} from "@/lib/editor/staticOverrides";
import { RotateCcw } from "lucide-react";

interface StaticSectionFormProps {
  sectionId: string;
  originalData: any;
}

export function StaticSectionForm({ sectionId, originalData }: StaticSectionFormProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<any>({});

  // 초기 데이터 로드 (오버라이드 + 원본)
  useEffect(() => {
    const override = getSectionOverride(sectionId, language);
    const merged = mergeOverride(originalData, override);
    setFormData(merged);
  }, [sectionId, language, originalData]);

  // debounced save (500ms)
  const debouncedSave = useDebouncedCallback((data: any) => {
    saveSectionOverride(sectionId, language, data);
    // 언어 변경을 트리거하여 리렌더링
    window.dispatchEvent(new Event("storage"));
  }, 500);

  const handleFieldChange = (path: string[], value: any) => {
    const newData = { ...formData };
    setNestedValue(newData, path, value);
    setFormData(newData);
    debouncedSave(newData);
  };

  const handleReset = () => {
    deleteSectionOverride(sectionId, language);
    setFormData(originalData);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div>
      {/* 원본 복원 버튼 */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          원본 복원
        </button>
      </div>

      {/* 재귀적 폼 생성 */}
      {renderFields(formData, [], handleFieldChange)}

      {/* 도움말 */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          💡 변경 사항은 자동으로 저장됩니다 (500ms 지연)
        </p>
      </div>
    </div>
  );
}

/**
 * 중첩된 객체에 값 설정
 */
function setNestedValue(obj: any, path: string[], value: any): void {
  const lastKey = path[path.length - 1];
  let current = obj;

  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) {
      current[path[i]] = {};
    }
    current = current[path[i]];
  }

  current[lastKey] = value;
}

/**
 * 데이터 구조를 재귀적으로 폼 필드로 변환
 */
function renderFields(
  data: any,
  parentPath: string[],
  onChange: (path: string[], value: any) => void
): React.ReactNode {
  if (!data || typeof data !== "object") {
    return null;
  }

  return (
    <div className="space-y-4">
      {Object.keys(data).map((key) => {
        const value = data[key];
        const currentPath = [...parentPath, key];
        const label = formatLabel(key);

        // 문자열
        if (typeof value === "string") {
          // 긴 텍스트는 TextArea
          if (value.length > 100) {
            return (
              <TextAreaField
                key={currentPath.join(".")}
                label={label}
                value={value}
                onChange={(v) => onChange(currentPath, v)}
              />
            );
          }
          // 짧은 텍스트는 TextField
          return (
            <TextField
              key={currentPath.join(".")}
              label={label}
              value={value}
              onChange={(v) => onChange(currentPath, v)}
            />
          );
        }

        // 숫자
        if (typeof value === "number") {
          return (
            <TextField
              key={currentPath.join(".")}
              label={label}
              value={String(value)}
              onChange={(v) => onChange(currentPath, Number(v) || 0)}
            />
          );
        }

        // 문자열 배열
        if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
          return (
            <ArrayField
              key={currentPath.join(".")}
              label={label}
              value={value}
              onChange={(v) => onChange(currentPath, v)}
            />
          );
        }

        // 객체 배열 또는 중첩 객체
        if (Array.isArray(value) || typeof value === "object") {
          return (
            <div key={currentPath.join(".")} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">{label}</h4>
              {Array.isArray(value) ? (
                <div className="space-y-4">
                  {value.map((item, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <p className="text-xs text-gray-500 mb-2">항목 #{index + 1}</p>
                      {renderFields(item, [...currentPath, String(index)], onChange)}
                    </div>
                  ))}
                </div>
              ) : (
                renderFields(value, currentPath, onChange)
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

/**
 * 키 이름을 읽기 쉬운 라벨로 변환
 */
function formatLabel(key: string): string {
  const mapping: Record<string, string> = {
    companyName: "회사 이름",
    mainHeadline: "메인 헤드라인",
    mainSubheadline: "서브 헤드라인",
    description: "설명",
    metrics: "주요 지표",
    scrollText: "스크롤 텍스트",
    title: "제목",
    subtitle: "부제목",
    value: "값",
    label: "라벨",
    icon: "아이콘",
  };

  return mapping[key] || key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
