/**
 * JPG Exporter
 * 각 슬라이드를 개별 JPG 파일로 내보내기
 */

import JSZip from "jszip";
import { BaseExporter } from "../core/Exporter";
import type { RenderedSlide } from "../types";

export class JpgExporter extends BaseExporter {
  private zip: JSZip | null = null;

  protected async initialize(): Promise<void> {
    this.zip = new JSZip();
  }

  protected async createFile(slides: RenderedSlide[]): Promise<Blob> {
    if (!this.zip) {
      throw new Error("Exporter not initialized");
    }

    // 각 슬라이드를 JPG로 변환하여 ZIP에 추가
    for (const slide of slides) {
      const jpgBlob = await this.convertToJpg(slide.imageData);
      const fileName = `slide-${String(slide.index + 1).padStart(2, "0")}.jpg`;
      this.zip.file(fileName, jpgBlob);
    }

    // ZIP 파일 생성
    return await this.zip.generateAsync({ type: "blob" });
  }

  protected async finalize(): Promise<void> {
    this.zip = null;
  }

  /**
   * PNG data URL을 JPG Blob으로 변환
   */
  private async convertToJpg(dataURL: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // 흰색 배경
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 이미지 그리기
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create JPG blob"));
            }
          },
          "image/jpeg",
          this.options.quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = dataURL;
    });
  }

  /**
   * 내보내기 및 자동 다운로드
   */
  async exportAndDownload(slideElements: HTMLElement[]): Promise<void> {
    const result = await this.export(slideElements);
    if (result.success && result.blob) {
      this.downloadBlob(result.blob, `${this.options.fileName}.zip`);
    }
  }
}
