"use client";

import { useState, useEffect } from "react";
import { SlideWithProps, TemplateProps } from "@/lib/types/slides";
import { TemplateType } from "@/components/TemplatesSidebar";

const STORAGE_KEY = "presentation-slides";

// DEFAULT_PROPS를 여기로 이동
const getDefaultProps = (type: TemplateType): TemplateProps => {
  const defaultProps: Record<TemplateType, TemplateProps> = {
    TitleSlide: {
      title: "Your Presentation Title",
      subtitle: "Subtitle goes here",
      author: "Your Name",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
    },
    SectionTitle: {
      section: "Section 1",
      title: "Section Title",
      description: "Brief description of this section",
    },
    ContentSlide: {
      title: "Content Title",
      content: "Your content goes here. You can write anything you want to present.",
      align: "left" as const,
    },
    TwoColumn: {
      title: "Two Column Layout",
      left: "Left content goes here",
      right: "Right content goes here",
      split: "50-50" as const,
    },
    BulletPoints: {
      title: "Key Points",
      points: [
        "First important point",
        "Second important point",
        "Third important point",
        "Fourth important point",
      ],
      icon: "check" as const,
    },
    QuoteSlide: {
      quote: "Insert an inspiring quote here that resonates with your message.",
      author: "Author Name",
      title: "Title or Position",
    },
    ImageWithCaption: {
      title: "Image Title",
      imageSrc: "/placeholder.jpg",
      imageAlt: "Image description",
      caption: "Image caption goes here",
      layout: "contained" as const,
    },
    ThankYou: {
      message: "Thank You!",
      cta: "Let's connect and discuss further",
      contact: {
        email: "hello@example.com",
        website: "www.example.com",
      },
    },
  };

  return defaultProps[type];
};

export function useSlides() {
  const [slides, setSlides] = useState<SlideWithProps[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // localStorage에서 로드
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSlides(parsed);
      } catch (e) {
        console.error("Failed to load slides:", e);
      }
    }
  }, []);

  // 변경 시 저장 (debounced)
  useEffect(() => {
    if (slides.length > 0) {
      setIsSaving(true);

      const timer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
          setLastSaved(new Date());
          setIsSaving(false);
        } catch (e) {
          console.error("Failed to save slides:", e);
          setIsSaving(false);
        }
      }, 300); // 300ms debounce

      return () => clearTimeout(timer);
    }
  }, [slides]);

  // 슬라이드 추가
  const addSlide = (type: TemplateType, name: string) => {
    const newSlide: SlideWithProps = {
      id: `slide-${Date.now()}-${Math.random()}`,
      type,
      name,
      props: getDefaultProps(type),
    };
    setSlides([...slides, newSlide]);
    return slides.length; // 새 슬라이드 인덱스 반환
  };

  // 슬라이드 props 업데이트
  const updateSlideProps = (index: number, newProps: Partial<TemplateProps>) => {
    const updated = [...slides];
    updated[index] = {
      ...updated[index],
      props: { ...updated[index].props, ...newProps } as TemplateProps,
    };
    setSlides(updated);
  };

  // 슬라이드 삭제
  const deleteSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  // 슬라이드 순서 변경
  const reorderSlides = (startIndex: number, endIndex: number) => {
    const result = Array.from(slides);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setSlides(result);
  };

  // 슬라이드 복제
  const duplicateSlide = (index: number) => {
    const slideToDuplicate = slides[index];
    const newSlide: SlideWithProps = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}-${Math.random()}`,
      name: `${slideToDuplicate.name} (Copy)`,
    };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    return index + 1; // Return new slide index
  };

  return {
    slides,
    addSlide,
    updateSlideProps,
    deleteSlide,
    reorderSlides,
    duplicateSlide,
    lastSaved,
    isSaving,
  };
}
