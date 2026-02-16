/**
 * LanguageManager
 * 언어 설정 관리
 *
 * ⚡ 최적화: 동적 import를 사용하여 필요한 언어만 로드
 */

import type { Language, TranslationsSchema } from "@/lib/content/translations/types";
import { loadTranslations, getTranslations, isTranslationLoaded } from "@/lib/content/translations";
import { getStaticOverrides, mergeOverride } from "@/lib/editor/staticOverrides";

export class LanguageManager {
  private current: Language;
  private available: Language[] = ["en", "ko"];
  private listeners: Set<() => void> = new Set();
  private loadingPromises: Map<Language, Promise<TranslationsSchema>> = new Map();

  constructor(initialLanguage: Language = "en") {
    this.current = initialLanguage;

    // 저장된 언어 설정 불러오기 (브라우저 환경에서만)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      if (saved && this.available.includes(saved)) {
        this.current = saved;
      }
    }

    // 초기 언어 데이터 프리로드 (비동기)
    this.preloadLanguage(this.current);
  }

  /**
   * 언어 데이터 프리로드
   *
   * @param lang - 프리로드할 언어
   */
  private async preloadLanguage(lang: Language): Promise<void> {
    if (isTranslationLoaded(lang)) {
      return;
    }

    // 이미 로딩 중이면 기다림
    const loadingPromise = this.loadingPromises.get(lang);
    if (loadingPromise) {
      await loadingPromise;
      return;
    }

    // 새로 로딩
    const promise = loadTranslations(lang);
    this.loadingPromises.set(lang, promise);

    try {
      await promise;
      if (process.env.NODE_ENV === "development") {
        console.log(`[LanguageManager] Loaded translations for: ${lang}`);
      }
    } catch (error) {
      console.error(`[LanguageManager] Failed to load translations for ${lang}:`, error);
    } finally {
      this.loadingPromises.delete(lang);
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
   * 언어 설정 (동적 로딩 지원)
   *
   * @param lang - 설정할 언어
   */
  public async setLanguage(lang: Language): Promise<void> {
    if (!this.available.includes(lang)) {
      console.warn(`[LanguageManager] Unsupported language: ${lang}`);
      return;
    }

    // 언어 데이터가 로드되지 않았으면 로드
    if (!isTranslationLoaded(lang)) {
      await this.preloadLanguage(lang);
    }

    this.current = lang;

    // 언어 설정 저장 (브라우저 환경에서만)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[LanguageManager] Language changed to: ${lang}`);
    }

    this.notify();
  }

  /**
   * 언어 설정 (동기 버전, 레거시 호환)
   *
   * ⚠️ 주의: 언어 데이터가 로드되지 않았으면 에러 발생 가능
   * 새 코드에서는 async setLanguage()를 사용하세요.
   *
   * @deprecated Use async setLanguage() instead
   */
  public setLanguageSync(lang: Language): void {
    if (!this.available.includes(lang)) {
      console.warn(`[LanguageManager] Unsupported language: ${lang}`);
      return;
    }

    this.current = lang;

    // 언어 설정 저장 (브라우저 환경에서만)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }

    // 백그라운드에서 로드 (await 안 함)
    if (!isTranslationLoaded(lang)) {
      this.preloadLanguage(lang);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[LanguageManager] Language changed to: ${lang}`);
    }

    this.notify();
  }

  /**
   * 현재 언어 가져오기
   */
  public getCurrent(): Language {
    return this.current;
  }

  /**
   * 사용 가능한 언어 목록 가져오기
   */
  public getAvailable(): Language[] {
    return [...this.available];
  }

  /**
   * 번역 데이터 가져오기 (오버라이드 적용)
   *
   * ⚠️ 주의: 캐시에 없으면 에러 발생
   * 먼저 setLanguage() 또는 preloadLanguage()를 호출해야 함
   */
  public getTranslations(): TranslationsSchema {
    try {
      const original = getTranslations(this.current);

      // 오버라이드 적용
      const overrides = getStaticOverrides();
      const result: any = { ...original };

      // 각 섹션별로 오버라이드 병합
      for (const sectionId in overrides) {
        if (overrides[sectionId][this.current]) {
          const sectionKey = this.mapSectionIdToKey(sectionId);
          if (sectionKey && result[sectionKey]) {
            result[sectionKey] = mergeOverride(
              result[sectionKey],
              overrides[sectionId][this.current]
            );
          }
        }
      }

      return result as TranslationsSchema;
    } catch (error) {
      console.error(`[LanguageManager] Translation data not loaded for ${this.current}`);
      // Fallback: 동기적으로 로드 시도 (레거시 지원)
      // 이는 성능에 좋지 않으므로 경고 표시
      console.warn("[LanguageManager] Using legacy synchronous import as fallback");
      const { translations } = require("@/lib/content/translations");
      return translations[this.current];
    }
  }

  /**
   * 섹션 ID를 translation 키로 매핑
   * 예: "hero" -> "hero", "why-now" -> "whyNow"
   */
  private mapSectionIdToKey(sectionId: string): keyof TranslationsSchema | null {
    const mapping: Record<string, keyof TranslationsSchema> = {
      "hero": "hero",
      "why-now": "whyNow",
      "competition": "competition",
      "company-goal": "companyGoal",
      "products": "products",
      "mvp-demo": "mvpDemo",
      "go-to-market": "goToMarket",
      "market-opportunity": "marketOpportunity",
      "competitive-moat": "competitiveMoat",
      "team": "team",
      "roadmap": "roadmap",
      "pricing": "pricing",
      "investment-ask": "investmentAsk",
      "demo": "demo",
    };
    return mapping[sectionId] || null;
  }

  /**
   * 특정 섹션의 번역 데이터 가져오기
   */
  public getSectionTranslation<K extends keyof TranslationsSchema>(
    section: K
  ): TranslationsSchema[K] {
    const translations = this.getTranslations();
    return translations[section];
  }

  /**
   * 번역 키로 텍스트 가져오기 (간단한 구현)
   */
  public translate(key: string): string {
    // 추후 중첩된 키 지원 가능 (예: "hero.title")
    return key;
  }

  /**
   * 언어 데이터가 로드되었는지 확인
   *
   * @param lang - 확인할 언어 (생략 시 현재 언어)
   */
  public isLoaded(lang?: Language): boolean {
    return isTranslationLoaded(lang || this.current);
  }

  /**
   * 모든 사용 가능한 언어 프리로드
   *
   * 사용 사례: 오프라인 지원, 빠른 언어 전환
   */
  public async preloadAll(): Promise<void> {
    await Promise.all(
      this.available.map((lang) => this.preloadLanguage(lang))
    );
    if (process.env.NODE_ENV === "development") {
      console.log("[LanguageManager] All languages preloaded");
    }
  }

  /**
   * 정리 (cleanup)
   */
  public destroy(): void {
    this.listeners.clear();
    this.loadingPromises.clear();
  }
}
