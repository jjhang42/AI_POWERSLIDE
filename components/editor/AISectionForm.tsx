"use client";

/**
 * AISectionForm
 * AI 생성 섹션의 편집 가능한 필드만 폼으로 표시
 */

import React from "react";
import type { AISectionData } from "@/lib/editor/aiSections";
import { TextField } from "./fields/TextField";
import { TextAreaField } from "./fields/TextAreaField";
import { ColorPickerField } from "./fields/ColorPickerField";
import { ImageUploadField } from "./fields/ImageUploadField";
import { useDebouncedCallback } from "use-debounce";
import { updateAIFieldValue } from "@/lib/editor/aiSections";
import { Code } from "lucide-react";

interface AISectionFormProps {
  section: AISectionData;
}

export function AISectionForm({ section }: AISectionFormProps) {
  // debounced update (500ms)
  const debouncedUpdate = useDebouncedCallback(
    async (fieldName: string, value: any) => {
      const success = await updateAIFieldValue(section.id, fieldName, value);
      if (success) {
        // 페이지 리로드하여 변경사항 반영
        window.location.reload();
      }
    },
    500
  );

  const handleFieldChange = (fieldName: string, value: any) => {
    debouncedUpdate(fieldName, value);
  };

  return (
    <div>
      {/* 섹션 정보 */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-semibold text-purple-600 uppercase">
            AI Generated Section
          </span>
        </div>
        <p className="text-sm text-gray-700 font-medium mb-1">
          {section.metadata.title}
        </p>
        <p className="text-xs text-gray-600">
          {section.metadata.description}
        </p>
        {section.metadata.aiModel && (
          <p className="text-xs text-gray-500 mt-2">
            Created by: {section.metadata.aiModel}
          </p>
        )}
      </div>

      {/* 편집 가능한 필드들 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          편집 가능한 필드
        </h3>

        {Object.entries(section.editableFields).map(([fieldName, field]) => {
          switch (field.type) {
            case 'text':
              return (
                <TextField
                  key={fieldName}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => handleFieldChange(fieldName, v)}
                />
              );

            case 'textarea':
              return (
                <TextAreaField
                  key={fieldName}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => handleFieldChange(fieldName, v)}
                />
              );

            case 'color':
              return (
                <ColorPickerField
                  key={fieldName}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => handleFieldChange(fieldName, v)}
                />
              );

            case 'image':
              return (
                <ImageUploadField
                  key={fieldName}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => handleFieldChange(fieldName, v)}
                />
              );

            case 'number':
              return (
                <TextField
                  key={fieldName}
                  label={field.label}
                  value={String(field.value)}
                  onChange={(v) => handleFieldChange(fieldName, Number(v) || 0)}
                />
              );

            default:
              return null;
          }
        })}
      </div>

      {/* 도움말 */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          💡 변경 사항은 자동으로 저장되고 페이지가 새로고침됩니다
        </p>
        <p className="text-xs text-gray-500 mt-1">
          복잡한 수정이 필요하면 Claude Code를 통해 코드를 직접 수정하세요
        </p>
      </div>
    </div>
  );
}
