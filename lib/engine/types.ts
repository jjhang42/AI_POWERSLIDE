/**
 * Presentation Engine Types
 * 프레젠테이션 엔진 타입 정의
 */

import type { RefObject } from "react";
import type { Language } from "@/lib/content/translations/types";

// Re-export Language for convenience
export type { Language };

/**
 * 섹션 정보
 */
export interface SectionInfo {
  id: string;
  index: number;
  ref: RefObject<HTMLDivElement | null>;
  title?: string;
}

/**
 * 화면 비율 프리셋
 */
export type AspectRatioPreset = "16:9" | "4:3" | "custom";

/**
 * 화면 비율 값
 */
export interface AspectRatioValue {
  width: number;
  height: number;
}

/**
 * 내보내기 포맷
 */
export type ExportFormat = "ppt" | "pdf" | "png";

/**
 * 내보내기 품질
 */
export type ExportQuality = "low" | "medium" | "high";

/**
 * 내보내기 옵션
 */
export interface ExportOptions {
  format: ExportFormat;
  quality?: ExportQuality;
  aspectRatio?: AspectRatioValue;
  filename?: string;
}

/**
 * 내보내기 결과
 */
export interface ExportResult {
  success: boolean;
  format: ExportFormat;
  blob?: Blob;
  url?: string;
  filename?: string;
  error?: string;
}

/**
 * 프레젠테이션 상태
 */
export interface PresentationState {
  currentIndex: number;
  totalSections: number;
  isTransitioning: boolean;
  language: Language;
  aspectRatio: AspectRatioValue;
}

/**
 * 섹션 메타데이터 (정적 레지스트리용)
 */
export interface SectionMetadata {
  id: string;
  title?: string;
  group?: string;
}

/**
 * 프레젠테이션 설정
 */
export interface PresentationConfig {
  defaultLanguage?: Language;
  defaultAspectRatio?: AspectRatioPreset;
  transitionDuration?: number;
  sections?: SectionMetadata[];  // 정적 섹션 메타데이터
}
