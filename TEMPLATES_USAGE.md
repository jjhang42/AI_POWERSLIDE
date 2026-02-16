# Slide Templates Usage Guide

8가지 재사용 가능한 프레젠테이션 템플릿이 추가되었습니다.

## 📦 설치된 템플릿

1. **TitleSlide** - 표지 슬라이드
2. **SectionTitle** - 섹션 구분 슬라이드
3. **ContentSlide** - 제목 + 본문
4. **TwoColumn** - 2열 레이아웃
5. **BulletPoints** - 제목 + 목록
6. **QuoteSlide** - 인용구
7. **ImageWithCaption** - 이미지 + 캡션
8. **ThankYou** - 마무리 슬라이드

---

## 🚀 사용 방법

### 1. TitleSlide (표지)
```tsx
import { SlideCanvas } from "@/components/SlideCanvas";
import { TitleSlide } from "@/components/templates";

<SlideCanvas aspectRatio="16:9">
  <TitleSlide
    title="AI-Powered Presentation"
    subtitle="Building the Future of Slides"
    author="John Doe"
    date="February 2026"
    logo={<YourLogoComponent />}
  />
</SlideCanvas>
```

### 2. SectionTitle (섹션 구분)
```tsx
<SlideCanvas aspectRatio="16:9">
  <SectionTitle
    section="Part 1"
    title="Introduction"
    description="Getting started with our platform"
  />
</SlideCanvas>
```

### 3. ContentSlide (제목 + 본문)
```tsx
<SlideCanvas aspectRatio="16:9">
  <ContentSlide
    title="Our Mission"
    content="We are building the most intuitive presentation tool for modern teams."
    align="left" // or "center"
  />
</SlideCanvas>
```

**Custom Content:**
```tsx
<SlideCanvas aspectRatio="16:9">
  <ContentSlide
    title="Features"
    content={
      <div>
        <p>Rich text formatting</p>
        <p>Real-time collaboration</p>
      </div>
    }
  />
</SlideCanvas>
```

### 4. TwoColumn (2열 레이아웃)
```tsx
<SlideCanvas aspectRatio="16:9">
  <TwoColumn
    title="Before & After"
    left={
      <div>
        <h3 className="text-3xl font-bold mb-4">Before</h3>
        <p className="text-xl">Manual work, slow processes</p>
      </div>
    }
    right={
      <div>
        <h3 className="text-3xl font-bold mb-4">After</h3>
        <p className="text-xl">Automated, fast, efficient</p>
      </div>
    }
    split="50-50" // or "60-40", "40-60"
  />
</SlideCanvas>
```

### 5. BulletPoints (목록)
```tsx
<SlideCanvas aspectRatio="16:9">
  <BulletPoints
    title="Key Features"
    points={[
      "Real-time overflow detection",
      "Export to JPG, PDF, PowerPoint",
      "Multiple aspect ratios (16:9, 4:3)",
      "Fully customizable templates"
    ]}
    icon="check" // or "chevron", "circle"
  />
</SlideCanvas>
```

### 6. QuoteSlide (인용구)
```tsx
<SlideCanvas aspectRatio="16:9">
  <QuoteSlide
    quote="Simplicity is the ultimate sophistication."
    author="Leonardo da Vinci"
    title="Artist, Inventor"
  />
</SlideCanvas>
```

### 7. ImageWithCaption (이미지)
```tsx
<SlideCanvas aspectRatio="16:9">
  <ImageWithCaption
    title="Our Product"
    imageSrc="/images/product.png"
    imageAlt="Product screenshot"
    caption="The most intuitive interface you've ever seen"
    layout="contained" // or "full"
  />
</SlideCanvas>
```

### 8. ThankYou (마무리)
```tsx
<SlideCanvas aspectRatio="16:9">
  <ThankYou
    message="Thank You!"
    cta="Let's build something amazing together"
    contact={{
      email: "hello@example.com",
      phone: "+1 234 567 8900",
      website: "www.example.com"
    }}
  />
</SlideCanvas>
```

---

## 🎨 스타일 커스터마이징

모든 템플릿은 Tailwind CSS를 사용하므로 쉽게 수정 가능합니다:

```tsx
// 예시: TitleSlide의 색상 변경
<TitleSlide
  title={
    <span className="text-primary">
      Custom Colored Title
    </span>
  }
  subtitle="With custom styling"
/>
```

---

## 📐 Overflow 감지

SlideCanvas가 자동으로 overflow를 감지합니다:
- 텍스트가 너무 길면 좌측 상단에 경고 표시
- 콘솔에 상세 정보 출력 (어떤 요소가 얼마나 벗어났는지)

---

## 🔄 다중 슬라이드 예시

```tsx
export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <TitleSlide title="My Presentation" />,
    <SectionTitle section="Part 1" title="Introduction" />,
    <BulletPoints title="Agenda" points={["Topic 1", "Topic 2"]} />,
    <ThankYou message="Thank You!" />
  ];

  return (
    <SlideCanvas aspectRatio="16:9">
      {slides[currentSlide]}
    </SlideCanvas>
  );
}
```

---

## 💡 Tips

1. **텍스트 길이**: 템플릿은 적절한 텍스트 길이를 가정합니다. 너무 긴 텍스트는 overflow 경고가 발생할 수 있습니다.
2. **반응형**: 모든 템플릿은 16:9와 4:3 비율에서 잘 작동합니다.
3. **확장**: 템플릿을 복사하여 프로젝트에 맞게 수정할 수 있습니다.
4. **Export**: 모든 템플릿은 JPG/PDF/PPTX 내보내기를 지원합니다.

---

## 📁 파일 위치

```
components/
  templates/
    ├── TitleSlide.tsx
    ├── SectionTitle.tsx
    ├── ContentSlide.tsx
    ├── TwoColumn.tsx
    ├── BulletPoints.tsx
    ├── QuoteSlide.tsx
    ├── ImageWithCaption.tsx
    ├── ThankYou.tsx
    └── index.ts
```
