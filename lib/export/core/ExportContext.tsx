"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import type {
  ExportOptions,
  ExportProgress,
  ExportStatus,
  CapturedSection,
} from "./types";
import { captureSections } from "./capture";

interface ExportContextType {
  progress: ExportProgress;
  isExporting: boolean;
  exportPresentation: (options: ExportOptions) => Promise<void>;
  cancelExport: () => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({ children }: { children: React.ReactNode }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress>({
    current: 0,
    total: 0,
    status: "idle",
    message: "",
    percentage: 0,
  });

  const cancelledRef = useRef(false);

  /**
   * 진행률 업데이트
   */
  const updateProgress = useCallback(
    (
      current: number,
      total: number,
      status: ExportStatus,
      message: string
    ) => {
      const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
      setProgress({ current, total, status, message, percentage });
    },
    []
  );

  /**
   * 내보내기 취소
   */
  const cancelExport = useCallback(() => {
    cancelledRef.current = true;
    updateProgress(0, 0, "cancelled", "내보내기가 취소되었습니다.");
    setIsExporting(false);
  }, [updateProgress]);

  /**
   * 프레젠테이션 내보내기
   */
  const exportPresentation = useCallback(
    async (options: ExportOptions) => {
      // 이미 내보내기 중이면 중단
      if (isExporting) {
        console.warn("이미 내보내기가 진행 중입니다.");
        return;
      }

      setIsExporting(true);
      cancelledRef.current = false;

      try {
        updateProgress(0, 100, "preparing", "내보내기 준비 중...");

        // useExportPresentation hook은 컴포넌트 레벨에서 사용되므로
        // 여기서는 직접 import하여 사용하는 패턴 대신
        // 이 함수를 외부에서 주입받는 방식으로 변경 필요
        // 현재는 placeholder로 에러 발생
        throw new Error(
          "exportPresentation은 useExport hook을 통해 호출해야 합니다."
        );
      } catch (error) {
        console.error("내보내기 실패:", error);
        updateProgress(
          0,
          0,
          "error",
          error instanceof Error ? error.message : "내보내기 실패"
        );
      } finally {
        setIsExporting(false);
      }
    },
    [isExporting, updateProgress]
  );

  return (
    <ExportContext.Provider
      value={{
        progress,
        isExporting,
        exportPresentation,
        cancelExport,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  const context = useContext(ExportContext);
  if (context === undefined) {
    throw new Error("useExport must be used within an ExportProvider");
  }
  return context;
}
