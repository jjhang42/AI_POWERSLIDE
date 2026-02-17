"use client";

import { useState, useEffect } from "react";
import { SlideWithProps, TemplateProps } from "@/lib/types/slides";
import { Bot, User, ChevronDown, ChevronUp } from "lucide-react";

interface SlideCodePanelProps {
  slide: SlideWithProps | null;
  onUpdate: (newProps: Partial<TemplateProps>) => void;
}

const FIELDS = [
  {
    key: "className",
    label: "className",
    placeholder: "bg-blue-600 text-white rounded-xl shadow-2xl p-8 ...",
    description: "슬라이드 전체에 적용되는 Tailwind 클래스",
  },
  {
    key: "backgroundColor",
    label: "backgroundColor",
    placeholder: "bg-gradient-to-br from-blue-600 to-purple-700",
    description: "배경색 Tailwind 클래스 또는 CSS 값",
  },
  {
    key: "textColor",
    label: "textColor",
    placeholder: "text-white",
    description: "텍스트 색상 Tailwind 클래스",
  },
] as const;

export function SlideCodePanel({ slide, onUpdate }: SlideCodePanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  // 슬라이드 변경 시 값 동기화
  useEffect(() => {
    if (!slide) return;
    setValues({
      className: (slide.props as any).className || "",
      backgroundColor: (slide.props as any).backgroundColor || "",
      textColor: (slide.props as any).textColor || "",
    });
  }, [slide?.id]);

  if (!slide) return null;

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = (key: string) => {
    onUpdate({ [key]: values[key] } as Partial<TemplateProps>);
  };

  const handleKeyDown = (e: React.KeyboardEvent, key: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleApply(key);
    }
  };

  return (
    <div
      className="fixed bottom-0 z-40 bg-[#1e1e2e]/95 backdrop-blur-xl border-t border-white/10 text-sm"
      style={{ left: "220px", right: 0 }}
    >
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer select-none border-b border-white/5"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#cba6f7] font-semibold tracking-wider uppercase">
            Tailwind Code
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50">
            <User className="w-2.5 h-2.5" />
            <Bot className="w-2.5 h-2.5" />
            사람 / AI 전용
          </span>
          <span className="text-[10px] text-white/30 font-mono">
            {slide.name}
          </span>
        </div>
        <div className="text-white/30 hover:text-white/60 transition-colors">
          {collapsed ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {/* 코드 입력 영역 */}
      {!collapsed && (
        <div className="flex divide-x divide-white/5">
          {FIELDS.map(({ key, label, placeholder, description }) => (
            <div key={key} className="flex-1 flex flex-col">
              <div className="px-3 pt-2 pb-1 flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#89b4fa]">{label}</span>
                <span className="text-[10px] text-white/25">{description}</span>
              </div>
              <textarea
                value={values[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, key)}
                onBlur={() => handleApply(key)}
                placeholder={placeholder}
                rows={2}
                className="w-full bg-transparent font-mono text-xs text-[#cdd6f4] placeholder-white/15 px-3 pb-3 resize-none outline-none focus:bg-white/5 transition-colors leading-relaxed"
              />
            </div>
          ))}
        </div>
      )}

      {/* 하단 힌트 */}
      {!collapsed && (
        <div className="px-4 py-1.5 border-t border-white/5 flex items-center gap-4">
          <span className="text-[10px] text-white/25 font-mono">
            Enter → 즉시 적용 &nbsp;·&nbsp; Blur → 자동 저장
          </span>
          <span className="text-[10px] text-white/25 font-mono">
            window.aiHelpers.updateSlide(index, &#123; className: "..." &#125;)
          </span>
        </div>
      )}
    </div>
  );
}
