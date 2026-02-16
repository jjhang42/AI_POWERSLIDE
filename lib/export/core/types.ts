/**
 * 내보내기 관련 타입 정의
 */

// 내보내기 포맷
export type ExportFormat = "pdf" | "ppt" | "keynote" | "jpeg" | "png";

// 품질 설정
export type ExportQuality = "low" | "medium" | "high";

// 내보내기 상태
export type ExportStatus = "idle" | "preparing" | "capturing" | "generating" | "completed" | "error" | "cancelled";

// 슬라이드 정보 (useSlides에서 가져옴)
export interface SlideInfo {
  id: string;
  index: number;
  ref: React.RefObject<HTMLDivElement | null>;
  title?: string;
}

// 내보내기 진행 상태
export interface ExportProgress {
  current: number;
  total: number;
  status: ExportStatus;
  message: string;
  percentage: number;
}

// 내보내기 옵션
export interface ExportOptions {
  format: ExportFormat;
  quality: ExportQuality;
  fileName?: string;
  selectedSlides?: string[]; // 특정 슬라이드만 선택
  aspectRatio?: { width: number; height: number };
}

// 캡처된 슬라이드 데이터
export interface CapturedSlide {
  id: string;
  title: string;
  imageData: string; // Base64 PNG
  width: number;
  height: number;
}

// Exporter 인터페이스 (개선됨)
export interface Exporter {
  export(
    slides: CapturedSlide[],
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult>;
}

// html2canvas 옵션
export interface CaptureOptions {
  scale: number;
  useCORS: boolean;
  backgroundColor: string;
  logging?: boolean;
  allowTaint?: boolean;
}

// 에러 타입
export type ExportErrorType =
  | "capture_failed"
  | "generation_failed"
  | "download_failed"
  | "invalid_options"
  | "cancelled"
  | "unknown";

// 내보내기 에러
export interface ExportError {
  type: ExportErrorType;
  message: string;
  details?: string;
  slideId?: string;
  timestamp: number;
}

// 내보내기 결과
export interface ExportResult {
  success: boolean;
  error?: ExportError;
  stats?: {
    totalSlides: number;
    capturedSlides: number;
    failedSlides: number;
    fileSize?: number;
    duration: number;
  };
}

// 내보내기 메타데이터
export interface ExportMetadata {
  format: ExportFormat;
  quality: ExportQuality;
  timestamp: number;
  slideCount: number;
  aspectRatio: { width: number; height: number };
}
