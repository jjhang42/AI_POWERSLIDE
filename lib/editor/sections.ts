/**
 * 통합 섹션 관리
 * 모든 섹션을 data/sections.json에서 관리
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Section, EditableField } from "./types";

const SECTIONS_FILE = join(process.cwd(), "data", "sections.json");

/**
 * 모든 섹션 가져오기
 */
export function getSections(): Section[] {
  try {
    const data = readFileSync(SECTIONS_FILE, "utf-8");
    const sections = JSON.parse(data) as Section[];
    return sections.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("[getSections] Error:", error);
    return [];
  }
}

/**
 * 섹션 ID로 가져오기
 */
export function getSectionById(id: string): Section | null {
  const sections = getSections();
  return sections.find((s) => s.id === id) || null;
}

/**
 * 섹션 저장 (추가 또는 업데이트)
 */
export function saveSection(section: Section): boolean {
  try {
    const sections = getSections();
    const index = sections.findIndex((s) => s.id === section.id);

    if (index === -1) {
      // 새 섹션 추가
      sections.push(section);
    } else {
      // 기존 섹션 업데이트
      sections[index] = section;
    }

    writeFileSync(SECTIONS_FILE, JSON.stringify(sections, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("[saveSection] Error:", error);
    return false;
  }
}

/**
 * 섹션 삭제
 */
export function deleteSection(id: string): boolean {
  try {
    const sections = getSections();
    const section = sections.find((s) => s.id === id);

    // 기본 섹션이거나 삭제 불가능한 섹션은 삭제 불가
    if (!section || section.metadata.isDefault || !section.metadata.isDeletable) {
      return false;
    }

    const filtered = sections.filter((s) => s.id !== id);
    writeFileSync(SECTIONS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("[deleteSection] Error:", error);
    return false;
  }
}

/**
 * 섹션 순서 변경
 */
export function reorderSections(newOrder: string[]): boolean {
  try {
    const sections = getSections();
    const reordered = newOrder.map((id, index) => {
      const section = sections.find((s) => s.id === id);
      if (!section) return null;
      return { ...section, order: index };
    }).filter(Boolean) as Section[];

    writeFileSync(SECTIONS_FILE, JSON.stringify(reordered, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("[reorderSections] Error:", error);
    return false;
  }
}

/**
 * 편집 가능한 필드 업데이트
 */
export function updateFieldValue(
  id: string,
  fieldName: string,
  value: any
): boolean {
  try {
    const sections = getSections();
    const index = sections.findIndex((s) => s.id === id);

    if (index === -1) {
      return false;
    }

    if (!sections[index].editableFields[fieldName]) {
      return false;
    }

    // 필드 값 업데이트
    sections[index].editableFields[fieldName].value = value;
    sections[index].metadata.updatedAt = Date.now();

    writeFileSync(SECTIONS_FILE, JSON.stringify(sections, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("[updateFieldValue] Error:", error);
    return false;
  }
}

/**
 * 클라이언트용: 섹션 가져오기 (async)
 */
export async function fetchSections(): Promise<Section[]> {
  try {
    const res = await fetch("/api/sections");
    if (!res.ok) {
      throw new Error("Failed to fetch sections");
    }
    return await res.json();
  } catch (error) {
    console.error("[fetchSections] Error:", error);
    return [];
  }
}

/**
 * 클라이언트용: 필드 값 업데이트 (async)
 */
export async function updateSectionField(
  id: string,
  fieldName: string,
  value: any
): Promise<boolean> {
  try {
    const res = await fetch("/api/sections/update-field", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, fieldName, value }),
    });
    return res.ok;
  } catch (error) {
    console.error("[updateSectionField] Error:", error);
    return false;
  }
}
