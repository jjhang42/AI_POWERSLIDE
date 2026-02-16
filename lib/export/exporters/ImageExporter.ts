/**
 * 이미지 내보내기
 * 각 섹션을 개별 이미지 파일(JPEG/PNG)로 저장
 */

import type {
  Exporter,
  CapturedSection,
  ExportOptions,
  ExportProgress,
  ExportResult,
} from "../core/types";
import { base64ToBlob } from "../core/capture";

export class ImageExporter implements Exporter {
  /**
   * 프레젠테이션을 이미지 파일들로 내보내기
   */
  async export(
    sections: CapturedSection[],
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    const startTime = Date.now();

    try {
      // 동적으로 file-saver 로딩
      const { saveAs } = await import("file-saver");

      const total = sections.length;
      const format = options.format === "jpeg" ? "jpeg" : "png";
      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";

      // 각 섹션을 개별 파일로 저장
      for (let i = 0; i < total; i++) {
        const section = sections[i];

        // 진행률 업데이트
        if (onProgress) {
          onProgress({
            current: i + 1,
            total,
            status: "generating",
            message: `이미지 저장 중... (${i + 1}/${total})`,
            percentage: Math.round(((i + 1) / total) * 100),
          });
        }

        // Base64를 Blob으로 변환
        let imageData = section.imageData;

        // JPEG로 변환이 필요한 경우
        if (format === "jpeg" && imageData.startsWith("data:image/png")) {
          imageData = await this.convertToJPEG(imageData);
        }

        const blob = base64ToBlob(imageData, mimeType);

        // 파일명 생성
        const fileName = this.generateFileName(
          options.fileName,
          i + 1,
          section.title,
          format
        );

        // 파일 저장
        saveAs(blob, fileName);

        // 브라우저가 다운로드를 처리할 시간 부여
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (onProgress) {
        onProgress({
          current: total,
          total,
          status: "completed",
          message: `${total}개 이미지 내보내기 완료!`,
          percentage: 100,
        });
      }

      // 성공 결과 반환
      const duration = Date.now() - startTime;
      return {
        success: true,
        stats: {
          totalSections: total,
          capturedSections: total,
          failedSections: 0,
          duration,
        },
      };
    } catch (error) {
      console.error("이미지 내보내기 실패:", error);

      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";

      // 에러 결과 반환
      return {
        success: false,
        error: {
          type: "generation_failed",
          message: `이미지 내보내기 실패: ${errorMessage}`,
          details: error instanceof Error ? error.stack : undefined,
          timestamp: Date.now(),
        },
        stats: {
          totalSections: sections.length,
          capturedSections: 0,
          failedSections: sections.length,
          duration,
        },
      };
    }
  }

  /**
   * PNG를 JPEG로 변환
   */
  private async convertToJPEG(pngBase64: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context를 생성할 수 없습니다."));
          return;
        }

        // 흰색 배경 추가 (JPEG는 투명도 미지원)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 이미지 그리기
        ctx.drawImage(img, 0, 0);

        // JPEG로 변환 (품질 0.95)
        const jpegBase64 = canvas.toDataURL("image/jpeg", 0.95);
        resolve(jpegBase64);
      };

      img.onerror = () => {
        reject(new Error("이미지 로딩 실패"));
      };

      img.src = pngBase64;
    });
  }

  /**
   * 파일명 생성
   */
  private generateFileName(
    customName: string | undefined,
    index: number,
    title: string | undefined,
    extension: string
  ): string {
    const baseName = customName || "slide";

    // 제목이 있으면 사용 (파일명에 안전한 형태로 변환)
    const safeName = title
      ? title.replace(/[^a-zA-Z0-9가-힣]/g, "-").toLowerCase()
      : `${index}`;

    return `${baseName}-${safeName}.${extension}`;
  }
}
