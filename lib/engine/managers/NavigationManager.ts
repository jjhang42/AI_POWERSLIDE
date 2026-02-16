/**
 * NavigationManager
 * 섹션 네비게이션 관리
 */

import type { RefObject } from "react";
import type { SectionInfo, SectionMetadata } from "../types";

export class NavigationManager {
  private sections: Map<string, SectionInfo> = new Map();
  private sectionOrder: string[] = [];  // 정적 순서
  private currentIndex: number = 0;
  private isTransitioning: boolean = false;
  private transitionTimeout: NodeJS.Timeout | null = null;
  private transitionDuration: number;

  // 상태 변경 리스너들
  private listeners: Set<() => void> = new Set();

  constructor(
    transitionDuration: number = 800,
    initialSections: SectionMetadata[] = []
  ) {
    this.transitionDuration = transitionDuration;

    // 정적 섹션 메타데이터로 초기화
    initialSections.forEach((section, index) => {
      this.sectionOrder.push(section.id);
      // ref는 나중에 업데이트됨 (null로 초기화)
      this.sections.set(section.id, {
        id: section.id,
        index,
        ref: { current: null },
        title: section.title,
      });
    });

    if (process.env.NODE_ENV === "development" && initialSections.length > 0) {
      console.log(`[NavigationManager] Initialized with ${initialSections.length} sections`);
    }
  }

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
   * 섹션 ref 업데이트 (정적 레지스트리 패턴)
   */
  public updateSectionRef(
    id: string,
    ref: RefObject<HTMLDivElement | null>
  ): void {
    const section = this.sections.get(id);

    if (!section) {
      console.warn(`[NavigationManager] Section "${id}" not found in registry. Add it to SECTION_METADATA first.`);
      return;
    }

    // ref만 업데이트
    section.ref = ref;
  }

  /**
   * 섹션 등록 (하위 호환성 유지)
   * @deprecated Use updateSectionRef instead
   */
  public registerSection(
    id: string,
    ref: RefObject<HTMLDivElement | null>,
    title?: string
  ): void {
    this.updateSectionRef(id, ref);
  }

  /**
   * 섹션 ref 제거 (언마운트 시)
   */
  public unregisterSection(id: string): void {
    const section = this.sections.get(id);
    if (section) {
      // 섹션 자체는 삭제하지 않고 ref만 null로 설정
      section.ref = { current: null };
    }
  }

  /**
   * 특정 섹션으로 이동
   */
  public goTo(target: string | number): void {
    if (this.isTransitioning) return;

    let targetSection: SectionInfo | undefined;

    if (typeof target === "number") {
      // 인덱스로 찾기
      const sectionId = this.sectionOrder[target];
      if (sectionId) {
        targetSection = this.sections.get(sectionId);
      }
    } else {
      // ID로 찾기
      targetSection = this.sections.get(target);
    }

    if (!targetSection || !targetSection.ref.current) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[NavigationManager] Section not found: ${target}`);
      }
      return;
    }

    this.isTransitioning = true;
    this.currentIndex = targetSection.index;

    // 스크롤 애니메이션
    targetSection.ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // 트랜지션 완료 후 플래그 해제
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }

    this.transitionTimeout = setTimeout(() => {
      this.isTransitioning = false;
      this.notify();
    }, this.transitionDuration);

    this.notify();
  }

  /**
   * 다음 섹션으로 이동
   */
  public next(): void {
    if (this.currentIndex < this.sectionOrder.length - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }

  /**
   * 이전 섹션으로 이동
   */
  public prev(): void {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }

  /**
   * 현재 인덱스 설정 (외부에서 강제 설정)
   */
  public setCurrentIndex(index: number): void {
    if (index >= 0 && index < this.sectionOrder.length) {
      this.currentIndex = index;
      this.notify();
    }
  }

  /**
   * 현재 섹션 정보 가져오기
   */
  public getCurrent(): SectionInfo | null {
    const sectionId = this.sectionOrder[this.currentIndex];
    return sectionId ? this.sections.get(sectionId) || null : null;
  }

  /**
   * 모든 섹션 목록 가져오기 (정적 순서대로)
   */
  public getSections(): SectionInfo[] {
    return this.sectionOrder
      .map((id) => this.sections.get(id))
      .filter((section): section is SectionInfo => section !== undefined);
  }

  /**
   * 현재 인덱스 가져오기
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * 트랜지션 상태 가져오기
   */
  public getIsTransitioning(): boolean {
    return this.isTransitioning;
  }

  /**
   * 총 섹션 개수
   */
  public getTotalSections(): number {
    return this.sectionOrder.length;
  }

  /**
   * 정리 (cleanup)
   */
  public destroy(): void {
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
    this.sections.clear();
    this.sectionOrder = [];
    this.listeners.clear();
  }
}
