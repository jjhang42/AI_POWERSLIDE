/**
 * 슬라이드 캡처 유틸리티
 */

import type {
  SlideInfo,
  CapturedSlide,
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
 * 슬라이드를 이미지로 캡처
 */
export async function captureSlide(
  slide: SlideInfo,
  quality: ExportQuality
): Promise<CapturedSlide> {
  // 동적으로 html2canvas 로딩
  const html2canvas = (await import("html2canvas")).default;

  // 폰트 로딩 대기
  await waitForFonts();

  // Slide 내부의 aspectRatio 컨테이너 찾기
  const container = slide.ref.current?.querySelector(
    '[style*="aspect-ratio"]'
  ) as HTMLElement;

  if (!container) {
    throw new Error(`슬라이드를 찾을 수 없습니다: ${slide.id}`);
  }

  // 슬라이드가 화면에 보이도록 스크롤
  const slideElement = slide.ref.current;
  if (slideElement) {
    slideElement.scrollIntoView({ behavior: "instant", block: "start" });
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
      id: slide.id,
      title: slide.title || slide.id,
      imageData,
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    console.error(`슬라이드 캡처 실패: ${slide.id}`, error);
    throw new Error(`슬라이드 캡처 실패: ${slide.id}`);
  }
}

/**
 * 여러 슬라이드를 순차적으로 캡처
 */
export async function captureSlides(
  slides: SlideInfo[],
  quality: ExportQuality,
  onProgress?: (current: number, total: number) => void
): Promise<CapturedSlide[]> {
  const capturedSlides: CapturedSlide[] = [];
  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const slide = slides[i];

    try {
      // 진행률 업데이트
      if (onProgress) {
        onProgress(i + 1, total);
      }

      // 슬라이드 캡처
      const captured = await captureSlide(slide, quality);
      capturedSlides.push(captured);

      // 메모리 정리를 위한 짧은 대기
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`슬라이드 ${slide.id} 캡처 실패, 건너뜁니다.`, error);
      // 실패한 슬라이드는 건너뛰고 계속 진행
    }
  }

  return capturedSlides;
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
