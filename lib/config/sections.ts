/**
 * 프레젠테이션 섹션 메타데이터
 * 콘텐츠 레이어 - 컴포넌트를 import하지 않음 (레이어 분리)
 */

import type { SectionType } from "@/components/templates/types";

export interface SectionMetadata {
  id: string;
  title?: string;
  group?: string;
  template?: SectionType; // 템플릿 타입 (범용 템플릿 사용 시)
  useLegacy?: boolean; // true면 레거시 컴포넌트 사용 (롤백용)
}

/**
 * 프레젠테이션 섹션 메타데이터 목록 (순서대로)
 * 컴포넌트는 포함하지 않음 - app/page.tsx에서 매핑
 */
export const SECTION_METADATA: SectionMetadata[] = [
  // PART 1: Problem & Solution
  {
    id: "hero",
    title: "Hero",
    group: "problem-solution",
  },
  {
    id: "why-now",
    title: "Why Now",
    group: "problem-solution",
  },
  {
    id: "competition",
    title: "Competition",
    group: "problem-solution",
  },
  {
    id: "company-goal",
    title: "Company Goal",
    group: "problem-solution",
  },
  {
    id: "products",
    title: "Products",
    group: "problem-solution",
  },
  {
    id: "mvp-demo",
    title: "MVP Demo",
    group: "problem-solution",
  },

  // PART 2: Investment Case
  {
    id: "go-to-market",
    title: "Go To Market",
    group: "investment",
  },
  {
    id: "market-opportunity",
    title: "Market Opportunity",
    group: "investment",
  },
  {
    id: "competitive-moat",
    title: "Competitive Moat",
    group: "investment",
  },
  {
    id: "team",
    title: "Team",
    group: "investment",
  },
  {
    id: "roadmap",
    title: "Roadmap",
    group: "investment",
  },
  {
    id: "pricing",
    title: "Pricing",
    group: "investment",
  },
  {
    id: "investment-ask",
    title: "Investment Ask",
    group: "investment",
  },
  {
    id: "demo",
    title: "Demo",
    group: "investment",
  },
] as const;

/**
 * ID로 섹션 메타데이터 찾기
 */
export function getSectionMetadataById(id: string): SectionMetadata | undefined {
  return SECTION_METADATA.find((section) => section.id === id);
}

/**
 * 인덱스로 섹션 메타데이터 찾기
 */
export function getSectionMetadataByIndex(index: number): SectionMetadata | undefined {
  return SECTION_METADATA[index];
}

/**
 * 섹션 총 개수
 */
export function getSectionCount(): number {
  return SECTION_METADATA.length;
}

/**
 * 그룹별 섹션 메타데이터 목록
 */
export function getSectionMetadataByGroup(group: string): SectionMetadata[] {
  return SECTION_METADATA.filter((section) => section.group === group);
}

/**
 * Deprecated: 하위 호환성을 위해 유지
 */
export const PRESENTATION_SECTIONS = SECTION_METADATA;
export const getSectionById = getSectionMetadataById;
export const getSectionByIndex = getSectionMetadataByIndex;
export const getSectionsByGroup = getSectionMetadataByGroup;
