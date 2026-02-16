/**
 * localStorage 헬퍼 함수들
 */

import type { DynamicSectionData } from "./types";

const STORAGE_KEY = "ixora-dynamic-sections";

/**
 * 모든 동적 섹션 가져오기
 */
export function getSections(): DynamicSectionData[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const sections = JSON.parse(data) as DynamicSectionData[];
    return sections.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("[Storage] Failed to get sections:", error);
    return [];
  }
}

/**
 * 섹션 저장
 */
export function saveSection(section: DynamicSectionData): void {
  if (typeof window === "undefined") return;

  try {
    const sections = getSections();
    const existingIndex = sections.findIndex((s) => s.id === section.id);

    if (existingIndex >= 0) {
      sections[existingIndex] = section;
    } else {
      sections.push(section);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  } catch (error) {
    console.error("[Storage] Failed to save section:", error);
    throw error;
  }
}

/**
 * 섹션 삭제
 */
export function deleteSection(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const sections = getSections().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  } catch (error) {
    console.error("[Storage] Failed to delete section:", error);
    throw error;
  }
}

/**
 * 섹션 순서 변경
 */
export function reorderSections(newOrder: string[]): void {
  if (typeof window === "undefined") return;

  try {
    const sections = getSections();
    const orderedSections = newOrder
      .map((id, index) => {
        const section = sections.find((s) => s.id === id);
        if (section) {
          return { ...section, order: index };
        }
        return null;
      })
      .filter((s): s is DynamicSectionData => s !== null);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(orderedSections));
  } catch (error) {
    console.error("[Storage] Failed to reorder sections:", error);
    throw error;
  }
}

/**
 * 모든 섹션 삭제 (초기화)
 */
export function clearAllSections(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("[Storage] Failed to clear sections:", error);
    throw error;
  }
}
