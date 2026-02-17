# Presentation Builder - AI Usage Guide

이 문서는 AI (Claude Code CLI 등)가 프레젠테이션 빌더 앱을 프로그래밍 방식으로 사용하는 방법을 설명합니다.

---

## ⚠️ AI 수정 제한 영역

**다음 파일들은 AI가 수정할 수 없습니다:**

- `/components/positioning/` - 사용자 위치 조정 시스템
  - `DraggableElement.tsx` - 드래그 가능한 요소
  - `PositionManager.tsx` - 위치 관리 UI

**AI는 다음을 할 수 있습니다:**
- ✅ Position props 값 설정 (`positions: { title: { x: 10, y: 20 } }`)
- ✅ Position 시스템 사용 (슬라이드에 position 데이터 추가)

**AI는 다음을 할 수 없습니다:**
- ❌ Positioning 시스템 코드 수정
- ❌ DraggableElement 컴포넌트 수정
- ❌ PositionManager 컴포넌트 수정

**이유:** 사용자가 GUI에서 직접 요소를 배치하는 기능이므로, AI가 시스템 코드를 수정하면 사용자 경험을 해칠 수 있습니다.

---

## 개요

**Presentation Builder**는 웹 기반 프레젠테이션 제작 도구입니다.
- **8개 템플릿** 제공: TitleSlide, SectionTitle, ContentSlide, TwoColumn, BulletPoints, QuoteSlide, ImageWithCaption, ThankYou
- **완전한 커스터마이징**: CSS, Tailwind 클래스, 인라인 스타일 지원
- **localStorage 기반 저장**: 브라우저 로컬 스토리지에 자동 저장
- **AI 친화적 API**: `window.aiHelpers`로 프로그래밍 방식 접근

---

## Quick Start

### 1. 앱 실행

```bash
npm run dev
# http://localhost:3000
```

### 2. 브라우저에서 접근

Playwright MCP를 사용하여 브라우저를 열고 접근:

```typescript
await navigate("http://localhost:3000");
```

### 3. AIHelpers 사용

브라우저 콘솔 또는 Playwright `evaluate()`를 통해 `window.aiHelpers` 사용:

```typescript
// Playwright evaluate 예시
await evaluate({
  function: `() => {
    // 슬라이드 추가
    window.aiHelpers.addSlide('TitleSlide', {
      title: 'My Presentation',
      subtitle: 'Created by AI',
      author: 'Claude',
      date: '2024-01-15'
    });

    return window.aiHelpers.getSlideCount();
  }`
});
```

---

## AIHelpers API 레퍼런스

### 기본 메서드

#### `getSlides(): SlideWithProps[]`
모든 슬라이드 가져오기

```javascript
const slides = window.aiHelpers.getSlides();
console.log(`Total slides: ${slides.length}`);
```

#### `addSlide(type, props, name?): string`
새 슬라이드 추가. 생성된 슬라이드 ID 반환.

```javascript
const id = window.aiHelpers.addSlide('TitleSlide', {
  title: 'Hello World',
  subtitle: 'My First Slide',
  author: 'AI',
  date: '2024-01-15',
  // 스타일 커스터마이징 (선택)
  backgroundColor: 'bg-blue-600',
  textColor: 'text-white',
  className: 'border-4 border-yellow-400'
});

console.log(`Created slide: ${id}`);
```

#### `updateSlide(index, newProps): void`
슬라이드 업데이트 (인덱스로)

```javascript
window.aiHelpers.updateSlide(0, {
  title: 'Updated Title',
  backgroundColor: 'bg-red-500'
});
```

#### `deleteSlide(index): void`
슬라이드 삭제

```javascript
window.aiHelpers.deleteSlide(0); // 첫 번째 슬라이드 삭제
```

#### `clearAllSlides(): void`
모든 슬라이드 삭제

```javascript
window.aiHelpers.clearAllSlides();
```

### 고급 메서드

#### `updateSlideById(id, newProps): void`
슬라이드 업데이트 (ID로)

#### `deleteSlideById(id): void`
슬라이드 삭제 (ID로)

#### `reorderSlides(fromIndex, toIndex): void`
슬라이드 순서 변경

```javascript
window.aiHelpers.reorderSlides(0, 2); // 첫 번째 슬라이드를 세 번째로 이동
```

#### `duplicateSlide(index): string`
슬라이드 복제

```javascript
const newId = window.aiHelpers.duplicateSlide(0);
```

#### `exportJSON(): string`
JSON으로 내보내기

```javascript
const json = window.aiHelpers.exportJSON();
console.log(json);
```

#### `importJSON(json): void`
JSON에서 가져오기

```javascript
const json = '[{"id":"slide-1","type":"TitleSlide",...}]';
window.aiHelpers.importJSON(json);
```

#### `searchSlides(query): SlideWithProps[]`
슬라이드 검색

```javascript
const results = window.aiHelpers.searchSlides('Hello');
console.log(`Found ${results.length} slides`);
```

#### `getDefaultProps(type): any`
템플릿 타입별 기본 props 가져오기

```javascript
const defaults = window.aiHelpers.getDefaultProps('TitleSlide');
console.log(defaults);
```

---

## 슬라이드 템플릿 & Props

### 1. TitleSlide (표지 슬라이드)

```javascript
window.aiHelpers.addSlide('TitleSlide', {
  title: 'Presentation Title',
  subtitle: 'Subtitle here',
  author: 'Your Name',
  date: '2024-01-15',

  // 스타일 (선택)
  backgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-600',
  textColor: 'text-white',
  className: 'shadow-2xl',
  style: { borderRadius: '20px' }
});
```

### 2. SectionTitle (섹션 구분)

```javascript
window.aiHelpers.addSlide('SectionTitle', {
  section: 'Section 1',
  title: 'Main Topic',
  description: 'Section overview',

  backgroundColor: 'bg-indigo-500',
  textColor: 'text-white'
});
```

### 3. ContentSlide (제목 + 본문)

```javascript
window.aiHelpers.addSlide('ContentSlide', {
  title: 'Introduction',
  content: 'This is the main content of the slide...',
  align: 'left', // 'left' | 'center' | 'right'

  backgroundColor: 'bg-white',
  textColor: 'text-gray-900'
});
```

### 4. TwoColumn (2열 레이아웃)

```javascript
window.aiHelpers.addSlide('TwoColumn', {
  title: 'Comparison',
  left: 'Left column content',
  right: 'Right column content',
  split: '50-50', // '50-50' | '60-40' | '40-60'

  backgroundColor: 'bg-gray-50'
});
```

### 5. BulletPoints (목록)

```javascript
window.aiHelpers.addSlide('BulletPoints', {
  title: 'Key Points',
  points: [
    'First point',
    'Second point',
    'Third point'
  ],
  icon: 'chevron', // 'check' | 'chevron' | 'circle'

  textColor: 'text-blue-900'
});
```

### 6. QuoteSlide (인용구)

```javascript
window.aiHelpers.addSlide('QuoteSlide', {
  quote: 'Innovation distinguishes between a leader and a follower.',
  author: 'Steve Jobs',
  title: 'Apple Co-founder',

  backgroundColor: 'bg-gradient-to-r from-purple-400 to-pink-600',
  textColor: 'text-white'
});
```

### 7. ImageWithCaption (이미지 + 캡션)

```javascript
window.aiHelpers.addSlide('ImageWithCaption', {
  title: 'Product Screenshot',
  imageSrc: 'https://example.com/image.png',
  imageAlt: 'Product interface',
  caption: 'Our new dashboard design',
  layout: 'contained', // 'contained' | 'fullscreen'
});
```

### 8. ThankYou (마무리)

```javascript
window.aiHelpers.addSlide('ThankYou', {
  message: 'Thank You',
  cta: 'Any Questions?',
  contact: {
    email: 'contact@example.com',
    website: 'www.example.com'
  },

  backgroundColor: 'bg-black',
  textColor: 'text-white'
});
```

---

## 스타일 커스터마이징

모든 슬라이드 템플릿은 다음 스타일 props를 지원합니다:

### 1. Tailwind 클래스

```javascript
{
  backgroundColor: 'bg-blue-600',           // 배경색
  textColor: 'text-white',                  // 텍스트 색상
  className: 'shadow-2xl rounded-3xl p-8'  // 추가 클래스
}
```

### 2. 인라인 스타일 (CSSProperties)

```javascript
{
  style: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '20px',
    padding: '40px'
  }
}
```

### 3. Apple 컬러 시스템

Tailwind config에 Apple 컬러가 추가되어 있습니다:

```javascript
{
  backgroundColor: 'bg-apple-blue-light',
  textColor: 'text-apple-green-dark'
}
```

사용 가능한 색상:
- `apple-blue-{light|dark}`
- `apple-green-{light|dark}`
- `apple-indigo-{light|dark}`
- `apple-orange-{light|dark}`
- `apple-pink-{light|dark}`
- `apple-purple-{light|dark}`
- `apple-red-{light|dark}`
- `apple-teal-{light|dark}`
- `apple-yellow-{light|dark}`
- `apple-gray-{1|2|3|4|5|6}`

### 4. SF Pro Typography

Apple SF Pro 스타일 유틸리티 클래스:

```javascript
{
  className: 'text-sf-hero'      // 72px, 초대형
  className: 'text-sf-display-1' // 48px, 대형
  className: 'text-sf-title-1'   // 28px, 제목
  className: 'text-sf-body'      // 17px, 본문
}
```

---

## 실전 예제

### 예제 1: 5장짜리 간단한 프레젠테이션 만들기

```javascript
// 모든 슬라이드 삭제
window.aiHelpers.clearAllSlides();

// 1. Title Slide
window.aiHelpers.addSlide('TitleSlide', {
  title: 'Q4 Business Review',
  subtitle: '2024 Performance Summary',
  author: 'AI Assistant',
  date: '2024-01-15',
  backgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-700',
  textColor: 'text-white'
});

// 2. Section Title
window.aiHelpers.addSlide('SectionTitle', {
  section: 'Revenue',
  title: 'Financial Performance',
  description: 'Key metrics and achievements',
  backgroundColor: 'bg-indigo-500',
  textColor: 'text-white'
});

// 3. Bullet Points
window.aiHelpers.addSlide('BulletPoints', {
  title: 'Q4 Highlights',
  points: [
    'Revenue increased 35% YoY',
    'Acquired 500+ new customers',
    'Launched 3 new products',
    'Expanded to 10 new markets'
  ],
  icon: 'check'
});

// 4. Quote
window.aiHelpers.addSlide('QuoteSlide', {
  quote: 'The best way to predict the future is to invent it.',
  author: 'Alan Kay',
  title: 'Computer Scientist',
  backgroundColor: 'bg-gray-900',
  textColor: 'text-white'
});

// 5. Thank You
window.aiHelpers.addSlide('ThankYou', {
  message: 'Thank You',
  cta: 'Questions & Discussion',
  contact: {
    email: 'team@company.com',
    website: 'www.company.com'
  },
  backgroundColor: 'bg-black',
  textColor: 'text-white'
});

console.log(`Created ${window.aiHelpers.getSlideCount()} slides`);
```

### 예제 2: JSON 내보내기 & 가져오기

```javascript
// 내보내기
const json = window.aiHelpers.exportJSON();
console.log(json);

// 파일로 저장 (Node.js 또는 Playwright)
require('fs').writeFileSync('presentation.json', json);

// 가져오기
const json = require('fs').readFileSync('presentation.json', 'utf-8');
window.aiHelpers.importJSON(json);
```

### 예제 3: 동적 데이터 기반 슬라이드 생성

```javascript
const data = [
  { month: 'January', revenue: '$1.2M', growth: '+25%' },
  { month: 'February', revenue: '$1.5M', growth: '+30%' },
  { month: 'March', revenue: '$1.8M', growth: '+35%' }
];

window.aiHelpers.clearAllSlides();

data.forEach((item, index) => {
  window.aiHelpers.addSlide('ContentSlide', {
    title: `${item.month} Results`,
    content: `Revenue: ${item.revenue}\\nGrowth: ${item.growth}`,
    align: 'center',
    backgroundColor: index % 2 === 0 ? 'bg-blue-50' : 'bg-white'
  });
});
```

---

## Playwright 워크플로우

### 전체 워크플로우 예시

```typescript
// 1. 브라우저 열기
await navigate("http://localhost:3000");

// 2. 페이지 로드 대기
await wait_for({ time: 2 });

// 3. AIHelpers로 슬라이드 생성
await evaluate({
  function: `() => {
    window.aiHelpers.clearAllSlides();

    window.aiHelpers.addSlide('TitleSlide', {
      title: 'AI Generated Presentation',
      subtitle: 'Created with Claude Code',
      author: 'Claude',
      date: new Date().toLocaleDateString(),
      backgroundColor: 'bg-gradient-to-br from-purple-600 to-pink-600',
      textColor: 'text-white'
    });

    window.aiHelpers.addSlide('BulletPoints', {
      title: 'Features',
      points: [
        'AI-powered content generation',
        'Beautiful Apple-inspired design',
        'Export to JSON',
        'Full CSS customization'
      ]
    });

    return 'Created ' + window.aiHelpers.getSlideCount() + ' slides';
  }`
});

// 4. 스크린샷으로 확인
await screenshot({ filename: 'presentation.png' });

// 5. JSON 내보내기
const result = await evaluate({
  function: `() => window.aiHelpers.exportJSON()`
});

console.log('Exported JSON:', result);
```

---

## 주의사항

### localStorage 동기화

`window.aiHelpers`를 사용하면 localStorage가 업데이트되고, React 컴포넌트가 자동으로 리렌더링됩니다. 하지만 Playwright에서는 페이지를 새로고침하거나 잠시 대기해야 할 수 있습니다.

```typescript
// 슬라이드 추가 후 UI 업데이트 대기
await evaluate({
  function: `() => {
    window.aiHelpers.addSlide('TitleSlide', { title: 'Test' });
  }`
});

// 1초 대기 (UI 업데이트)
await wait_for({ time: 1 });
```

### 이미지 URL

`ImageWithCaption`을 사용할 때는 공개 URL을 사용하세요:
- ✅ `https://picsum.photos/800/600`
- ✅ `https://example.com/image.png`
- ❌ `/local/image.png` (상대 경로는 작동하지 않을 수 있음)

### 타입 안전성

TypeScript를 사용하는 경우, `@/lib/types/slides.ts`에서 타입을 import하세요:

```typescript
import { TitleSlideProps, BulletPointsProps } from "@/lib/types/slides";
```

---

## 디버깅

### 콘솔에서 확인

```javascript
// 슬라이드 확인
console.log(window.aiHelpers.getSlides());

// 개수 확인
console.log(window.aiHelpers.getSlideCount());

// 특정 슬라이드 확인
console.log(window.aiHelpers.getSlide(0));

// 검색
console.log(window.aiHelpers.searchSlides('title'));
```

### localStorage 직접 확인

```javascript
console.log(localStorage.getItem('presentation-slides'));
```

---

## 추가 리소스

- **Tailwind CSS 문서**: https://tailwindcss.com/docs
- **Apple HIG**: https://developer.apple.com/design/human-interface-guidelines/
- **Framer Motion**: https://www.framer.com/motion/

---

## 라이센스

이 프로젝트는 교육 및 실험 목적으로 제작되었습니다.
