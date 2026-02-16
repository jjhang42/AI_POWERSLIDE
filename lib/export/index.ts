/**
 * Export API
 * 구글 스타일 Public API (클라이언트 사이드 전용)
 */

export * from "./types";
export { SlideRenderer } from "./core/Renderer";
export { BaseExporter } from "./core/Exporter";
export { JpgExporter } from "./exporters/JpgExporter";
export { PdfExporter } from "./exporters/PdfExporter";
export { PptxExporter } from "./exporters/PptxExporter";

// 편의 함수
export async function exportToJpg(
  slideElements: HTMLElement[],
  fileName = "presentation"
): Promise<void> {
  const { JpgExporter } = await import("./exporters/JpgExporter");
  const exporter = new JpgExporter({ fileName });
  await exporter.exportAndDownload(slideElements);
}

export async function exportToPdf(
  slideElements: HTMLElement[],
  fileName = "presentation"
): Promise<void> {
  const { PdfExporter } = await import("./exporters/PdfExporter");
  const exporter = new PdfExporter({ fileName });
  await exporter.exportAndDownload(slideElements);
}

export async function exportToPptx(
  slideElements: HTMLElement[],
  fileName = "presentation"
): Promise<void> {
  const { PptxExporter } = await import("./exporters/PptxExporter");
  const exporter = new PptxExporter({ fileName });
  await exporter.exportAndDownload(slideElements);
}
