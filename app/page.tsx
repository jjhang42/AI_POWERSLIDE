"use client";

import { useState } from "react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SimpleSettingsSidebar } from "@/components/SimpleSettingsSidebar";
import { AspectRatio } from "@/components/AspectRatioSelector";

export default function Home() {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <main className="relative">
      <SlideCanvas aspectRatio={aspectRatio} isFullscreen={isFullscreen}>
        {/* 빈 슬라이드 - 나중에 콘텐츠 추가 */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
          <div className="text-center space-y-4">
            <h1 className="text-8xl font-black tracking-tighter">iil</h1>
            <p className="text-2xl text-muted-foreground">Click 설정 to customize</p>
          </div>
        </div>
      </SlideCanvas>

      <SimpleSettingsSidebar
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        isFullscreen={isFullscreen}
        onFullscreenChange={setIsFullscreen}
      />
    </main>
  );
}
