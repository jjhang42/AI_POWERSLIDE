/**
 * 섹션 캡처 유틸리티
 */

import type {
  SectionInfo,
  CapturedSection,
  ExportQuality,
  CaptureOptions,
} from "./types";

/**
 * 품질 설정에 따른 스케일 값 반환
 */
function getScaleForQuality(quality: ExportQuality): number {
  switch (quality) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 2;
  }
}

/**
 * 폰트 로딩 완료 대기
 */
async function waitForFonts(): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  // 추가 대기 시간 (안전장치)
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * 섹션을 이미지로 캡처
 */
export async function captureSection(
  section: SectionInfo,
  quality: ExportQuality
): Promise<CapturedSection> {
  // 동적으로 html2canvas 로딩
  const html2canvas = (await import("html2canvas")).default;

  // 폰트 로딩 대기
  await waitForFonts();

  // Section 내부의 aspectRatio 컨테이너 찾기
  const container = section.ref.current?.querySelector(
    '[style*="aspect-ratio"]'
  ) as HTMLElement;

  if (!container) {
    throw new Error(`섹션을 찾을 수 없습니다: ${section.id}`);
  }

  // 섹션이 화면에 보이도록 스크롤
  const sectionElement = section.ref.current;
  if (sectionElement) {
    sectionElement.scrollIntoView({ behavior: "instant", block: "start" });
    // 스크롤 완료 및 렌더링 대기
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // html2canvas 옵션 설정
  const options: CaptureOptions = {
    scale: getScaleForQuality(quality),
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: false,
  };

  try {
    // 캡처 실행
    const canvas = await html2canvas(container, options);

    // Base64 PNG 데이터 생성
    const imageData = canvas.toDataURL("image/png", 0.95);

    return {
      id: section.id,
      title: section.title || section.id,
      imageData,
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    console.error(`섹션 캡처 실패: ${section.id}`, error);
    throw new Error(`섹션 캡처 실패: ${section.id}`);
  }
}

/**
 * 여러 섹션을 순차적으로 캡처
 */
export async function captureSections(
  sections: SectionInfo[],
  quality: ExportQuality,
  onProgress?: (current: number, total: number) => void
): Promise<CapturedSection[]> {
  const capturedSections: CapturedSection[] = [];
  const total = sections.length;

  for (let i = 0; i < total; i++) {
    const section = sections[i];

    try {
      // 진행률 업데이트
      if (onProgress) {
        onProgress(i + 1, total);
      }

      // 섹션 캡처
      const captured = await captureSection(section, quality);
      capturedSections.push(captured);

      // 메모리 정리를 위한 짧은 대기
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`섹션 ${section.id} 캡처 실패, 건너뜁니다.`, error);
      // 실패한 섹션은 건너뛰고 계속 진행
    }
  }

  return capturedSections;
}

/**
 * Base64 이미지를 Blob으로 변환
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeType });
}
