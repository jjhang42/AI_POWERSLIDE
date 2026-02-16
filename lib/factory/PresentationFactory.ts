/**
 * Presentation Factory
 * 템플릿 기반 프레젠테이션 생성 팩토리
 */

import type {
  PresentationTemplate,
  ContentPackage,
  PresentationConfig,
  Presentation,
} from "./types";
import type { TranslationsSchema } from "@/lib/content/translations/types";
import type { Language } from "@/lib/engine/types";

/**
 * 프레젠테이션 팩토리 클래스
 */
export class PresentationFactory {
  /**
   * 템플릿에서 새 프레젠테이션 생성
   */
  static createFromTemplate(config: PresentationConfig): Presentation {
    const { template, content, defaultLanguage = "en" } = config;

    // 프레젠테이션 ID 생성
    const id = this.generateId(template.name);

    // 섹션 구조 빌드
    const sections = this.buildSections(template);

    // 프레젠테이션 객체 생성
    const presentation: Presentation = {
      id,
      name: template.name,
      template,
      content,
      created: Date.now(),
      updated: Date.now(),
    };

    return presentation;
  }

  /**
   * 빈 프레젠테이션 생성
   */
  static createEmpty(
    name: string,
    aspectRatio: { width: number; height: number } = { width: 16, height: 9 },
    languages: Language[] = ["en", "ko"]
  ): Presentation {
    const template: PresentationTemplate = {
      name,
      description: "Empty presentation",
      aspectRatio,
      languages,
      sections: [],
    };

    // 언어별 빈 translations 객체 생성
    const translations: Record<Language, Partial<TranslationsSchema>> =
      {} as Record<Language, Partial<TranslationsSchema>>;
    for (const lang of languages) {
      translations[lang] = {};
    }

    return this.createFromTemplate({
      template,
      content: {
        translations,
      },
    });
  }

  /**
   * 섹션 구조 빌드
   */
  private static buildSections(template: PresentationTemplate) {
    return template.sections.map((section) => ({
      id: section.id,
      type: section.type,
      required: section.required || false,
    }));
  }

  /**
   * 프레젠테이션 ID 생성
   */
  private static generateId(name: string): string {
    const normalized = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const timestamp = Date.now();
    return `${normalized}-${timestamp}`;
  }

  /**
   * 섹션 추가
   */
  static addSection(
    presentation: Presentation,
    sectionId: string,
    sectionType: string,
    content: Record<Language, any>
  ): Presentation {
    // 섹션이 이미 존재하는지 확인
    const existingSection = presentation.template.sections.find(
      (s) => s.id === sectionId
    );

    if (existingSection) {
      throw new Error(`Section already exists: ${sectionId}`);
    }

    // 새 섹션 추가
    const updatedSections = [
      ...presentation.template.sections,
      {
        id: sectionId,
        type: sectionType as any,
        required: false,
      },
    ];

    // 번역 데이터 업데이트
    const updatedTranslations = { ...presentation.content.translations };
    for (const [lang, data] of Object.entries(content)) {
      const language = lang as Language;
      if (!updatedTranslations[language]) {
        updatedTranslations[language] = {};
      }
      (updatedTranslations[language] as any)[sectionId] = data;
    }

    return {
      ...presentation,
      template: {
        ...presentation.template,
        sections: updatedSections,
      },
      content: {
        ...presentation.content,
        translations: updatedTranslations,
      },
      updated: Date.now(),
    };
  }

  /**
   * 콘텐츠 업데이트
   */
  static updateContent(
    presentation: Presentation,
    sectionId: string,
    language: Language,
    path: string,
    value: any
  ): Presentation {
    const updatedTranslations = { ...presentation.content.translations };

    if (!updatedTranslations[language]) {
      throw new Error(`Language not found: ${language}`);
    }

    const langTranslations = updatedTranslations[language] as any;
    if (!langTranslations[sectionId]) {
      throw new Error(`Section not found: ${sectionId}`);
    }

    // JSONPath로 값 설정
    const keys = path.split(".");
    let current = langTranslations[sectionId];

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;

    return {
      ...presentation,
      content: {
        ...presentation.content,
        translations: updatedTranslations,
      },
      updated: Date.now(),
    };
  }

  /**
   * 프레젠테이션 검증
   */
  static validate(presentation: Presentation): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 필수 섹션 검증
    const requiredSections = presentation.template.sections.filter(
      (s) => s.required
    );

    for (const section of requiredSections) {
      for (const lang of presentation.template.languages) {
        const langTranslations = presentation.content.translations[lang] as any;
        if (!langTranslations?.[section.id]) {
          errors.push(
            `Missing required section: ${section.id} (${lang})`
          );
        }
      }
    }

    // 언어별 번역 완성도 검증
    const sectionIds = presentation.template.sections.map((s) => s.id);
    for (const lang of presentation.template.languages) {
      const translations = (presentation.content.translations[lang] || {}) as any;
      const missingSections = sectionIds.filter((id) => !translations[id]);

      if (missingSections.length > 0) {
        errors.push(
          `Missing translations for ${lang}: ${missingSections.join(", ")}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
