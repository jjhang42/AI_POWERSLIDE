/**
 * 프레젠테이션 내보내기 Hook
 * NavigationContext와 AspectRatioContext를 연결하여 실제 내보내기 수행
 */

import { useCallback } from "react";
import { useNavigation } from "@/lib/contexts/NavigationContext";
import { useAspectRatio } from "@/lib/contexts/AspectRatioContext";
import type { ExportOptions, ExportProgress, CapturedSection } from "./types";
import { captureSections } from "./capture";

export function useExportPresentation() {
  const { sections } = useNavigation();
  const { getCurrentRatio } = useAspectRatio();

  /**
   * 프레젠테이션 내보내기 실행
   */
  const executeExport = useCallback(
    async (
      options: ExportOptions,
      onProgress?: (progress: ExportProgress) => void
    ): Promise<void> => {
      try {
        // 1. 섹션 필터링 (선택된 섹션만 또는 전체)
        let targetSections = sections;
        if (options.selectedSections && options.selectedSections.length > 0) {
          targetSections = sections.filter((s) =>
            options.selectedSections!.includes(s.id)
          );
        }

        if (targetSections.length === 0) {
          throw new Error("내보낼 섹션이 없습니다.");
        }

        // 2. 비율 설정
        const aspectRatio = options.aspectRatio || getCurrentRatio();

        // 3. 섹션 캡처
        if (onProgress) {
          onProgress({
            current: 0,
            total: targetSections.length,
            status: "capturing",
            message: "섹션 캡처 중...",
            percentage: 0,
          });
        }

        const capturedSections = await captureSections(
          targetSections,
          options.quality,
          (current, total) => {
            if (onProgress) {
              onProgress({
                current,
                total,
                status: "capturing",
                message: `섹션 캡처 중... (${current}/${total})`,
                percentage: Math.round((current / total) * 50), // 캡처는 전체의 50%
              });
            }
          }
        );

        if (capturedSections.length === 0) {
          throw new Error("섹션 캡처에 실패했습니다.");
        }

        // 4. Exporter 로딩 및 실행
        if (onProgress) {
          onProgress({
            current: 0,
            total: capturedSections.length,
            status: "generating",
            message: `${options.format.toUpperCase()} 파일 생성 중...`,
            percentage: 50,
          });
        }

        let exporter;
        switch (options.format) {
          case "ppt":
          case "keynote":
            const { SimplePPTExporter } = await import("../exporters/SimplePPTExporter");
            exporter = new SimplePPTExporter();
            break;
          case "pdf":
            const { PDFExporter } = await import("../exporters/PDFExporter");
            exporter = new PDFExporter();
            break;
          case "jpeg":
          case "png":
            const { ImageExporter } = await import(
              "../exporters/ImageExporter"
            );
            exporter = new ImageExporter();
            break;
          default:
            throw new Error(`지원하지 않는 포맷: ${options.format}`);
        }

        // 5. 파일 생성
        const result = await exporter.export(
          capturedSections,
          { ...options, aspectRatio },
          (progress) => {
            // Exporter의 진행률을 50~100%로 매핑
            if (onProgress) {
              onProgress({
                ...progress,
                percentage: 50 + Math.round(progress.percentage / 2),
              });
            }
          }
        );

        // 6. 결과 확인
        if (!result.success) {
          throw new Error(result.error?.message || "내보내기 실패");
        }

        // 7. 완료
        if (onProgress) {
          onProgress({
            current: capturedSections.length,
            total: capturedSections.length,
            status: "completed",
            message: `내보내기 완료! (${result.stats?.duration}ms)`,
            percentage: 100,
          });
        }

        // 성공 로그 (개발 환경)
        if (process.env.NODE_ENV === "development" && result.stats) {
          console.log("✅ Export Success:", {
            format: options.format,
            sections: result.stats.totalSections,
            duration: `${result.stats.duration}ms`,
            fileSize: result.stats.fileSize
              ? `${(result.stats.fileSize / 1024 / 1024).toFixed(2)}MB`
              : "N/A",
          });
        }
      } catch (error) {
        console.error("내보내기 실패:", error);
        throw error;
      }
    },
    [sections, getCurrentRatio]
  );

  return {
    executeExport,
    sectionsCount: sections.length,
  };
}
