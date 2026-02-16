"use client";

/**
 * SectionEditForm
 * 통합 섹션 편집 폼 - 모든 섹션의 편집 가능한 필드 표시
 */

import React from "react";
import type { Section } from "@/lib/editor/types";
import { TextField } from "./fields/TextField";
import { TextAreaField } from "./fields/TextAreaField";
import { ColorPickerField } from "./fields/ColorPickerField";
import { ImageUploadField } from "./fields/ImageUploadField";
import { useDebouncedCallback } from "use-debounce";
import { updateSectionField } from "@/lib/editor/sections";
import { Code, Layers } from "lucide-react";

interface SectionEditFormProps {
  section: Section;
}

export function SectionEditForm({ section }: SectionEditFormProps) {
  // debounced update (500ms)
  const debouncedUpdate = useDebouncedCallback(
    async (fieldName: string, value: any) => {
      const success = await updateSectionField(section.id, fieldName, value);
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

  const Icon = section.metadata.aiModel ? Code : Layers;
  const badgeColor = section.metadata.aiModel
    ? "bg-purple-50 border-purple-200 text-purple-600"
    : section.metadata.isDefault
    ? "bg-gray-50 border-gray-200 text-gray-600"
    : "bg-blue-50 border-blue-200 text-blue-600";

  return (
    <div>
      {/* 섹션 정보 */}
      <div className={`mb-6 p-4 rounded-lg border ${badgeColor}`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">
            {section.metadata.aiModel
              ? "AI Generated"
              : section.metadata.isDefault
              ? "Default Section"
              : "Custom Section"}
          </span>
        </div>
        <p className="text-sm font-medium mb-1">
          {section.metadata.title}
        </p>
        <p className="text-xs opacity-80">
          {section.metadata.description}
        </p>
        {section.metadata.aiModel && (
          <p className="text-xs opacity-60 mt-2">
            Created by: {section.metadata.aiModel}
          </p>
        )}
      </div>

      {/* 편집 가능한 필드들 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold mb-3">
          편집 가능한 필드
        </h3>

        {Object.entries(section.editableFields).map(([fieldName, field]) => {
          switch (field.type) {
            case "text":
              return (
                <TextField
                  key={fieldName}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => handleFieldChange(fieldName, v)}
                />
              );

            case "textarea":
              return (
                <TextAreaField
                  key={fieldName}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => handleFieldChange(fieldName, v)}
                />
              );

            case "color":
              return (
                <ColorPickerField
                  key={fieldName}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => handleFieldChange(fieldName, v)}
                />
              );

            case "image":
              return (
                <ImageUploadField
                  key={fieldName}
                  label={field.label}
                  value={field.value}
                  onChange={(v) => handleFieldChange(fieldName, v)}
                />
              );

            case "number":
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
      <div className="mt-6 p-3 bg-muted/50 rounded-lg border">
        <p className="text-xs text-muted-foreground">
          💡 변경 사항은 자동으로 저장되고 페이지가 새로고침됩니다
        </p>
        {section.metadata.isDefault && (
          <p className="text-xs text-muted-foreground mt-1">
            🔒 기본 섹션은 삭제할 수 없지만 내용은 자유롭게 수정 가능합니다
          </p>
        )}
      </div>
    </div>
  );
}
