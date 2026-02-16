"use client";

import { useState, useEffect } from "react";
import { SlideWithProps, TemplateProps } from "@/lib/types/slides";
import { TEMPLATE_REGISTRY, TemplateType } from "@/components/templates";
import { useHistory } from "./useHistory";

const STORAGE_KEY = "presentation-slides";

// DEFAULT_PROPS를 registry에서 가져옴
const getDefaultProps = (type: TemplateType): TemplateProps => {
  return TEMPLATE_REGISTRY[type]?.defaultProps;
};

// Get initial slides from localStorage
const getInitialSlides = (): SlideWithProps[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load initial slides:", e);
    return [];
  }
};

export function useSlides() {
  const history = useHistory<SlideWithProps[]>(getInitialSlides());
  const slides = history.state;
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [lastActionDescription, setLastActionDescription] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(true); // Already loaded from getInitialSlides

  // Listen for storage events (from aiHelpers or other tabs)
  useEffect(() => {
    if (typeof window === "undefined" || !isLoaded) return;

    const handleStorageChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          history.set(parsed);
        } catch (e) {
          console.error("Failed to sync slides from storage:", e);
        }
      } else {
        // localStorage was cleared
        history.set([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoaded, history.set]);

  // 변경 시 저장 (debounced)
  useEffect(() => {
    if (isLoaded && slides.length > 0) {
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
  }, [slides, isLoaded]);

  // 슬라이드 추가
  const addSlide = (type: TemplateType, name: string) => {
    const newSlide: SlideWithProps = {
      id: `slide-${Date.now()}-${Math.random()}`,
      type,
      name,
      props: getDefaultProps(type),
    };
    setLastActionDescription(`Added ${name}`);
    history.set([...slides, newSlide]);
    return slides.length; // 새 슬라이드 인덱스 반환
  };

  // 슬라이드 props 업데이트
  const updateSlideProps = (index: number, newProps: Partial<TemplateProps>) => {
    const updated = [...slides];
    updated[index] = {
      ...updated[index],
      props: { ...updated[index].props, ...newProps } as TemplateProps,
    };
    setLastActionDescription(`Updated ${updated[index].name}`);
    history.set(updated);
  };

  // 슬라이드 삭제
  const deleteSlide = (index: number) => {
    const slideName = slides[index]?.name || "slide";
    setLastActionDescription(`Deleted ${slideName}`);
    history.set(slides.filter((_, i) => i !== index));
  };

  // 슬라이드 순서 변경
  const reorderSlides = (startIndex: number, endIndex: number) => {
    const result = Array.from(slides);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setLastActionDescription(`Reordered ${removed.name}`);
    history.set(result);
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
    setLastActionDescription(`Duplicated ${slideToDuplicate.name}`);
    history.set(newSlides);
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
    lastActionDescription,
    undo: history.undo,
    redo: history.redo,
    goToHistoryIndex: history.goToIndex,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    historyStates: history.history,
    currentHistoryIndex: history.currentIndex,
  };
}
