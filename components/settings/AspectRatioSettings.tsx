"use client";

import { useState } from "react";
import { useAspectRatio, type AspectRatioPreset } from "@/lib/contexts/AspectRatioContext";
import { Button } from "@/components/ui/button";
import { Monitor, Maximize } from "lucide-react";

export function AspectRatioSettings() {
  const { preset, setPreset, customRatio, setCustomRatio, getRatioString } = useAspectRatio();
  const [customWidth, setCustomWidth] = useState(customRatio.width.toString());
  const [customHeight, setCustomHeight] = useState(customRatio.height.toString());

  const handlePresetChange = (newPreset: AspectRatioPreset) => {
    setPreset(newPreset);
  };

  const handleCustomRatioApply = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    if (width > 0 && height > 0) {
      setCustomRatio({ width, height });
      setPreset("custom");
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Monitor className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">화면 비율</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        프레젠테이션 슬라이드 비율을 선택하세요
      </p>

      <div className="space-y-3">
        {/* 16:9 */}
        <button
          onClick={() => handlePresetChange("16:9")}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            preset === "16:9"
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-semibold text-lg">16:9</div>
              <div className="text-sm text-muted-foreground">
                와이드 (1920×1080)
              </div>
            </div>
            <div className="w-16 h-9 bg-primary/20 rounded border-2 border-primary/40" />
          </div>
        </button>

        {/* 4:3 */}
        <button
          onClick={() => handlePresetChange("4:3")}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            preset === "4:3"
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-semibold text-lg">4:3</div>
              <div className="text-sm text-muted-foreground">
                클래식 (1024×768)
              </div>
            </div>
            <div className="w-12 h-9 bg-primary/20 rounded border-2 border-primary/40" />
          </div>
        </button>

        {/* 커스텀 */}
        <div
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            preset === "custom"
              ? "border-primary bg-primary/10"
              : "border-border"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Maximize className="w-4 h-4" />
            <div className="font-semibold">커스텀 비율</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              placeholder="가로"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              min="1"
            />
            <span className="text-muted-foreground">:</span>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(e.target.value)}
              placeholder="세로"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              min="1"
            />
            <Button
              size="sm"
              onClick={handleCustomRatioApply}
              className="shrink-0"
            >
              적용
            </Button>
          </div>
        </div>
      </div>

      {/* 현재 비율 표시 */}
      <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-border">
        <div className="text-sm text-muted-foreground mb-1">현재 비율</div>
        <div className="text-lg font-mono font-bold">{getRatioString()}</div>
      </div>
    </section>
  );
}
