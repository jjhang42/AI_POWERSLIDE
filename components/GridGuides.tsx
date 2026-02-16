"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid3x3, Eye, EyeOff } from "lucide-react";

interface GridGuidesProps {
  aspectRatio: "16:9" | "4:3" | "16:10";
}

export function GridGuides({ aspectRatio }: GridGuidesProps) {
  const [showGrid, setShowGrid] = useState(false);
  const [showGuides, setShowGuides] = useState(false);

  const dimensions = {
    "16:9": { width: 1920, height: 1080 },
    "4:3": { width: 1920, height: 1440 },
    "16:10": { width: 1920, height: 1200 },
  };

  const { width, height } = dimensions[aspectRatio];

  if (!showGrid && !showGuides) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setShowGrid(true);
          setShowGuides(true);
        }}
        className="fixed bottom-6 left-[152px] z-40 rounded-full"
        title="Show Grid & Guides"
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          if (showGrid && showGuides) {
            setShowGrid(false);
            setShowGuides(false);
          } else {
            setShowGrid(true);
            setShowGuides(true);
          }
        }}
        className="fixed bottom-6 left-[152px] z-40 rounded-full"
        title="Hide Grid & Guides"
      >
        {showGrid && showGuides ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </Button>

      {/* Grid & Guides Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[45] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute w-full h-full"
          style={{
            opacity: 0.5,
          }}
        >
          {/* Center Guides */}
          {showGuides && (
            <>
              {/* Vertical Center Line */}
              <line
                x1={width / 2}
                y1={0}
                x2={width / 2}
                y2={height}
                stroke="#007AFF"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
              {/* Horizontal Center Line */}
              <line
                x1={0}
                y1={height / 2}
                x2={width}
                y2={height / 2}
                stroke="#007AFF"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
              {/* Safe Area Guides (10% margin) */}
              <rect
                x={width * 0.1}
                y={height * 0.1}
                width={width * 0.8}
                height={height * 0.8}
                fill="none"
                stroke="#34C759"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </>
          )}

          {/* 12x12 Grid */}
          {showGrid && (
            <>
              {/* Vertical Grid Lines */}
              {Array.from({ length: 13 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={(width / 12) * i}
                  y1={0}
                  x2={(width / 12) * i}
                  y2={height}
                  stroke="#8E8E93"
                  strokeWidth="0.5"
                  opacity={i % 3 === 0 ? 0.6 : 0.3}
                />
              ))}
              {/* Horizontal Grid Lines */}
              {Array.from({ length: 13 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={(height / 12) * i}
                  x2={width}
                  y2={(height / 12) * i}
                  stroke="#8E8E93"
                  strokeWidth="0.5"
                  opacity={i % 3 === 0 ? 0.6 : 0.3}
                />
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="fixed top-24 right-6 z-40 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-lg p-3 text-xs space-y-2">
        <div className="font-bold mb-2">Grid & Guides</div>
        {showGuides && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-[#007AFF]" />
              <span className="text-muted-foreground">Center Lines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-[#34C759]" />
              <span className="text-muted-foreground">Safe Area</span>
            </div>
          </>
        )}
        {showGrid && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[#8E8E93]" />
            <span className="text-muted-foreground">12x12 Grid</span>
          </div>
        )}
      </div>
    </>
  );
}
