/**
 * Export Types
 * 구글 스타일 타입 정의
 */

export type ExportFormat = "jpg" | "pdf" | "pptx";

export interface ExportOptions {
  /** 파일 이름 (확장자 제외) */
  fileName?: string;
  /** 품질 (0.0 - 1.0) */
  quality?: number;
  /** 배경색 포함 여부 */
  includeBackground?: boolean;
  /** 진행상황 콜백 */
  onProgress?: (progress: ExportProgress) => void;
  /** 완료 콜백 */
  onComplete?: () => void;
  /** 에러 콜백 */
  onError?: (error: Error) => void;
}

export interface ExportProgress {
  /** 현재 단계 */
  stage: ExportStage;
  /** 전체 중 현재 (1-based) */
  current: number;
  /** 전체 개수 */
  total: number;
  /** 진행률 (0-100) */
  percentage: number;
  /** 현재 작업 메시지 */
  message: string;
}

export enum ExportStage {
  INITIALIZING = "initializing",
  RENDERING = "rendering",
  PROCESSING = "processing",
  FINALIZING = "finalizing",
  COMPLETE = "complete",
}

export interface RenderedSlide {
  /** 슬라이드 인덱스 (0-based) */
  index: number;
  /** 캡처된 이미지 (base64 data URL) */
  imageData: string;
  /** 원본 너비 */
  width: number;
  /** 원본 높이 */
  height: number;
}

export interface ExportResult {
  /** 성공 여부 */
  success: boolean;
  /** 생성된 파일 (Blob) */
  blob?: Blob;
  /** 에러 메시지 */
  error?: string;
  /** 소요 시간 (ms) */
  duration: number;
}
