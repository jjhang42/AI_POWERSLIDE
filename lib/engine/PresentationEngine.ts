/**
 * PresentationEngine
 * 프레젠테이션 엔진 - 모든 Manager를 통합 관리
 */

import { NavigationManager } from "./managers/NavigationManager";
import { AspectRatioManager } from "./managers/AspectRatioManager";
import { LanguageManager } from "./managers/LanguageManager";
import { ExportManager } from "./managers/ExportManager";
import { EditorManager } from "./managers/EditorManager";
import type {
  PresentationConfig,
  PresentationState,
  SectionInfo,
  AspectRatioPreset,
  AspectRatioValue,
  ExportOptions,
  ExportResult,
} from "./types";
import type { Language } from "@/lib/content/translations/types";
import type { RefObject } from "react";

/**
 * PresentationEngine 클래스
 *
 * SOLID 원칙을 적용한 프레젠테이션 엔진:
 * - Single Responsibility: 각 Manager는 단일 책임
 * - Open/Closed: 새로운 Manager 추가 가능
 * - Liskov Substitution: Manager 인터페이스 준수
 * - Interface Segregation: 최소 인터페이스 노출
 * - Dependency Inversion: 추상화에 의존
 */
export class PresentationEngine {
  // Manager 인스턴스들
  public readonly navigation: NavigationManager;
  public readonly aspectRatio: AspectRatioManager;
  public readonly language: LanguageManager;
  public readonly export: ExportManager;
  public readonly editor: EditorManager;

  // 전역 리스너들
  private globalListeners: Set<() => void> = new Set();
  private notifyScheduled = false;

  constructor(config: PresentationConfig = {}) {
    // Manager 초기화 (섹션 메타데이터 전달)
    this.navigation = new NavigationManager(
      config.transitionDuration,
      config.sections || []
    );
    this.aspectRatio = new AspectRatioManager(config.defaultAspectRatio);
    this.language = new LanguageManager(config.defaultLanguage);
    this.export = new ExportManager();
    this.editor = new EditorManager();

    // 각 Manager의 변경 사항을 전역 리스너에게 전달 (비동기)
    this.navigation.subscribe(() => this.scheduleNotify());
    this.aspectRatio.subscribe(() => this.scheduleNotify());
    this.language.subscribe(() => this.scheduleNotify());
    this.export.subscribe(() => this.scheduleNotify());
    this.editor.subscribe(() => this.scheduleNotify());

    if (process.env.NODE_ENV === "development") {
      console.log("[PresentationEngine] Initialized");
    }
  }

  /**
   * 전역 상태 변경 리스너 등록
   */
  public subscribe(listener: () => void): () => void {
    this.globalListeners.add(listener);
    return () => this.globalListeners.delete(listener);
  }

  /**
   * 알림을 스케줄링 (중복 방지 및 비동기 처리)
   */
  private scheduleNotify(): void {
    if (this.notifyScheduled) return;

    this.notifyScheduled = true;
    queueMicrotask(() => {
      this.notifyScheduled = false;
      this.notifyGlobal();
    });
  }

  /**
   * 전역 리스너들에게 알림
   */
  private notifyGlobal(): void {
    this.globalListeners.forEach((listener) => listener());
  }

  /**
   * 전체 상태 가져오기
   */
  public getState(): PresentationState {
    return {
      currentIndex: this.navigation.getCurrentIndex(),
      totalSections: this.navigation.getTotalSections(),
      isTransitioning: this.navigation.getIsTransitioning(),
      language: this.language.getCurrent(),
      aspectRatio: this.aspectRatio.getCurrent(),
    };
  }

  // ==================== Navigation API ====================

  /**
   * 섹션 등록
   */
  public registerSection(
    id: string,
    ref: RefObject<HTMLDivElement | null>,
    title?: string
  ): void {
    this.navigation.registerSection(id, ref, title);
  }

  /**
   * 섹션 등록 해제
   */
  public unregisterSection(id: string): void {
    this.navigation.unregisterSection(id);
  }

  /**
   * 특정 섹션으로 이동
   */
  public goToSection(target: string | number): void {
    this.navigation.goTo(target);
  }

  /**
   * 다음 섹션
   */
  public nextSection(): void {
    this.navigation.next();
  }

  /**
   * 이전 섹션
   */
  public prevSection(): void {
    this.navigation.prev();
  }

  /**
   * 현재 섹션 정보
   */
  public getCurrentSection(): SectionInfo | null {
    return this.navigation.getCurrent();
  }

  /**
   * 모든 섹션 목록
   */
  public getSections(): SectionInfo[] {
    return this.navigation.getSections();
  }

  // ==================== AspectRatio API ====================

  /**
   * 화면 비율 프리셋 설정
   */
  public setAspectRatioPreset(preset: AspectRatioPreset): void {
    this.aspectRatio.setPreset(preset);
  }

  /**
   * 커스텀 화면 비율 설정
   */
  public setCustomAspectRatio(ratio: AspectRatioValue): void {
    this.aspectRatio.setCustom(ratio);
  }

  /**
   * 현재 화면 비율
   */
  public getCurrentAspectRatio(): AspectRatioValue {
    return this.aspectRatio.getCurrent();
  }

  // ==================== Language API ====================

  /**
   * 언어 설정 (동기 버전 - UI 즉시 반응)
   */
  public setLanguage(lang: Language): void {
    if (process.env.NODE_ENV === "development") {
      console.log(`[PresentationEngine] setLanguage called with: ${lang}`);
    }
    this.language.setLanguageSync(lang);
  }

  /**
   * 현재 언어
   */
  public getCurrentLanguage(): Language {
    return this.language.getCurrent();
  }

  /**
   * 사용 가능한 언어 목록
   */
  public getAvailableLanguages(): Language[] {
    return this.language.getAvailable();
  }

  /**
   * 번역 데이터 가져오기
   */
  public getTranslations() {
    return this.language.getTranslations();
  }

  // ==================== Export API ====================

  /**
   * 프레젠테이션 내보내기
   */
  public async exportPresentation(options: ExportOptions): Promise<ExportResult> {
    return this.export.export(options);
  }

  /**
   * 내보내기 취소
   */
  public cancelExport(): void {
    this.export.cancel();
  }

  /**
   * 내보내기 진행률
   */
  public getExportProgress() {
    return this.export.getProgress();
  }

  /**
   * 내보내기 중 여부
   */
  public isExporting(): boolean {
    return this.export.getIsExporting();
  }

  // ==================== Lifecycle ====================

  /**
   * 엔진 정리 (cleanup)
   */
  public destroy(): void {
    this.navigation.destroy();
    this.aspectRatio.destroy();
    this.language.destroy();
    this.export.destroy();
    this.editor.destroy();
    this.globalListeners.clear();

    if (process.env.NODE_ENV === "development") {
      console.log("[PresentationEngine] Destroyed");
    }
  }
}

/**
 * 싱글톤 인스턴스 (옵션)
 * 필요한 경우 사용, 일반적으로는 Provider에서 생성
 */
let globalEngine: PresentationEngine | null = null;

export function getGlobalEngine(config?: PresentationConfig): PresentationEngine {
  if (!globalEngine) {
    globalEngine = new PresentationEngine(config);
  }
  return globalEngine;
}

export function resetGlobalEngine(): void {
  if (globalEngine) {
    globalEngine.destroy();
    globalEngine = null;
  }
}
