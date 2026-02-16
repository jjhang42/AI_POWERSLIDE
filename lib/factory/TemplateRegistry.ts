/**
 * Template Registry
 * 템플릿 타입을 실제 React 컴포넌트로 매핑하는 중앙 레지스트리
 */

import type { SectionType, TemplateComponent } from "@/components/templates/types";

/**
 * 템플릿 컴포넌트 레지스트리
 * SectionType → React Component 매핑
 *
 * Phase 2에서 실제 템플릿 컴포넌트가 구현되면 여기에 등록
 */
export const TEMPLATE_REGISTRY: Partial<Record<SectionType, TemplateComponent>> = {
  // Phase 2에서 구현 예정:
  // "people-grid": GridTemplate,
  // "feature-grid": GridTemplate,
  // "comparison-table": TableTemplate,
  // "timeline-slide": TimelineTemplate,
};

/**
 * 템플릿 컴포넌트 가져오기
 *
 * @param type - 섹션 템플릿 타입
 * @returns 템플릿 컴포넌트 또는 undefined
 */
export function getTemplateComponent(type: SectionType): TemplateComponent | undefined {
  return TEMPLATE_REGISTRY[type];
}

/**
 * 템플릿 등록 (동적 확장용)
 *
 * @param type - 섹션 템플릿 타입
 * @param component - React 컴포넌트
 */
export function registerTemplate(type: SectionType, component: TemplateComponent): void {
  TEMPLATE_REGISTRY[type] = component;
}

/**
 * 등록된 모든 템플릿 타입 목록
 */
export function getRegisteredTemplates(): SectionType[] {
  return Object.keys(TEMPLATE_REGISTRY) as SectionType[];
}

/**
 * 템플릿이 등록되어 있는지 확인
 */
export function isTemplateRegistered(type: SectionType): boolean {
  return type in TEMPLATE_REGISTRY;
}
