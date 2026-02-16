/**
 * Translations Module
 * 다국어 번역 데이터 통합 관리
 *
 * 이 모듈은 translations.ts를 섹션별로 분할한 새로운 구조입니다.
 * 각 언어별로 디렉토리가 분리되어 있으며, 섹션별로 파일이 나누어져 있습니다.
 *
 * ⚡ 최적화: 동적 import를 사용하여 필요한 언어만 로드합니다.
 */

import type { Language, TranslationsSchema } from "./types";

/**
 * 타입 export
 */
export type { Language, TranslationsSchema };
export type TranslationKey = keyof TranslationsSchema;

/**
 * 번역 데이터 캐시
 * 한 번 로드한 언어는 메모리에 캐싱하여 재사용
 */
const translationCache = new Map<Language, TranslationsSchema>();

/**
 * 동적으로 언어 번역 데이터 로드
 *
 * @param lang - 언어 코드 ('en' | 'ko')
 * @returns Promise<해당 언어의 번역 데이터>
 *
 * @example
 * const enTranslations = await loadTranslations('en');
 * const koTranslations = await loadTranslations('ko');
 */
export async function loadTranslations(lang: Language): Promise<TranslationsSchema> {
  // 캐시 확인
  const cached = translationCache.get(lang);
  if (cached) {
    return cached;
  }

  // 동적 import
  let translations: TranslationsSchema;

  switch (lang) {
    case 'en':
      const enModule = await import('./en');
      translations = enModule.en;
      break;
    case 'ko':
      const koModule = await import('./ko');
      translations = koModule.ko;
      break;
    default:
      // Fallback to English
      const fallbackModule = await import('./en');
      translations = fallbackModule.en;
  }

  // 캐시 저장
  translationCache.set(lang, translations);

  return translations;
}

/**
 * 동기적으로 번역 데이터 가져오기 (캐시에서만)
 *
 * ⚠️ 주의: 이 함수는 캐시에 있는 데이터만 반환합니다.
 * 캐시에 없으면 에러를 던지므로, 먼저 loadTranslations()를 호출해야 합니다.
 *
 * @param lang - 언어 코드
 * @returns 해당 언어의 번역 데이터
 * @throws Error - 캐시에 데이터가 없는 경우
 */
export function getTranslations(lang: Language): TranslationsSchema {
  const cached = translationCache.get(lang);
  if (!cached) {
    throw new Error(
      `Translation data for "${lang}" not loaded. Call loadTranslations("${lang}") first.`
    );
  }
  return cached;
}

/**
 * 특정 섹션의 번역 데이터 가져오기
 *
 * @param lang - 언어 코드
 * @param section - 섹션 키
 * @returns 해당 섹션의 번역 데이터
 */
export function getSectionTranslation<K extends TranslationKey>(
  lang: Language,
  section: K
): TranslationsSchema[K] {
  const translations = getTranslations(lang);
  return translations[section];
}

/**
 * 특정 언어가 로드되었는지 확인
 *
 * @param lang - 언어 코드
 * @returns 로드 여부
 */
export function isTranslationLoaded(lang: Language): boolean {
  return translationCache.has(lang);
}

/**
 * 캐시 초기화 (테스트용)
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * 레거시 지원: 정적 import (deprecated)
 *
 * ⚠️ 이 방식은 모든 언어를 번들에 포함시킵니다.
 * 새 코드에서는 loadTranslations()를 사용하세요.
 *
 * @deprecated Use loadTranslations() instead for better performance
 */
import { en } from "./en";
import { ko } from "./ko";

export const translations = {
  en,
  ko,
} as const;
