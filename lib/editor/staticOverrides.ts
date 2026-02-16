/**
 * 정적 섹션 오버라이드 관리
 * translations 데이터를 localStorage에 오버라이드
 */

const STORAGE_KEY = "ixora-static-overrides";

/**
 * 섹션 ID와 언어별 오버라이드 데이터
 */
export interface StaticOverrides {
  [sectionId: string]: {
    [language: string]: any;
  };
}

/**
 * 모든 오버라이드 가져오기
 */
export function getStaticOverrides(): StaticOverrides {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch (error) {
    console.error("[StaticOverrides] Failed to get overrides:", error);
    return {};
  }
}

/**
 * 특정 섹션의 오버라이드 가져오기
 */
export function getSectionOverride(sectionId: string, language: string): any {
  const overrides = getStaticOverrides();
  return overrides[sectionId]?.[language] || {};
}

/**
 * 섹션 오버라이드 저장
 */
export function saveSectionOverride(
  sectionId: string,
  language: string,
  data: any
): void {
  if (typeof window === "undefined") return;

  try {
    const overrides = getStaticOverrides();

    if (!overrides[sectionId]) {
      overrides[sectionId] = {};
    }

    overrides[sectionId][language] = data;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (error) {
    console.error("[StaticOverrides] Failed to save override:", error);
    throw error;
  }
}

/**
 * 섹션 오버라이드 삭제 (원본으로 복원)
 */
export function deleteSectionOverride(sectionId: string, language: string): void {
  if (typeof window === "undefined") return;

  try {
    const overrides = getStaticOverrides();

    if (overrides[sectionId]) {
      delete overrides[sectionId][language];

      // 언어별 오버라이드가 모두 없으면 섹션 자체 삭제
      if (Object.keys(overrides[sectionId]).length === 0) {
        delete overrides[sectionId];
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (error) {
    console.error("[StaticOverrides] Failed to delete override:", error);
    throw error;
  }
}

/**
 * Deep merge: 오버라이드를 원본 데이터에 병합
 */
export function mergeOverride<T>(original: T, override: any): T {
  if (!override || typeof override !== "object") {
    return original;
  }

  if (Array.isArray(original)) {
    return (override as any) || original;
  }

  const result: any = { ...original };

  for (const key in override) {
    if (override[key] !== undefined) {
      if (
        typeof override[key] === "object" &&
        override[key] !== null &&
        !Array.isArray(override[key]) &&
        typeof result[key] === "object" &&
        result[key] !== null &&
        !Array.isArray(result[key])
      ) {
        result[key] = mergeOverride(result[key], override[key]);
      } else {
        result[key] = override[key];
      }
    }
  }

  return result as T;
}
