/**
 * 프레젠테이션 내보내기 Hook
 * useSlides와 연결하여 실제 내보내기 수행
 */

import { useCallback, useRef, useEffect } from "react";
import type { ExportOptions, ExportProgress, CapturedSlide, SlideInfo } from "./types";
import { captureSlides } from "./capture";
import type { SlideWithProps } from "@/lib/types/slides";

export function useExportPresentation(
  slides: SlideWithProps[],
  aspectRatio: { width: number; height: number } = { width: 1920, height: 1080 }
) {
  // 각 슬라이드에 대한 ref 저장
  const slideRefs = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map());

  // 슬라이드 ref 등록 함수
  const registerSlideRef = useCallback((slideId: string, ref: React.RefObject<HTMLDivElement>) => {
    slideRefs.current.set(slideId, ref);
  }, []);

  /**
   * 프레젠테이션 내보내기 실행
   */
  const executeExport = useCallback(
    async (
      options: ExportOptions,
      onProgress?: (progress: ExportProgress) => void
    ): Promise<void> => {
      try {
        // 1. 슬라이드 필터링 (선택된 슬라이드만 또는 전체)
        let targetSlides = slides;
        if (options.selectedSlides && options.selectedSlides.length > 0) {
          targetSlides = slides.filter((s) =>
            options.selectedSlides!.includes(s.id)
          );
        }

        if (targetSlides.length === 0) {
          throw new Error("내보낼 슬라이드가 없습니다.");
        }

        // 2. 비율 설정
        const exportAspectRatio = options.aspectRatio || aspectRatio;

        // 3. 슬라이드 정보 생성 (SlideInfo 타입으로 변환)
        const slideInfos: SlideInfo[] = targetSlides.map((slide, index) => ({
          id: slide.id,
          index,
          ref: slideRefs.current.get(slide.id) || { current: null },
          title: slide.name,
        }));

        // 4. 슬라이드 캡처
        if (onProgress) {
          onProgress({
            current: 0,
            total: slideInfos.length,
            status: "capturing",
            message: "슬라이드 캡처 중...",
            percentage: 0,
          });
        }

        const capturedSlides = await captureSlides(
          slideInfos,
          options.quality,
          (current, total) => {
            if (onProgress) {
              onProgress({
                current,
                total,
                status: "capturing",
                message: `슬라이드 캡처 중... (${current}/${total})`,
                percentage: Math.round((current / total) * 50), // 캡처는 전체의 50%
              });
            }
          }
        );

        if (capturedSlides.length === 0) {
          throw new Error("슬라이드 캡처에 실패했습니다.");
        }

        // 5. Exporter 로딩 및 실행
        if (onProgress) {
          onProgress({
            current: 0,
            total: capturedSlides.length,
            status: "generating",
            message: `${options.format.toUpperCase()} 파일 생성 중...`,
            percentage: 50,
          });
        }

        let exporter: any; // Exporter 타입은 CapturedSlide[]를 받음
        switch (options.format) {
          case "ppt":
          case "keynote":
            const { SimplePPTExporter } = await import("../exporters/SimplePPTExporter");
            exporter = new SimplePPTExporter();
            break;
          case "pdf":
            const { PdfExporter } = await import("../exporters/PdfExporter");
            exporter = new PdfExporter();
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

        // 6. 파일 생성
        const result = await exporter.export(
          capturedSlides,
          { ...options, aspectRatio: exportAspectRatio },
          (progress: ExportProgress) => {
            // Exporter의 진행률을 50~100%로 매핑
            if (onProgress) {
              onProgress({
                ...progress,
                percentage: 50 + Math.round(progress.percentage / 2),
              });
            }
          }
        );

        // 7. 결과 확인
        if (!result.success) {
          throw new Error(result.error?.message || "내보내기 실패");
        }

        // 8. 완료
        if (onProgress) {
          onProgress({
            current: capturedSlides.length,
            total: capturedSlides.length,
            status: "completed",
            message: `내보내기 완료! (${result.stats?.duration}ms)`,
            percentage: 100,
          });
        }

        // 성공 로그 (개발 환경)
        if (process.env.NODE_ENV === "development" && result.stats) {
          console.log("✅ Export Success:", {
            format: options.format,
            slides: result.stats.totalSlides,
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
    [slides, aspectRatio]
  );

  return {
    executeExport,
    registerSlideRef,
    slidesCount: slides.length,
  };
}
