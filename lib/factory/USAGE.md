# Presentation Factory 사용 가이드

## 개요

PresentationFactory는 템플릿 기반으로 프레젠테이션을 빠르게 생성하고 관리할 수 있는 팩토리 패턴 구현입니다.

## 기본 사용법

### 1. 템플릿에서 프레젠테이션 생성

```typescript
import {
  PresentationFactory,
  VCPitchDeckTemplate,
  type ContentPackage,
} from "@/lib/factory";

// 콘텐츠 패키지 준비
const content: ContentPackage = {
  company: "iil",
  tagline: "Digitizing the Last Mile",
  translations: {
    hero: {
      companyName: "iil",
      mainHeadline: "Digitizing the Last Mile",
      mainSubheadline: "Smart Parcel Locker Solutions",
      description: "We provide AI-powered smart locker solutions...",
      metrics: [
        { icon: "📦", label: "Daily Deliveries", value: "10,000+" },
        { icon: "🏢", label: "Partner Buildings", value: "500+" },
        { icon: "🌍", label: "Cities", value: "20+" },
      ],
      scrollText: "Scroll to explore",
    },
    problem: {
      badge: "The Problem",
      title: "Last-Mile Delivery is Broken",
      subtitle: "Inefficiencies cost billions",
      painPoints: [
        {
          icon: "⏰",
          title: "Time Wasted",
          description: "Average 30 minutes per failed delivery",
        },
        // ...
      ],
    },
    // ... 다른 섹션들
  },
};

// 프레젠테이션 생성
const presentation = PresentationFactory.createFromTemplate({
  template: VCPitchDeckTemplate,
  content,
  defaultLanguage: "en",
});

console.log(presentation);
// {
//   id: "vc-pitch-deck-1234567890",
//   name: "VC Pitch Deck",
//   template: { ... },
//   content: { ... },
//   created: 1234567890,
//   updated: 1234567890
// }
```

### 2. 빈 프레젠테이션 생성

```typescript
import { PresentationFactory } from "@/lib/factory";

const emptyPresentation = PresentationFactory.createEmpty(
  "My Custom Presentation",
  { width: 16, height: 9 },
  ["en", "ko"]
);
```

### 3. 섹션 추가

```typescript
const updatedPresentation = PresentationFactory.addSection(
  presentation,
  "case-studies",
  "case-study-grid",
  {
    en: {
      title: "Case Studies",
      subtitle: "Success Stories",
      cases: [
        {
          company: "Company A",
          result: "50% efficiency improvement",
        },
      ],
    },
    ko: {
      title: "사례 연구",
      subtitle: "성공 사례",
      cases: [
        {
          company: "회사 A",
          result: "50% 효율성 개선",
        },
      ],
    },
  }
);
```

### 4. 콘텐츠 업데이트

```typescript
const updatedPresentation = PresentationFactory.updateContent(
  presentation,
  "hero",
  "ko",
  "mainHeadline",
  "혁신적인 라스트마일 솔루션"
);
```

중첩된 필드 업데이트:

```typescript
const updatedPresentation = PresentationFactory.updateContent(
  presentation,
  "hero",
  "en",
  "metrics[0].value",
  "15,000+"
);
```

### 5. 프레젠테이션 검증

```typescript
const validation = PresentationFactory.validate(presentation);

if (!validation.valid) {
  console.error("Validation errors:", validation.errors);
  // [
  //   "Missing required section: investment (ko)",
  //   "Missing translations for ko: team, traction"
  // ]
}
```

## 사용 가능한 템플릿

### 1. VC Pitch Deck Template

벤처캐피탈 투자 유치를 위한 표준 피치덱 (14개 섹션)

```typescript
import { VCPitchDeckTemplate } from "@/lib/factory";

// 포함된 섹션:
// - hero (필수)
// - why-now
// - problem
// - solution
// - products
// - how-it-works
// - market-size
// - competition
// - competitive-advantage
// - business-model
// - pricing
// - traction
// - team
// - investment (필수)
```

### 2. Product Demo Template

제품 시연용 간소화된 템플릿 (8개 섹션)

```typescript
import { ProductDemoTemplate } from "@/lib/factory";

// 포함된 섹션:
// - intro (필수)
// - problem
// - solution
// - features
// - how-it-works
// - demo
// - pricing
// - case-studies
```

## 커스텀 템플릿 생성

```typescript
import type { PresentationTemplate } from "@/lib/factory";

const MyCustomTemplate: PresentationTemplate = {
  name: "My Custom Template",
  description: "A custom presentation template",
  aspectRatio: { width: 4, height: 3 },
  languages: ["en", "ko", "ja"],
  sections: [
    {
      id: "intro",
      type: "title-slide",
      required: true,
    },
    {
      id: "content",
      type: "content-slide",
    },
    {
      id: "conclusion",
      type: "content-slide",
      required: true,
    },
  ],
};

// 사용
const presentation = PresentationFactory.createFromTemplate({
  template: MyCustomTemplate,
  content: { ... },
});
```

## 섹션 타입

사용 가능한 섹션 타입:

- `title-slide` - 제목 슬라이드
- `content-slide` - 일반 콘텐츠 슬라이드
- `comparison-table` - 비교 테이블
- `metrics-slide` - 메트릭/지표 슬라이드
- `people-grid` - 팀원 그리드
- `timeline-slide` - 타임라인 슬라이드
- `chart-slide` - 차트 슬라이드
- `feature-grid` - 기능 그리드
- `video-slide` - 비디오 슬라이드
- `pricing-table` - 가격표
- `case-study-grid` - 사례 연구 그리드

## MCP 서버와 통합

PresentationFactory는 MCP 서버의 `create-presentation` 도구에서 사용됩니다:

```javascript
// mcp-server/tools/create-presentation.js
import { PresentationFactory, VCPitchDeckTemplate } from "../lib/factory";

const presentation = PresentationFactory.createFromTemplate({
  template: VCPitchDeckTemplate,
  content: input.content,
});
```

## 프론트엔드와 통합

PresentationEngine과 함께 사용:

```typescript
import { PresentationFactory, VCPitchDeckTemplate } from "@/lib/factory";
import { PresentationEngine } from "@/lib/engine";

// Factory로 프레젠테이션 생성
const presentation = PresentationFactory.createFromTemplate({
  template: VCPitchDeckTemplate,
  content,
});

// Engine으로 렌더링
const engine = new PresentationEngine({
  sections: presentation.template.sections,
  translations: presentation.content.translations,
  defaultAspectRatio: presentation.template.aspectRatio,
  defaultLanguage: "en",
});
```

## 베스트 프랙티스

### 1. 타입 안전성

항상 TypeScript 타입을 사용하여 컴파일 타임에 에러를 잡으세요:

```typescript
import type { ContentPackage } from "@/lib/factory";

const content: ContentPackage = {
  translations: {
    // 자동완성과 타입 체크 지원
  },
};
```

### 2. 검증

프레젠테이션을 저장하거나 내보내기 전에 항상 검증하세요:

```typescript
const validation = PresentationFactory.validate(presentation);
if (!validation.valid) {
  throw new Error(`Invalid presentation: ${validation.errors.join(", ")}`);
}
```

### 3. 불변성

Factory 메서드는 항상 새 객체를 반환합니다. 원본을 수정하지 않습니다:

```typescript
const original = PresentationFactory.createFromTemplate({ ... });
const updated = PresentationFactory.updateContent(original, ...);

// original은 변경되지 않음
console.log(original === updated); // false
```

## 에러 처리

```typescript
try {
  const presentation = PresentationFactory.createFromTemplate({
    template: VCPitchDeckTemplate,
    content,
  });

  // 섹션 추가 시 중복 체크
  const updated = PresentationFactory.addSection(
    presentation,
    "hero", // 이미 존재하는 섹션
    "title-slide",
    {}
  );
} catch (error) {
  if (error.message.includes("already exists")) {
    console.error("Section already exists");
  } else if (error.message.includes("not found")) {
    console.error("Section or language not found");
  } else {
    throw error;
  }
}
```

## 고급 사용법

### 프레젠테이션 복제

```typescript
function clonePresentation(presentation: Presentation): Presentation {
  return {
    ...presentation,
    id: `${presentation.id}-copy-${Date.now()}`,
    name: `${presentation.name} (Copy)`,
    created: Date.now(),
    updated: Date.now(),
  };
}
```

### 부분 업데이트

```typescript
function bulkUpdate(
  presentation: Presentation,
  updates: Array<{
    sectionId: string;
    language: Language;
    path: string;
    value: any;
  }>
): Presentation {
  return updates.reduce(
    (acc, update) =>
      PresentationFactory.updateContent(
        acc,
        update.sectionId,
        update.language,
        update.path,
        update.value
      ),
    presentation
  );
}
```

### 언어별 완성도 체크

```typescript
function checkCompleteness(
  presentation: Presentation,
  language: Language
): number {
  const totalSections = presentation.template.sections.length;
  const completedSections = presentation.template.sections.filter(
    (section) => presentation.content.translations[language]?.[section.id]
  ).length;

  return (completedSections / totalSections) * 100;
}

const completeness = checkCompleteness(presentation, "ko");
console.log(`Korean translation: ${completeness}% complete`);
```
