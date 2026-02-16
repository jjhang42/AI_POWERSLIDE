/**
 * ExportManager
 * 프레젠테이션 내보내기 관리
 */

import type { ExportFormat, ExportOptions, ExportResult } from "../types";

export interface ExportProgress {
  current: number;
  total: number;
  status: "idle" | "preparing" | "capturing" | "processing" | "completed" | "error" | "cancelled";
  message: string;
  percentage: number;
}

export class ExportManager {
  private isExporting: boolean = false;
  private progress: ExportProgress = {
    current: 0,
    total: 0,
    status: "idle",
    message: "",
    percentage: 0,
  };
  private listeners: Set<() => void> = new Set();
  private cancelRequested: boolean = false;

  /**
   * 상태 변경 리스너 등록
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 모든 리스너에게 상태 변경 알림
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * 진행률 업데이트
   */
  private updateProgress(
    current: number,
    total: number,
    status: ExportProgress["status"],
    message: string
  ): void {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    this.progress = { current, total, status, message, percentage };
    this.notify();
  }

  /**
   * 내보내기 실행
   *
   * 주의: 이 메서드는 실제 내보내기 로직을 포함하지 않습니다.
   * 실제 내보내기는 lib/export/ 디렉토리의 기존 시스템을 사용합니다.
   * 이 Manager는 상태 관리와 진행률 추적만 담당합니다.
   */
  public async export(options: ExportOptions): Promise<ExportResult> {
    if (this.isExporting) {
      throw new Error("이미 내보내기가 진행 중입니다.");
    }

    this.isExporting = true;
    this.cancelRequested = false;

    try {
      this.updateProgress(0, 100, "preparing", "내보내기 준비 중...");

      // 실제 내보내기 로직은 기존 export 시스템에 위임
      // 여기서는 상태 관리만 수행
      const result: ExportResult = {
        success: false,
        format: options.format,
        error: "ExportManager는 상태 관리만 담당합니다. 실제 내보내기는 useExport hook을 사용하세요.",
      };

      if (this.cancelRequested) {
        this.updateProgress(0, 0, "cancelled", "내보내기가 취소되었습니다.");
        return {
          success: false,
          format: options.format,
          error: "취소됨",
        };
      }

      this.updateProgress(100, 100, "completed", "내보내기 완료!");
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "내보내기 실패";
      this.updateProgress(0, 0, "error", errorMessage);

      return {
        success: false,
        format: options.format,
        error: errorMessage,
      };
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * 내보내기 취소
   */
  public cancel(): void {
    this.cancelRequested = true;
    this.updateProgress(0, 0, "cancelled", "내보내기가 취소되었습니다.");
    this.isExporting = false;
    this.notify();
  }

  /**
   * 현재 진행률 가져오기
   */
  public getProgress(): ExportProgress {
    return { ...this.progress };
  }

  /**
   * 내보내기 중 여부
   */
  public getIsExporting(): boolean {
    return this.isExporting;
  }

  /**
   * 진행률 초기화
   */
  public resetProgress(): void {
    this.progress = {
      current: 0,
      total: 0,
      status: "idle",
      message: "",
      percentage: 0,
    };
    this.notify();
  }

  /**
   * 정리 (cleanup)
   */
  public destroy(): void {
    this.cancel();
    this.listeners.clear();
  }
}
