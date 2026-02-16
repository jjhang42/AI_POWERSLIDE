"use client";

/**
 * DynamicForm
 * 템플릿별 편집 폼 동적 생성
 */

import React, { useCallback } from "react";
import { useEditor } from "@/app/providers/PresentationProvider";
import type { DynamicSectionData, TemplateData } from "@/lib/editor/types";
import { TextField } from "./fields/TextField";
import { TextAreaField } from "./fields/TextAreaField";
import { ColorPickerField } from "./fields/ColorPickerField";
import { SelectField } from "./fields/SelectField";
import { ImageUploadField } from "./fields/ImageUploadField";
import { ArrayField } from "./fields/ArrayField";
import { useDebouncedCallback } from "use-debounce";

interface DynamicFormProps {
  section: DynamicSectionData;
}

export function DynamicForm({ section }: DynamicFormProps) {
  const { updateSection } = useEditor();

  // debounced update (500ms)
  const debouncedUpdate = useDebouncedCallback(
    (updates: Record<string, any>) => {
      updateSection(section.id, updates);
    },
    500
  );

  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      debouncedUpdate({ [fieldName]: value });
    },
    [debouncedUpdate]
  );

  const { templateType, templateData } = section;

  // 템플릿 타입별 폼 렌더링
  switch (templateType) {
    case "title-slide":
      if (templateData.type === "title-slide") {
        return (
          <div>
            <TextField
              label="제목"
              value={templateData.title}
              onChange={(v) => handleFieldChange("title", v)}
              placeholder="슬라이드 제목"
            />
            <TextField
              label="부제목"
              value={templateData.subtitle}
              onChange={(v) => handleFieldChange("subtitle", v)}
              placeholder="부제목"
            />
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <ColorPickerField
              label="제목 색상"
              value={templateData.titleColor}
              onChange={(v) => handleFieldChange("titleColor", v)}
            />
            <ColorPickerField
              label="부제목 색상"
              value={templateData.subtitleColor}
              onChange={(v) => handleFieldChange("subtitleColor", v)}
            />
          </div>
        );
      }
      break;

    case "two-column":
      if (templateData.type === "two-column") {
        return (
          <div>
            <TextField
              label="제목"
              value={templateData.title}
              onChange={(v) => handleFieldChange("title", v)}
              placeholder="슬라이드 제목"
            />
            <TextAreaField
              label="왼쪽 내용"
              value={templateData.leftContent}
              onChange={(v) => handleFieldChange("leftContent", v)}
              placeholder="왼쪽 컨텐츠"
            />
            <TextAreaField
              label="오른쪽 내용"
              value={templateData.rightContent}
              onChange={(v) => handleFieldChange("rightContent", v)}
              placeholder="오른쪽 컨텐츠"
            />
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <ColorPickerField
              label="텍스트 색상"
              value={templateData.textColor}
              onChange={(v) => handleFieldChange("textColor", v)}
            />
          </div>
        );
      }
      break;

    case "image-text":
      if (templateData.type === "image-text") {
        return (
          <div>
            <TextField
              label="제목"
              value={templateData.title}
              onChange={(v) => handleFieldChange("title", v)}
              placeholder="슬라이드 제목"
            />
            <TextAreaField
              label="내용"
              value={templateData.content}
              onChange={(v) => handleFieldChange("content", v)}
              placeholder="텍스트 내용"
            />
            <ImageUploadField
              label="이미지 URL"
              value={templateData.imageUrl}
              onChange={(v) => handleFieldChange("imageUrl", v)}
            />
            <SelectField
              label="이미지 위치"
              value={templateData.imagePosition}
              onChange={(v) => handleFieldChange("imagePosition", v)}
              options={[
                { value: "left", label: "왼쪽" },
                { value: "right", label: "오른쪽" },
              ]}
            />
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <ColorPickerField
              label="텍스트 색상"
              value={templateData.textColor}
              onChange={(v) => handleFieldChange("textColor", v)}
            />
          </div>
        );
      }
      break;

    case "bullet-list":
      if (templateData.type === "bullet-list") {
        return (
          <div>
            <TextField
              label="제목"
              value={templateData.title}
              onChange={(v) => handleFieldChange("title", v)}
              placeholder="슬라이드 제목"
            />
            <ArrayField
              label="항목"
              value={templateData.items}
              onChange={(v) => handleFieldChange("items", v)}
              placeholder="항목 내용"
            />
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <ColorPickerField
              label="텍스트 색상"
              value={templateData.textColor}
              onChange={(v) => handleFieldChange("textColor", v)}
            />
          </div>
        );
      }
      break;

    case "table":
      if (templateData.type === "table") {
        return (
          <div>
            <TextField
              label="제목"
              value={templateData.title}
              onChange={(v) => handleFieldChange("title", v)}
              placeholder="슬라이드 제목"
            />
            <ArrayField
              label="헤더"
              value={templateData.headers}
              onChange={(v) => handleFieldChange("headers", v)}
              placeholder="컬럼 이름"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                테이블 데이터
              </label>
              <p className="text-xs text-gray-500 mb-2">
                현재 {templateData.rows.length}개 행
              </p>
              <div className="text-xs text-gray-500">
                복잡한 테이블 편집은 Phase 6에서 개선 예정
              </div>
            </div>
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <ColorPickerField
              label="텍스트 색상"
              value={templateData.textColor}
              onChange={(v) => handleFieldChange("textColor", v)}
            />
          </div>
        );
      }
      break;

    case "timeline":
      if (templateData.type === "timeline") {
        return (
          <div>
            <TextField
              label="제목"
              value={templateData.title}
              onChange={(v) => handleFieldChange("title", v)}
              placeholder="슬라이드 제목"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이벤트
              </label>
              <p className="text-xs text-gray-500 mb-2">
                현재 {templateData.events.length}개 이벤트
              </p>
              <div className="text-xs text-gray-500">
                복잡한 이벤트 편집은 Phase 6에서 개선 예정
              </div>
            </div>
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <ColorPickerField
              label="텍스트 색상"
              value={templateData.textColor}
              onChange={(v) => handleFieldChange("textColor", v)}
            />
          </div>
        );
      }
      break;

    case "image-grid":
      if (templateData.type === "image-grid") {
        return (
          <div>
            <TextField
              label="제목"
              value={templateData.title}
              onChange={(v) => handleFieldChange("title", v)}
              placeholder="슬라이드 제목"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지
              </label>
              <p className="text-xs text-gray-500 mb-2">
                현재 {templateData.images.length}개 이미지
              </p>
              <div className="text-xs text-gray-500">
                복잡한 이미지 그리드 편집은 Phase 6에서 개선 예정
              </div>
            </div>
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <ColorPickerField
              label="텍스트 색상"
              value={templateData.textColor}
              onChange={(v) => handleFieldChange("textColor", v)}
            />
          </div>
        );
      }
      break;

    case "quote":
      if (templateData.type === "quote") {
        return (
          <div>
            <TextAreaField
              label="인용구"
              value={templateData.quote}
              onChange={(v) => handleFieldChange("quote", v)}
              placeholder="인용구를 입력하세요"
              rows={3}
            />
            <TextField
              label="작성자"
              value={templateData.author}
              onChange={(v) => handleFieldChange("author", v)}
              placeholder="작성자"
            />
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <ColorPickerField
              label="인용구 색상"
              value={templateData.quoteColor}
              onChange={(v) => handleFieldChange("quoteColor", v)}
            />
            <ColorPickerField
              label="작성자 색상"
              value={templateData.authorColor}
              onChange={(v) => handleFieldChange("authorColor", v)}
            />
          </div>
        );
      }
      break;

    case "full-image":
      if (templateData.type === "full-image") {
        return (
          <div>
            <ImageUploadField
              label="이미지 URL"
              value={templateData.imageUrl}
              onChange={(v) => handleFieldChange("imageUrl", v)}
            />
            <TextField
              label="캡션 (선택)"
              value={templateData.caption || ""}
              onChange={(v) => handleFieldChange("caption", v)}
              placeholder="이미지 설명"
            />
            <ColorPickerField
              label="캡션 색상"
              value={templateData.captionColor}
              onChange={(v) => handleFieldChange("captionColor", v)}
            />
          </div>
        );
      }
      break;

    case "blank":
      if (templateData.type === "blank") {
        return (
          <div>
            <ColorPickerField
              label="배경색"
              value={templateData.backgroundColor}
              onChange={(v) => handleFieldChange("backgroundColor", v)}
            />
            <p className="text-sm text-gray-500 mt-4">
              빈 슬라이드입니다. 배경색만 변경할 수 있습니다.
            </p>
          </div>
        );
      }
      break;
  }

  // 폴백
  return (
    <div className="text-gray-500">
      <p>이 템플릿은 편집 폼을 지원하지 않습니다.</p>
    </div>
  );
}
