/**
 * Slide Renderer
 * html2canvas를 사용한 슬라이드 렌더링
 */

import html2canvas from "html2canvas";
import type { RenderedSlide } from "../types";

export interface RenderOptions {
  /** 배경 투명도 */
  backgroundColor?: string | null;
  /** 스케일 (고해상도용) */
  scale?: number;
  /** 품질 */
  quality?: number;
}

export class SlideRenderer {
  private readonly defaultOptions: RenderOptions = {
    backgroundColor: "#ffffff",
    scale: 2, // 레티나 디스플레이 대응
    quality: 1.0,
  };

  /**
   * 단일 슬라이드를 이미지로 렌더링
   */
  async renderSlide(
    element: HTMLElement,
    index: number,
    options?: RenderOptions
  ): Promise<RenderedSlide> {
    const opts = { ...this.defaultOptions, ...options };

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: opts.backgroundColor,
        scale: opts.scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png", opts.quality);

      return {
        index,
        imageData,
        width: canvas.width,
        height: canvas.height,
      };
    } catch (error) {
      throw new Error(
        `Failed to render slide ${index}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * 여러 슬라이드를 순차적으로 렌더링
   */
  async renderSlides(
    elements: HTMLElement[],
    options?: RenderOptions,
    onProgress?: (current: number, total: number) => void
  ): Promise<RenderedSlide[]> {
    const results: RenderedSlide[] = [];

    for (let i = 0; i < elements.length; i++) {
      const slide = await this.renderSlide(elements[i], i, options);
      results.push(slide);

      if (onProgress) {
        onProgress(i + 1, elements.length);
      }
    }

    return results;
  }

  /**
   * Data URL을 Blob으로 변환
   */
  dataURLToBlob(dataURL: string): Blob {
    const parts = dataURL.split(",");
    const contentType = parts[0].match(/:(.*?);/)?.[1] || "image/png";
    const raw = atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }
}
