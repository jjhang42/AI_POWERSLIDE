/**
 * EditorManager
 * 동적 섹션 편집 관리
 */

import type { EditorState, DynamicSectionData, TemplateType, TemplateData } from "@/lib/editor/types";
import * as storage from "@/lib/editor/storage";

export class EditorManager {
  private state: EditorState = {
    isOpen: false,
    activeTab: "add",
    currentEditingId: null,
    sections: [],
    dynamicSections: [], // 레거시 지원
  };

  // 상태 변경 리스너들
  private listeners: Set<() => void> = new Set();

  constructor() {
    // localStorage에서 동적 섹션 로드
    if (typeof window !== "undefined") {
      this.state.dynamicSections = storage.getSections();
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[EditorManager] Initialized");
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
   * 현재 상태 가져오기
   */
  public getState(): EditorState {
    return this.state;
  }

  /**
   * 사이드바 열기/닫기
   */
  public toggleSidebar(): void {
    this.state.isOpen = !this.state.isOpen;
    this.notify();
  }

  /**
   * 사이드바 열기
   */
  public openSidebar(): void {
    this.state.isOpen = true;
    this.notify();
  }

  /**
   * 사이드바 닫기
   */
  public closeSidebar(): void {
    this.state.isOpen = false;
    this.notify();
  }

  /**
   * 활성 탭 변경
   */
  public setActiveTab(tab: "add" | "edit" | "manage"): void {
    this.state.activeTab = tab;
    this.notify();
  }

  /**
   * 동적 섹션 목록 가져오기
   */
  public getDynamicSections(): DynamicSectionData[] {
    return this.state.dynamicSections;
  }

  /**
   * 새 섹션 추가
   */
  public addSection(templateType: TemplateType, templateData: TemplateData): string {
    const timestamp = Date.now();
    const newSection: DynamicSectionData = {
      id: `dynamic-${timestamp}`,
      templateType,
      order: this.state.dynamicSections.length,
      templateData,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // 메모리 상태 업데이트
    this.state.dynamicSections.push(newSection);

    // localStorage에 저장
    try {
      storage.saveSection(newSection);
    } catch (error) {
      console.error("[EditorManager] Failed to save section:", error);
    }

    // 편집 탭으로 전환 및 현재 편집 ID 설정
    this.state.activeTab = "edit";
    this.state.currentEditingId = newSection.id;

    this.notify();

    if (process.env.NODE_ENV === "development") {
      console.log("[EditorManager] Section added:", newSection.id);
    }

    return newSection.id;
  }

  /**
   * 섹션 업데이트
   */
  public updateSection(id: string, updates: Record<string, any>): void {
    const sectionIndex = this.state.dynamicSections.findIndex((s) => s.id === id);
    if (sectionIndex === -1) {
      console.warn("[EditorManager] Section not found:", id);
      return;
    }

    const section = this.state.dynamicSections[sectionIndex];
    const updatedSection: DynamicSectionData = {
      ...section,
      templateData: {
        ...section.templateData,
        ...updates,
      } as TemplateData,
      updatedAt: Date.now(),
    };

    // 메모리 상태 업데이트
    this.state.dynamicSections[sectionIndex] = updatedSection;

    // localStorage에 저장
    try {
      storage.saveSection(updatedSection);
    } catch (error) {
      console.error("[EditorManager] Failed to update section:", error);
    }

    this.notify();
  }

  /**
   * 섹션 삭제
   */
  public deleteSection(id: string): void {
    // 메모리 상태에서 제거
    this.state.dynamicSections = this.state.dynamicSections.filter((s) => s.id !== id);

    // localStorage에서 삭제
    try {
      storage.deleteSection(id);
    } catch (error) {
      console.error("[EditorManager] Failed to delete section:", error);
    }

    // 현재 편집 중이던 섹션이면 초기화
    if (this.state.currentEditingId === id) {
      this.state.currentEditingId = null;
    }

    this.notify();

    if (process.env.NODE_ENV === "development") {
      console.log("[EditorManager] Section deleted:", id);
    }
  }

  /**
   * 섹션 순서 변경
   */
  public reorderSections(newOrder: string[]): void {
    // 새 순서대로 섹션 재정렬
    const reordered = newOrder
      .map((id, index) => {
        const section = this.state.dynamicSections.find((s) => s.id === id);
        if (section) {
          return { ...section, order: index };
        }
        return null;
      })
      .filter((s): s is DynamicSectionData => s !== null);

    // 메모리 상태 업데이트
    this.state.dynamicSections = reordered;

    // localStorage에 저장
    try {
      storage.reorderSections(newOrder);
    } catch (error) {
      console.error("[EditorManager] Failed to reorder sections:", error);
    }

    this.notify();
  }

  /**
   * 현재 편집 중인 섹션 설정
   */
  public setCurrentEditingId(id: string | null): void {
    this.state.currentEditingId = id;
    this.notify();
  }

  /**
   * 정리 (cleanup)
   */
  public destroy(): void {
    this.listeners.clear();

    if (process.env.NODE_ENV === "development") {
      console.log("[EditorManager] Destroyed");
    }
  }
}
