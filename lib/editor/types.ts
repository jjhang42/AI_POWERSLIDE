/**
 * 통합 섹션 시스템 타입 정의
 * 모든 섹션(기본/동적/AI)이 동일한 구조를 사용
 */

import type { RefObject } from "react";

/**
 * 편집 가능한 필드 타입
 */
export type EditableFieldType = "text" | "textarea" | "color" | "image" | "number";

/**
 * 편집 가능한 필드
 */
export interface EditableField {
  type: EditableFieldType;
  label: string;
  value: any;
}

/**
 * 통합 섹션 (모든 섹션이 이 구조를 사용)
 */
export interface Section {
  id: string;
  order: number;
  metadata: {
    title: string;
    description: string;
    category?: string;
    isDefault: boolean; // 기존 14개 기본 섹션 여부
    isDeletable: boolean; // 삭제 가능 여부
    createdAt: number;
    updatedAt: number;
    aiModel?: string; // AI가 생성한 경우
  };
  code: string; // React 컴포넌트 코드
  editableFields: Record<string, EditableField>;
  dependencies?: string[]; // 필요한 라이브러리
}

/**
 * 에디터 상태
 */
export interface EditorState {
  isOpen: boolean;
  activeTab: "add" | "edit" | "manage";
  currentEditingId: string | null;
  sections: Section[];
  dynamicSections: DynamicSectionData[]; // 레거시 지원, 곧 제거 예정
}

// ============================================
// 레거시 타입 (하위 호환성을 위해 유지, 나중에 제거 예정)
// ============================================

/**
 * @deprecated Use Section instead
 */
export type TemplateType =
  | "title-slide"
  | "two-column"
  | "image-text"
  | "bullet-list"
  | "table"
  | "timeline"
  | "image-grid"
  | "quote"
  | "full-image"
  | "blank";

/**
 * @deprecated Use Section.editableFields instead
 */
export type TemplateData = Record<string, any>;

/**
 * @deprecated Use Section instead
 */
export interface DynamicSectionData {
  id: string;
  templateType: TemplateType;
  order: number;
  templateData: TemplateData;
  createdAt: number;
  updatedAt: number;
}
