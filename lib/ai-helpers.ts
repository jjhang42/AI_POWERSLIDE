/**
 * AI Helpers
 * AI (Claude Code CLI 등)가 프레젠테이션을 프로그래밍 방식으로 조작할 수 있는 도구
 */

import { SlideWithProps } from "@/lib/types/slides";
import { TemplateType } from "@/components/TemplatesSidebar";

const STORAGE_KEY = "presentation-slides";

export const AIHelpers = {
  /**
   * 모든 슬라이드 가져오기
   */
  getSlides: (): SlideWithProps[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  /**
   * 슬라이드 목록 설정 (전체 덮어쓰기)
   */
  setSlides: (slides: SlideWithProps[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    // storage 이벤트 발생시켜 React 컴포넌트 업데이트
    window.dispatchEvent(new Event("storage"));
  },

  /**
   * 슬라이드 추가
   */
  addSlide: (type: TemplateType, props: any, name?: string): string => {
    const slides = AIHelpers.getSlides();
    const id = `slide-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const newSlide: SlideWithProps = {
      id,
      type,
      name: name || type,
      props,
    };

    slides.push(newSlide);
    AIHelpers.setSlides(slides);

    return id; // 생성된 슬라이드 ID 반환
  },

  /**
   * 슬라이드 업데이트 (인덱스로)
   */
  updateSlide: (index: number, newProps: Partial<any>): void => {
    const slides = AIHelpers.getSlides();
    if (index < 0 || index >= slides.length) {
      throw new Error(`Invalid slide index: ${index}`);
    }

    slides[index] = {
      ...slides[index],
      props: { ...slides[index].props, ...newProps },
    };

    AIHelpers.setSlides(slides);
  },

  /**
   * 슬라이드 업데이트 (ID로)
   */
  updateSlideById: (id: string, newProps: Partial<any>): void => {
    const slides = AIHelpers.getSlides();
    const index = slides.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Slide not found: ${id}`);
    }

    AIHelpers.updateSlide(index, newProps);
  },

  /**
   * 슬라이드 삭제 (인덱스로)
   */
  deleteSlide: (index: number): void => {
    const slides = AIHelpers.getSlides();
    if (index < 0 || index >= slides.length) {
      throw new Error(`Invalid slide index: ${index}`);
    }

    slides.splice(index, 1);
    AIHelpers.setSlides(slides);
  },

  /**
   * 슬라이드 삭제 (ID로)
   */
  deleteSlideById: (id: string): void => {
    const slides = AIHelpers.getSlides();
    const index = slides.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Slide not found: ${id}`);
    }

    AIHelpers.deleteSlide(index);
  },

  /**
   * 모든 슬라이드 삭제
   */
  clearAllSlides: (): void => {
    AIHelpers.setSlides([]);
  },

  /**
   * 슬라이드 순서 변경
   */
  reorderSlides: (fromIndex: number, toIndex: number): void => {
    const slides = AIHelpers.getSlides();
    const [removed] = slides.splice(fromIndex, 1);
    slides.splice(toIndex, 0, removed);
    AIHelpers.setSlides(slides);
  },

  /**
   * 슬라이드 복제
   */
  duplicateSlide: (index: number): string => {
    const slides = AIHelpers.getSlides();
    if (index < 0 || index >= slides.length) {
      throw new Error(`Invalid slide index: ${index}`);
    }

    const original = slides[index];
    const id = `slide-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const duplicate: SlideWithProps = {
      ...original,
      id,
      name: `${original.name} (Copy)`,
    };

    slides.splice(index + 1, 0, duplicate);
    AIHelpers.setSlides(slides);

    return id;
  },

  /**
   * JSON으로 내보내기
   */
  exportJSON: (): string => {
    const slides = AIHelpers.getSlides();
    return JSON.stringify(slides, null, 2);
  },

  /**
   * JSON에서 가져오기
   */
  importJSON: (json: string): void => {
    try {
      const slides = JSON.parse(json);
      if (!Array.isArray(slides)) {
        throw new Error("Invalid JSON: expected an array of slides");
      }
      AIHelpers.setSlides(slides);
    } catch (error) {
      throw new Error(`Failed to import JSON: ${error}`);
    }
  },

  /**
   * 슬라이드 개수
   */
  getSlideCount: (): number => {
    return AIHelpers.getSlides().length;
  },

  /**
   * 특정 슬라이드 가져오기
   */
  getSlide: (index: number): SlideWithProps | null => {
    const slides = AIHelpers.getSlides();
    return slides[index] || null;
  },

  /**
   * ID로 슬라이드 가져오기
   */
  getSlideById: (id: string): SlideWithProps | null => {
    const slides = AIHelpers.getSlides();
    return slides.find((s) => s.id === id) || null;
  },

  /**
   * 슬라이드 검색 (제목으로)
   */
  searchSlides: (query: string): SlideWithProps[] => {
    const slides = AIHelpers.getSlides();
    const lowerQuery = query.toLowerCase();

    return slides.filter((slide) => {
      const name = slide.name.toLowerCase();
      const propsStr = JSON.stringify(slide.props).toLowerCase();
      return name.includes(lowerQuery) || propsStr.includes(lowerQuery);
    });
  },

  /**
   * 유틸리티: 슬라이드 타입별 기본 props 생성
   */
  getDefaultProps: (type: TemplateType): any => {
    const defaults: Record<TemplateType, any> = {
      TitleSlide: {
        title: "New Presentation",
        subtitle: "Subtitle here",
        author: "Your Name",
        date: new Date().toLocaleDateString(),
      },
      SectionTitle: {
        section: "Section 1",
        title: "Section Title",
        description: "Section description",
      },
      ContentSlide: {
        title: "Content Title",
        content: "Content goes here...",
        align: "left",
      },
      TwoColumn: {
        title: "Two Column Layout",
        left: "Left column content",
        right: "Right column content",
        split: "50-50",
      },
      BulletPoints: {
        title: "Key Points",
        points: ["Point 1", "Point 2", "Point 3"],
        icon: "chevron",
      },
      QuoteSlide: {
        quote: "Your quote here",
        author: "Author Name",
        title: "Title/Position",
      },
      ImageWithCaption: {
        title: "Image Title",
        imageSrc: "https://via.placeholder.com/800x600",
        imageAlt: "Placeholder image",
        caption: "Image caption",
        layout: "contained",
      },
      ThankYou: {
        message: "Thank You",
        cta: "Questions?",
        contact: {
          email: "contact@example.com",
          website: "www.example.com",
        },
      },
    };

    return defaults[type] || {};
  },
};

// 브라우저 환경에서만 window에 노출
if (typeof window !== "undefined") {
  (window as any).aiHelpers = AIHelpers;
  console.log("✅ AIHelpers loaded. Use window.aiHelpers in the console.");
}
