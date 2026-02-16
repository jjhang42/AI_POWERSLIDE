"use client";

import { useState } from "react";
import { useAspectRatio } from "@/lib/contexts/AspectRatioContext";
import { useNavigation } from "@/lib/contexts/NavigationContext";
import { Button } from "@/components/ui/button";
import { Download, FileText, Presentation, Image, Loader2 } from "lucide-react";

type ExportFormat = "pdf" | "ppt" | "keynote" | "jpeg" | "png";
type ExportQuality = "low" | "medium" | "high";

export function ExportSettings() {
  const { sections } = useNavigation();
  const { getCurrentRatio } = useAspectRatio();

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("ppt");
  const [selectedQuality, setSelectedQuality] = useState<ExportQuality>("medium");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({
    current: 0,
    total: 0,
    message: "",
    percentage: 0,
  });

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      // 현재 비율 가져오기
      const aspectRatio = getCurrentRatio();

      // 섹션 캡처
      setExportProgress({
        current: 0,
        total: sections.length,
        message: "섹션 캡처 중...",
        percentage: 0,
      });

      const { captureSections } = await import("@/lib/export");
      const capturedSections = await captureSections(
        sections,
        selectedQuality,
        (current, total) => {
          setExportProgress({
            current,
            total,
            message: `섹션 캡처 중... (${current}/${total})`,
            percentage: Math.round((current / total) * 50),
          });
        }
      );

      // Exporter 로딩 및 실행
      setExportProgress({
        current: 0,
        total: capturedSections.length,
        message: `${selectedFormat.toUpperCase()} 파일 생성 중...`,
        percentage: 50,
      });

      let exporter;
      switch (selectedFormat) {
        case "ppt":
        case "keynote":
          const { SimplePPTExporter } = await import(
            "@/lib/export/exporters/SimplePPTExporter"
          );
          exporter = new SimplePPTExporter();
          break;
        case "pdf":
          const { PDFExporter } = await import("@/lib/export/exporters/PDFExporter");
          exporter = new PDFExporter();
          break;
        case "jpeg":
        case "png":
          const { ImageExporter } = await import(
            "@/lib/export/exporters/ImageExporter"
          );
          exporter = new ImageExporter();
          break;
        default:
          throw new Error(`지원하지 않는 포맷: ${selectedFormat}`);
      }

      await exporter.export(
        capturedSections,
        { format: selectedFormat, quality: selectedQuality, aspectRatio },
        (progress) => {
          setExportProgress({
            current: progress.current,
            total: progress.total,
            message: progress.message,
            percentage: 50 + Math.round(progress.percentage / 2),
          });
        }
      );

      // 완료
      setExportProgress({
        current: capturedSections.length,
        total: capturedSections.length,
        message: "내보내기 완료!",
        percentage: 100,
      });

      // 2초 후 상태 초기화
      setTimeout(() => {
        setExportProgress({ current: 0, total: 0, message: "", percentage: 0 });
      }, 2000);
    } catch (error) {
      console.error("내보내기 실패:", error);
      setExportProgress({
        current: 0,
        total: 0,
        message: error instanceof Error ? error.message : "내보내기 실패",
        percentage: 0,
      });
      alert(error instanceof Error ? error.message : "내보내기에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">내보내기</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        프레젠테이션을 다양한 포맷으로 저장하세요 ({sections.length}개 슬라이드)
      </p>

      {/* 포맷 선택 */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">포맷</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedFormat("ppt")}
            disabled={isExporting}
            className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              selectedFormat === "ppt"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Presentation className="w-4 h-4" />
            <span className="font-medium">PPT</span>
          </button>
          <button
            onClick={() => setSelectedFormat("pdf")}
            disabled={isExporting}
            className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              selectedFormat === "pdf"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FileText className="w-4 h-4" />
            <span className="font-medium">PDF</span>
          </button>
          <button
            onClick={() => setSelectedFormat("png")}
            disabled={isExporting}
            className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              selectedFormat === "png"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Image className="w-4 h-4" />
            <span className="font-medium">PNG</span>
          </button>
          <button
            onClick={() => setSelectedFormat("jpeg")}
            disabled={isExporting}
            className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              selectedFormat === "jpeg"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Image className="w-4 h-4" />
            <span className="font-medium">JPEG</span>
          </button>
        </div>
      </div>

      {/* 품질 선택 */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">품질</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setSelectedQuality("low")}
            disabled={isExporting}
            className={`p-2 rounded-lg border-2 transition-all text-sm ${
              selectedQuality === "low"
                ? "border-primary bg-primary/10 font-medium"
                : "border-border hover:border-primary/50"
            } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            빠름
          </button>
          <button
            onClick={() => setSelectedQuality("medium")}
            disabled={isExporting}
            className={`p-2 rounded-lg border-2 transition-all text-sm ${
              selectedQuality === "medium"
                ? "border-primary bg-primary/10 font-medium"
                : "border-border hover:border-primary/50"
            } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            보통
          </button>
          <button
            onClick={() => setSelectedQuality("high")}
            disabled={isExporting}
            className={`p-2 rounded-lg border-2 transition-all text-sm ${
              selectedQuality === "high"
                ? "border-primary bg-primary/10 font-medium"
                : "border-border hover:border-primary/50"
            } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            최고
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {selectedQuality === "low" && "빠른 생성 (1배 해상도)"}
          {selectedQuality === "medium" && "균형 잡힌 품질 (2배 해상도)"}
          {selectedQuality === "high" && "최고 품질 (3배 해상도, 느림)"}
        </p>
      </div>

      {/* 내보내기 버튼 */}
      <Button
        onClick={handleExport}
        disabled={isExporting || sections.length === 0}
        className="w-full h-12 text-base font-medium"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            내보내는 중...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            내보내기 시작
          </>
        )}
      </Button>

      {/* 진행률 표시 */}
      {isExporting && exportProgress.total > 0 && (
        <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{exportProgress.message}</span>
            <span className="text-sm font-mono font-bold">
              {exportProgress.percentage}%
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${exportProgress.percentage}%` }}
            />
          </div>
          {exportProgress.total > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              {exportProgress.current} / {exportProgress.total}
            </div>
          )}
        </div>
      )}

      {/* 완료 메시지 */}
      {!isExporting && exportProgress.percentage === 100 && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            ✓ {exportProgress.message}
          </div>
        </div>
      )}
    </section>
  );
}
