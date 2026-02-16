/**
 * Abstract Base Exporter
 * Template Method 패턴 구현
 */

import { SlideRenderer } from "./Renderer";
import type {
  ExportOptions,
  ExportResult,
  ExportProgress,
  ExportStage,
  RenderedSlide,
} from "../types";

export abstract class BaseExporter {
  protected renderer: SlideRenderer;
  protected options: Required<ExportOptions>;

  constructor(options: ExportOptions = {}) {
    this.renderer = new SlideRenderer();
    this.options = {
      fileName: options.fileName || "presentation",
      quality: options.quality ?? 0.95,
      includeBackground: options.includeBackground ?? true,
      onProgress: options.onProgress || (() => {}),
      onComplete: options.onComplete || (() => {}),
      onError: options.onError || (() => {}),
    };
  }

  /**
   * 메인 내보내기 메서드 (Template Method)
   */
  async export(slideElements: HTMLElement[]): Promise<ExportResult> {
    const startTime = Date.now();

    try {
      // 1. 초기화
      this.reportProgress(ExportStage.INITIALIZING, 0, slideElements.length, "Initializing...");
      await this.initialize(slideElements);

      // 2. 슬라이드 렌더링
      this.reportProgress(ExportStage.RENDERING, 0, slideElements.length, "Rendering slides...");
      const renderedSlides = await this.renderSlides(slideElements);

      // 3. 파일 생성
      this.reportProgress(
        ExportStage.PROCESSING,
        slideElements.length,
        slideElements.length,
        "Processing export..."
      );
      const blob = await this.createFile(renderedSlides);

      // 4. 마무리
      this.reportProgress(
        ExportStage.FINALIZING,
        slideElements.length,
        slideElements.length,
        "Finalizing..."
      );
      await this.finalize();

      // 5. 완료
      this.reportProgress(
        ExportStage.COMPLETE,
        slideElements.length,
        slideElements.length,
        "Complete!"
      );
      this.options.onComplete();

      return {
        success: true,
        blob,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      this.options.onError(error instanceof Error ? error : new Error(errorMessage));

      return {
        success: false,
        error: errorMessage,
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * 슬라이드 렌더링 (공통 로직)
   */
  protected async renderSlides(slideElements: HTMLElement[]): Promise<RenderedSlide[]> {
    return this.renderer.renderSlides(
      slideElements,
      {
        backgroundColor: this.options.includeBackground ? "#ffffff" : null,
        quality: this.options.quality,
      },
      (current, total) => {
        this.reportProgress(
          ExportStage.RENDERING,
          current,
          total,
          `Rendering slide ${current} of ${total}...`
        );
      }
    );
  }

  /**
   * 진행상황 리포트
   */
  protected reportProgress(
    stage: ExportStage,
    current: number,
    total: number,
    message: string
  ): void {
    const progress: ExportProgress = {
      stage,
      current,
      total,
      percentage: total > 0 ? Math.round((current / total) * 100) : 0,
      message,
    };
    this.options.onProgress(progress);
  }

  /**
   * 파일 다운로드 헬퍼
   */
  protected downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 추상 메서드 (하위 클래스에서 구현)
  protected abstract initialize(slideElements: HTMLElement[]): Promise<void>;
  protected abstract createFile(slides: RenderedSlide[]): Promise<Blob>;
  protected abstract finalize(): Promise<void>;
}
