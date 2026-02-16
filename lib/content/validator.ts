/**
 * Translation Schema Validator
 * 번역 데이터 스키마 검증 유틸리티
 */

import type { Language, TranslationsSchema, SectionKey } from "./translations/types";
import { translations } from "./translations";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 모든 번역 데이터 검증
 */
export function validateAllTranslations(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const languages: Language[] = ["en", "ko"];
  const sections: SectionKey[] = [
    "hero",
    "competition",
    "whyNow",
    "companyGoal",
    "products",
    "mvpDemo",
    "goToMarket",
    "marketOpportunity",
    "competitiveMoat",
    "team",
    "roadmap",
    "pricing",
    "demo",
    "investmentAsk",
  ];

  // 각 언어별로 모든 섹션이 존재하는지 확인
  for (const lang of languages) {
    const translationData = translations[lang];

    if (!translationData) {
      errors.push(`Missing translation data for language: ${lang}`);
      continue;
    }

    for (const section of sections) {
      if (!translationData[section]) {
        errors.push(`Missing section "${section}" in language "${lang}"`);
      }
    }
  }

  // 언어 간 구조 일치 검증
  for (const section of sections) {
    const enSection = translations.en?.[section];
    const koSection = translations.ko?.[section];

    if (enSection && koSection) {
      const enKeys = Object.keys(enSection);
      const koKeys = Object.keys(koSection);

      // 키 불일치 경고
      const missingInKo = enKeys.filter((key) => !koKeys.includes(key));
      const missingInEn = koKeys.filter((key) => !enKeys.includes(key));

      if (missingInKo.length > 0) {
        warnings.push(
          `Section "${section}": Keys missing in Korean: ${missingInKo.join(", ")}`
        );
      }

      if (missingInEn.length > 0) {
        warnings.push(
          `Section "${section}": Keys missing in English: ${missingInEn.join(", ")}`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 특정 섹션의 번역 데이터 검증
 */
export function validateSection(section: SectionKey): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const enSection = translations.en?.[section];
  const koSection = translations.ko?.[section];

  if (!enSection) {
    errors.push(`Missing English translation for section: ${section}`);
  }

  if (!koSection) {
    errors.push(`Missing Korean translation for section: ${section}`);
  }

  if (enSection && koSection) {
    const enKeys = Object.keys(enSection);
    const koKeys = Object.keys(koSection);

    const missingInKo = enKeys.filter((key) => !koKeys.includes(key));
    const missingInEn = koKeys.filter((key) => !enKeys.includes(key));

    if (missingInKo.length > 0) {
      warnings.push(`Keys missing in Korean: ${missingInKo.join(", ")}`);
    }

    if (missingInEn.length > 0) {
      warnings.push(`Keys missing in English: ${missingInEn.join(", ")}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 개발 환경에서 번역 데이터 검증 실행
 */
if (process.env.NODE_ENV === "development") {
  const result = validateAllTranslations();

  if (!result.valid) {
    console.error("❌ Translation validation failed:");
    result.errors.forEach((error) => console.error(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.warn("⚠️  Translation warnings:");
    result.warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  if (result.valid && result.warnings.length === 0) {
    console.log("✅ All translations validated successfully");
  }
}
