"use client";

/**
 * PresentationProvider
 * PresentationEngine을 React Context로 제공
 */

import React, { createContext, useContext, useRef, useEffect, useSyncExternalStore, useCallback, useMemo } from "react";
import { PresentationEngine } from "@/lib/engine/PresentationEngine";
import type { PresentationConfig, AspectRatioPreset, AspectRatioValue, Language } from "@/lib/engine/types";

const PresentationContext = createContext<PresentationEngine | null>(null);

// 서버 스냅샷 상수 (무한 루프 방지)
const EDITOR_SERVER_SNAPSHOT = {
  isOpen: false,
  activeTab: "add" as const,
  currentEditingId: null,
  dynamicSections: [],
};

interface PresentationProviderProps {
  children: React.ReactNode;
  config?: PresentationConfig;
  sections?: Array<{ id: string; title?: string }>;
}

export function PresentationProvider({
  children,
  config = {},
  sections = [],
}: PresentationProviderProps) {
  // Engine 인스턴스는 한 번만 생성
  const engineRef = useRef<PresentationEngine | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  if (!engineRef.current) {
    engineRef.current = new PresentationEngine({
      ...config,
      sections,
    });
  }

  const engine = engineRef.current;

  // 모든 언어 프리로드
  useEffect(() => {
    async function preloadTranslations() {
      try {
        await engine.language.preloadAll();
        setIsReady(true);
      } catch (error) {
        console.error("[PresentationProvider] Failed to preload translations:", error);
        setIsReady(true); // fallback을 사용하도록 계속 진행
      }
    }
    preloadTranslations();
  }, [engine]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // 번역 로딩 중일 때 로딩 표시
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PresentationContext.Provider value={engine}>
      {children}
    </PresentationContext.Provider>
  );
}

/**
 * PresentationEngine을 가져오는 Hook
 */
export function usePresentation(): PresentationEngine {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error("usePresentation must be used within a PresentationProvider");
  }
  return context;
}

// getServerSnapshot - 서버 사이드 렌더링용 초기값 (캐싱)
const navigationServerSnapshot = {
  sections: [],
  currentIndex: 0,
  isTransitioning: false,
};
const getNavigationServerSnapshot = () => navigationServerSnapshot;

/**
 * Navigation Hook (기존 useNavigation과 호환)
 */
export function useNavigation(): {
  sections: any[];
  currentIndex: number;
  isTransitioning: boolean;
  registerSection: (id: string, ref: any, title?: string) => void;
  unregisterSection: (id: string) => void;
  goToSection: (target: string | number) => void;
  next: () => void;
  prev: () => void;
  setCurrentIndex: (index: number) => void;
} {
  const engine = usePresentation();
  const snapshotRef = useRef<any>(null);

  // getSnapshot - 값이 실제로 변경될 때만 새 객체 반환
  const getSnapshot = useCallback(() => {
    const currentSections = engine.getSections();
    const currentIndex = engine.navigation.getCurrentIndex();
    const currentTransitioning = engine.navigation.getIsTransitioning();

    const prev = snapshotRef.current;

    // 배열 비교: 길이와 각 요소 확인
    const sectionsEqual = prev &&
      prev.sections.length === currentSections.length &&
      prev.sections.every((s: any, i: number) => s === currentSections[i]);

    if (
      prev &&
      sectionsEqual &&
      prev.currentIndex === currentIndex &&
      prev.isTransitioning === currentTransitioning
    ) {
      return prev;
    }

    const current = {
      sections: currentSections,
      currentIndex,
      isTransitioning: currentTransitioning,
    };

    snapshotRef.current = current;
    return current;
  }, [engine]);

  // Engine 상태를 구독하여 리렌더링 트리거
  const snapshot = useSyncExternalStore(
    useCallback((callback) => engine.subscribe(callback), [engine]),
    getSnapshot,
    getNavigationServerSnapshot
  );

  return {
    sections: snapshot.sections,
    currentIndex: snapshot.currentIndex,
    isTransitioning: snapshot.isTransitioning,
    registerSection: useCallback((id: string, ref: any, title?: string) =>
      engine.registerSection(id, ref, title), [engine]),
    unregisterSection: useCallback((id: string) =>
      engine.unregisterSection(id), [engine]),
    goToSection: useCallback((target: string | number) =>
      engine.goToSection(target), [engine]),
    next: useCallback(() => engine.nextSection(), [engine]),
    prev: useCallback(() => engine.prevSection(), [engine]),
    setCurrentIndex: useCallback((index: number) =>
      engine.navigation.setCurrentIndex(index), [engine]),
  };
}

// getServerSnapshot - 서버 사이드 렌더링용 초기값 (캐싱)
const aspectRatioServerSnapshot = {
  preset: "16:9" as const,
  customRatio: { width: 16, height: 9 },
  current: { width: 16, height: 9 },
};
const getAspectRatioServerSnapshot = () => aspectRatioServerSnapshot;

/**
 * AspectRatio Hook (기존 useAspectRatio와 호환)
 */
export function useAspectRatio(): {
  preset: AspectRatioPreset;
  customRatio: AspectRatioValue;
  setPreset: (preset: AspectRatioPreset) => void;
  setCustomRatio: (ratio: AspectRatioValue) => void;
  getCurrentRatio: () => AspectRatioValue;
  getRatioString: () => string;
} {
  const engine = usePresentation();
  const snapshotRef = useRef<any>(null);

  // getSnapshot - 값이 실제로 변경될 때만 새 객체 반환
  const getSnapshot = useCallback(() => {
    const preset = engine.aspectRatio.getPreset();
    const customRatio = engine.aspectRatio.getCustomRatio();
    const currentRatio = engine.aspectRatio.getCurrent();

    const prev = snapshotRef.current;

    // 객체 깊은 비교
    const customRatioEqual = prev &&
      prev.customRatio.width === customRatio.width &&
      prev.customRatio.height === customRatio.height;

    const currentRatioEqual = prev &&
      prev.current.width === currentRatio.width &&
      prev.current.height === currentRatio.height;

    if (
      prev &&
      prev.preset === preset &&
      customRatioEqual &&
      currentRatioEqual
    ) {
      return prev;
    }

    const current = {
      preset,
      customRatio,
      current: currentRatio,
    };

    snapshotRef.current = current;
    return current;
  }, [engine]);

  const snapshot = useSyncExternalStore(
    useCallback((callback) => engine.aspectRatio.subscribe(callback), [engine]),
    getSnapshot,
    getAspectRatioServerSnapshot
  );

  return {
    preset: snapshot.preset,
    customRatio: snapshot.customRatio,
    setPreset: useCallback((preset: any) =>
      engine.setAspectRatioPreset(preset), [engine]),
    setCustomRatio: useCallback((ratio: any) =>
      engine.setCustomAspectRatio(ratio), [engine]),
    getCurrentRatio: useCallback(() => snapshot.current, [snapshot.current]),
    getRatioString: useCallback(() =>
      engine.aspectRatio.getRatioString(), [engine]),
  };
}

// getServerSnapshot - 서버 사이드 렌더링용 초기값 (캐싱)
const languageServerSnapshot = {
  language: "en" as const,
};
const getLanguageServerSnapshot = () => languageServerSnapshot;

/**
 * Language Hook (기존 useLanguage와 호환)
 */
export function useLanguage(): {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
} {
  const engine = usePresentation();
  const snapshotRef = useRef<any>(null);

  // getSnapshot - 값이 실제로 변경될 때만 새 객체 반환
  const getSnapshot = useCallback(() => {
    const current = {
      language: engine.language.getCurrent(),
    };

    const prev = snapshotRef.current;
    if (prev && prev.language === current.language) {
      return prev;
    }

    snapshotRef.current = current;
    return current;
  }, [engine]);

  const snapshot = useSyncExternalStore(
    useCallback((callback) => engine.language.subscribe(callback), [engine]),
    getSnapshot,
    getLanguageServerSnapshot
  );

  return {
    language: snapshot.language,
    setLanguage: useCallback((lang: any) =>
      engine.setLanguage(lang), [engine]),
    t: useCallback((key: string) =>
      engine.language.translate(key), [engine]),
  };
}

/**
 * Export Hook (기존 Export 기능과 호환)
 */
export function useExportEngine() {
  const engine = usePresentation();

  const snapshot = useSyncExternalStore(
    (callback) => engine.export.subscribe(callback),
    () => ({
      progress: engine.export.getProgress(),
      isExporting: engine.export.getIsExporting(),
    }),
    () => ({
      progress: {
        current: 0,
        total: 0,
        status: "idle" as const,
        message: "",
        percentage: 0,
      },
      isExporting: false,
    })
  );

  return {
    progress: snapshot.progress,
    isExporting: snapshot.isExporting,
    exportPresentation: engine.exportPresentation.bind(engine),
    cancelExport: engine.cancelExport.bind(engine),
  };
}

/**
 * Editor Hook (에디터 사이드바 관리)
 */
export function useEditor() {
  const engine = usePresentation();
  const snapshotRef = useRef<any>(null);

  // getSnapshot - 값이 실제로 변경될 때만 새 객체 반환
  const getSnapshot = useCallback(() => {
    const state = engine.editor.getState();

    const prev = snapshotRef.current;

    // 배열 비교
    const sectionsEqual = prev &&
      prev.dynamicSections.length === state.dynamicSections.length &&
      prev.dynamicSections.every((s: any, i: number) => s === state.dynamicSections[i]);

    if (
      prev &&
      prev.isOpen === state.isOpen &&
      prev.activeTab === state.activeTab &&
      prev.currentEditingId === state.currentEditingId &&
      sectionsEqual
    ) {
      return prev;
    }

    const current = {
      isOpen: state.isOpen,
      activeTab: state.activeTab,
      currentEditingId: state.currentEditingId,
      dynamicSections: state.dynamicSections,
    };

    snapshotRef.current = current;
    return current;
  }, [engine]);

  const snapshot = useSyncExternalStore(
    useCallback((callback) => engine.editor.subscribe(callback), [engine]),
    getSnapshot,
    () => EDITOR_SERVER_SNAPSHOT
  );

  return {
    isOpen: snapshot.isOpen,
    activeTab: snapshot.activeTab,
    currentEditingId: snapshot.currentEditingId,
    dynamicSections: snapshot.dynamicSections,
    toggleSidebar: useCallback(() => engine.editor.toggleSidebar(), [engine]),
    openSidebar: useCallback(() => engine.editor.openSidebar(), [engine]),
    closeSidebar: useCallback(() => engine.editor.closeSidebar(), [engine]),
    setActiveTab: useCallback((tab: "add" | "edit" | "manage") =>
      engine.editor.setActiveTab(tab), [engine]),
    addSection: useCallback((templateType: any, templateData: any) =>
      engine.editor.addSection(templateType, templateData), [engine]),
    updateSection: useCallback((id: string, templateData: any) =>
      engine.editor.updateSection(id, templateData), [engine]),
    deleteSection: useCallback((id: string) =>
      engine.editor.deleteSection(id), [engine]),
    reorderSections: useCallback((newOrder: string[]) =>
      engine.editor.reorderSections(newOrder), [engine]),
    setCurrentEditingId: useCallback((id: string | null) =>
      engine.editor.setCurrentEditingId(id), [engine]),
  };
}
