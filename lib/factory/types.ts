/**
 * Presentation Factory Types
 * 프레젠테이션 팩토리 패턴을 위한 타입 정의
 */

import type { AspectRatioValue, Language } from "@/lib/engine/types";
import type { TranslationsSchema } from "@/lib/content/translations/types";

/**
 * 섹션 타입
 */
export type SectionType =
  | "title-slide"
  | "content-slide"
  | "comparison-table"
  | "metrics-slide"
  | "people-grid"
  | "timeline-slide"
  | "chart-slide"
  | "feature-grid"
  | "video-slide"
  | "pricing-table"
  | "case-study-grid";

/**
 * 템플릿 섹션 정의
 */
export interface TemplateSectionConfig {
  id: string;
  type: SectionType;
  required?: boolean;
}

/**
 * 프레젠테이션 템플릿
 */
export interface PresentationTemplate {
  name: string;
  description: string;
  aspectRatio: AspectRatioValue;
  languages: Language[];
  sections: TemplateSectionConfig[];
}

/**
 * 콘텐츠 패키지 (템플릿에 주입할 실제 콘텐츠)
 */
export interface ContentPackage {
  company?: string;
  tagline?: string;
  translations: Record<Language, Partial<TranslationsSchema>>;
}

/**
 * 프레젠테이션 설정
 */
export interface PresentationConfig {
  template: PresentationTemplate;
  content: ContentPackage;
  defaultLanguage?: Language;
}

/**
 * 생성된 프레젠테이션
 */
export interface Presentation {
  id: string;
  name: string;
  template: PresentationTemplate;
  content: ContentPackage;
  created: number;
  updated: number;
}
