/**
 * PDF Exporter
 * 모든 슬라이드를 하나의 PDF 파일로 내보내기
 */

import jsPDF from "jspdf";
import { BaseExporter } from "../core/Exporter";
import type { RenderedSlide } from "../types";

export interface PdfExporterOptions {
  /** 페이지 방향 */
  orientation?: "portrait" | "landscape";
  /** 페이지 크기 */
  format?: "a4" | "letter" | [number, number];
  /** 여백 (mm) */
  margin?: number;
}

export class PdfExporter extends BaseExporter {
  private pdf: jsPDF | null = null;
  private pdfOptions: PdfExporterOptions;

  constructor(
    options: PdfExporterOptions & { fileName?: string; quality?: number } = {}
  ) {
    super(options);
    this.pdfOptions = {
      orientation: options.orientation || "landscape",
      format: options.format || "a4",
      margin: options.margin ?? 0,
    };
  }

  protected async initialize(): Promise<void> {
    this.pdf = new jsPDF({
      orientation: this.pdfOptions.orientation,
      unit: "mm",
      format: this.pdfOptions.format,
    });
  }

  protected async createFile(slides: RenderedSlide[]): Promise<Blob> {
    if (!this.pdf) {
      throw new Error("PDF not initialized");
    }

    const pageWidth = this.pdf.internal.pageSize.getWidth();
    const pageHeight = this.pdf.internal.pageSize.getHeight();
    const margin = this.pdfOptions.margin || 0;

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];

      // 첫 페이지가 아니면 새 페이지 추가
      if (i > 0) {
        this.pdf.addPage();
      }

      // 이미지 크기 계산 (aspect ratio 유지하면서 페이지에 맞춤)
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const imageAspect = slide.width / slide.height;
      const pageAspect = availableWidth / availableHeight;

      let imgWidth: number;
      let imgHeight: number;

      if (imageAspect > pageAspect) {
        // 이미지가 더 넓음 - 너비 기준으로 맞춤
        imgWidth = availableWidth;
        imgHeight = availableWidth / imageAspect;
      } else {
        // 이미지가 더 높음 - 높이 기준으로 맞춤
        imgHeight = availableHeight;
        imgWidth = availableHeight * imageAspect;
      }

      // 중앙 정렬
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      // 이미지 추가
      this.pdf.addImage(
        slide.imageData,
        "PNG",
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
    }

    return this.pdf.output("blob");
  }

  protected async finalize(): Promise<void> {
    this.pdf = null;
  }

  /**
   * 내보내기 및 자동 다운로드
   */
  async exportAndDownload(slideElements: HTMLElement[]): Promise<void> {
    const result = await this.export(slideElements);
    if (result.success && result.blob) {
      this.downloadBlob(result.blob, `${this.options.fileName}.pdf`);
    }
  }
}
